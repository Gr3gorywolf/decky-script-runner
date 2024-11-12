import pty
import re
import socket
import subprocess
import os
import json
import asyncio
from threading import Thread
import threading
import time
# The decky plugin module is located at decky-loader/plugin
import decky
SCRIPTS_DIR = decky.DECKY_PLUGIN_RUNTIME_DIR + "/scripts"  # Directory to store files
stop_event = asyncio.Event()
# Ensure the upload directory exists
os.makedirs(SCRIPTS_DIR, exist_ok=True)
LOG_DIR = SCRIPTS_DIR + "/logs"
# Path to the script that will act as the server
SERVER_SCRIPT_PATH = decky.DECKY_PLUGIN_DIR + "/assets/script-loader-server.py"
METADATA_FILE = os.path.join(SCRIPTS_DIR, "metadata.json")
# This will hold the process reference for the running script (if any)
server_process = None
running_scripts_map = {}
os.makedirs(SCRIPTS_DIR, exist_ok=True)
os.makedirs(LOG_DIR, exist_ok=True)
def parse_metadata(file_path):
    """
    Parse the metadata from the top of a script file, or set default values if metadata is missing.
    """
    metadata = {}
    file_name = os.path.basename(file_path)
    file_title = os.path.splitext(file_name)[0].replace("_", " ").replace("-", " ").title()
    file_extension = os.path.splitext(file_name)[1][1:]
    validKeys = ["title", "language", "version", "author", "root", "description", "image"]

    with open(file_path, 'r') as f:
        content = f.read()
        # Find metadata section using regex
        metadata_match = re.search(r"----------metadata---------\n(.+?)\n----------metadata---------", content, re.DOTALL)
        if metadata_match:
            # Parse metadata if found
            for line in metadata_match.group(1).splitlines():
                key, value = line.split(":", 1)
                if key.strip() in validKeys:
                    if key.strip() == "root":
                        metadata[key.strip()] = value.strip().lower() == "true"
                    else:
                        metadata[key.strip()] = value.strip()

    # Set default values for missing metadata fields
    metadata.setdefault("title", file_title)  # Humanized file name
    metadata.setdefault("language", file_extension)  # File extension as language
    metadata.setdefault("version", "0.0.0")
    metadata.setdefault("author", "unknown")
    metadata.setdefault("root", False)
    metadata.setdefault("description", "")
    metadata.setdefault("image", "")
    return metadata

def compile_metadata():
    """
    Compile metadata from all script files in SCRIPTS_DIR and save to METADATA_FILE.
    Only reparse files whose last modification time has changed.
    """
    # Load existing metadata if available
    if os.path.exists(METADATA_FILE):
        with open(METADATA_FILE, 'r') as f:
            try:
                existing_metadata = {item['name']: item for item in json.load(f)}
            except json.JSONDecodeError:
                existing_metadata = {}
    else:
        existing_metadata = {}

    metadata_list = []
    for file_name in os.listdir(SCRIPTS_DIR):
        file_path = os.path.join(SCRIPTS_DIR, file_name)
        if file_name.endswith('.json') or not os.path.isfile(file_path):
            continue

        # Get the last modification time of the file
        mtime = os.path.getmtime(file_path)

        # Check if we need to reparse metadata based on mtime
        if (file_name in existing_metadata and 
            existing_metadata[file_name].get("mtime") == mtime):
            # Use existing metadata entry if mtime matches
            metadata_list.append(existing_metadata[file_name])
        else:
            # Parse metadata and add mtime if the file has been modified
            metadata = parse_metadata(file_path)
            metadata["name"] = file_name
            metadata["mtime"] = mtime
            metadata_list.append(metadata)
        # Save the updated metadata list
        with open(METADATA_FILE, 'w') as f:
            json.dump(metadata_list, f, indent=4)
    return metadata_list

def monitor_process_from_fd(master_fd,slave_fd,process, log_file_path):
    with open(log_file_path, 'w', buffering=1) as log_file:
        while True:
            try:
                output = os.read(master_fd, 1024).decode()
                if output:
                    log_file.write(output)
                    log_file.flush()
                
                if process.poll() is not None:
                    break
            except OSError:
                break
    
    os.close(master_fd)
    os.close(slave_fd)
class Plugin:
    async def _main(self):
        decky.logger.info("Decky Script Loader plugin loaded.")
    
    async def _unload(self):
        decky.logger.info("Decky Script Loader plugin unloaded.")
        await self.stop_server()
    
    async def get_scripts_data(self):
        script_infos = compile_metadata()
        return json.dumps(script_infos)

    async def get_device_ip(self):
        return socket.gethostbyname(socket.gethostname())
    
    ## SideLoading Server API
    async def is_server_running(self):
        """Checks if the server script is running."""
        return server_process is not None and server_process.poll() is None
    async def toggle_server(self):
        if await self.is_server_running():
            await self.stop_server()
        else:
            await self.start_server()

    async def start_server(self):
        """Start the server by running the Python script."""
        if await self.is_server_running():
            decky.logger.info("Server is already running.")
            return 0
        
        global server_process
        server_process = subprocess.Popen(
            ["python3", SERVER_SCRIPT_PATH]
        )
        await decky.emit("server_status_change",True)
        decky.logger.info("Server started with PID: " + str(server_process.pid))
        return 0

    async def stop_server(self):
        """Stop the running server."""
        if not await self.is_server_running():
            decky.logger.info("Server is not running.")
            return 0
        
        global server_process
        try:
            server_process.terminate()
            server_process.wait()  # Ensure the process has finished
            decky.logger.info("Server stopped.")
            await decky.emit("server_status_change",False)
        except Exception as e:
            decky.logger.error(f"Failed to stop server: {e}")
            return 1
        finally:
            server_process = None
        return 0
    

     # Script runner API
    async def run_script(self, script_name):
        # Check if the script exists
        script_path = os.path.join(SCRIPTS_DIR, script_name)
        if not os.path.exists(script_path):
            return "Script not found"
        
        # Determine the appropriate binary based on file extension
        _, extension = os.path.splitext(script_name)
        if extension == '.js':
            interpreter = "node"
        elif extension == '.py':
            interpreter = "python3"
        elif extension == '.sh':
            interpreter = "bash"
        elif extension == '.lua':
            interpreter = "lua"
        elif extension == '.pl':
            interpreter = "perl"
        elif extension == '.php':
            interpreter = "php"
        elif extension == '.rb':
            interpreter = "ruby"
        else:
            return f"Unsupported script type: {extension}"
        
        # Define the log file path
        log_file_path = os.path.join(LOG_DIR, f"{script_name}.log")
        
        # If the script is already running, return early
        if script_name in running_scripts_map and running_scripts_map[script_name].poll() is None:
            return f"Script '{script_name}' is already running."
        
        # Delete existing log file if it exists
        if os.path.exists(log_file_path):
            os.remove(log_file_path)
        master_fd, slave_fd = pty.openpty()

        # Run the script using the determined interpreter and redirect stdout and stderr to the log file
        process = subprocess.Popen(
            ["stdbuf", "-oL", interpreter, script_path],
            stdout=slave_fd,
            stderr=slave_fd,
            text=True,
            close_fds=True
        )
        running_scripts_map[script_name] = process    
        thread = threading.Thread(target=monitor_process_from_fd, args=(master_fd,slave_fd,process, log_file_path))

        # Start the threads
        thread.start()
        
        # Add the process to the process_map
        
        
        return f"Script '{script_name}' started with {interpreter}. Logs are being written to {log_file_path}"
    
    async def get_script_logs(self, script_name):
        """Fetch the log content of a running or completed script."""
        log_file_path = os.path.join(LOG_DIR, f"{script_name}.log")
        
        # Check if the log file exists
        if not os.path.exists(log_file_path):
            return f"No log file found for '{script_name}'."

        # Read and return the content of the log file
        with open(log_file_path, 'r') as log_file:
            log_content = log_file.read()
        
        return log_content
    
    async def stop_script(self, script_name):
        """Stop a running script by its name."""
        if script_name not in running_scripts_map:
            return f"Script '{script_name}' is not running."
        
        process = running_scripts_map[script_name]
        if process.poll() is None:  # If the process is still running
            process.terminate()
            process.wait()  # Ensure the process terminates
            del running_scripts_map[script_name]  # Remove from process map
            return f"Script '{script_name}' has been stopped."
        else:
            return f"Script '{script_name}' is not running."
            

    async def is_script_running(self, script_name):
        """Check if a script is currently running."""
        if script_name in running_scripts_map:
            process = running_scripts_map[script_name]
            return process.poll() is None  # If the process is still running
        return False
    
    async def toggle_script_running(self, script_name):
        """Toggle the running state of a script."""
        if await self.is_script_running(script_name):
            return await self.stop_script(script_name)
        else:
            return await self.run_script(script_name)

    async def get_running_scripts(self):
        """Returns a map of running scripts with their process handles."""
        running_processes = []
        for script_name, process in list(running_scripts_map.items()):
            if process.poll() is None:  # If the process is still running
                running_processes.append(script_name)
        return running_processes

    async def check_and_cleanup_finished_scripts(self):
        """Checks all running processes, removes them from the queue if finished."""
        for script_name, process in list(running_scripts_map.items()):
            if process.poll() is not None:  # If the process has finished
                exit_code = process.returncode
                del running_scripts_map[script_name]  # Remove from the process map
                # Log the exit status
                decky.logger.info(f"Script '{script_name}' finished with exit code {exit_code}.")