import re
import os
import json
from http.server import BaseHTTPRequestHandler, HTTPServer, SimpleHTTPRequestHandler
import socket
from socketserver import ThreadingMixIn

# Constants
PLUGIN_DIR = "/home/deck/homebrew/plugins/decky-script-runner"
SCRIPTS_DIR = "/home/deck/homebrew/data/decky-script-runner/scripts"
#SCRIPTS_DIR = "./uploads"  # Directory to store script files
METADATA_FILE = os.path.join(SCRIPTS_DIR, "metadata.json")
suported_script_langs = [".js", ".py", ".sh", ".lua", ".pl", ".php", ".rb"]
# Ensure upload directory exists
os.makedirs(SCRIPTS_DIR, exist_ok=True)

def clear_script_content(content):
    if(content is None):
        return None
    return content.replace('\r\n', '\n').replace('\r', '').strip()

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
        if [file_name.endswith(ext) for ext in suported_script_langs].count(True) == 0:
            continue
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

class ScriptHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        """Handle OPTIONS requests for CORS preflight."""
        self.send_response(200)
        self.end_headers()
        self.wfile.write("ok".encode())

    def do_GET(self):
        """Handle GET requests to list files and their metadata."""
        if(self.path == "/status"):
            self.send_response(200)
            self.send_header("Content-Type", "text/plain")
            self.end_headers()
            self.wfile.write("ok".encode())
        elif(self.path.startswith("/logs")):
            file_name = self.path.strip("/") + ".log"
            file_path = os.path.join(SCRIPTS_DIR, file_name)
            if(os.path.exists(file_path)):
                with open(file_path, 'r') as file:
                    file_content = file.read()
                    self.send_response(200)
                    self.send_header("Content-Type", "text/plain")
                    self.end_headers()
                    self.wfile.write(file_content.encode())
            # Handle requests to fetch script files
        elif self.path.startswith("/script/"):
            file_name = self.path[len("/script/"):]  # Extract file name after "/script/"
            file_path = os.path.join(SCRIPTS_DIR, file_name)
            if os.path.exists(file_path):
                with open(file_path, 'r') as file:
                    file_content = file.read()
                    self.send_response(200)
                    self.send_header("Content-Type", "text/plain")
                    self.end_headers()
                    self.wfile.write(file_content.encode())
            else:
                self.send_error(404, "File not found")
        elif self.path == "/scripts":
            metadata_content = compile_metadata()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps(metadata_content).encode())
        else:
            deviceIp = socket.gethostbyname(socket.gethostname())
            with open(PLUGIN_DIR + "/assets/sideloader/index.html", 'r') as sideloader_file:
                file_content = sideloader_file.read()
                file_content = file_content.replace("[STEAM_DECK_IP]", deviceIp)
                self.send_response(200)
                self.send_header("Content-Type", "text/html")
                self.end_headers()
                self.wfile.write(file_content.encode())

    def do_POST(self):
        """
        Handle POST request: save new script and recompile metadata.
        """
        file_length = int(self.headers['Content-Length'])
        file_data = self.rfile.read(file_length)
        try:
            data = json.loads(file_data)
            file_name = data.get("name")
            content = data.get("content", "")
            new_name = data.get("new_name", file_name)
            if not file_name:
                raise ValueError("File name is missing")
            if [file_name.endswith(ext) for ext in suported_script_langs].count(True) == 0:
                raise ValueError("Unsupported language")
            file_path = os.path.join(SCRIPTS_DIR, file_name)
            if self.path == "/rename":
              if [new_name.endswith(ext) for ext in suported_script_langs].count(True) == 0:
                raise ValueError("Unsupported language")
              new_file_path = os.path.join(SCRIPTS_DIR, new_name)
              if os.path.exists(file_path):
                 os.rename(file_path, new_file_path)
                 compile_metadata()
              self.send_response(200)
              self.send_header("Content-Type", "application/json")
              self.end_headers()
              self.wfile.write(json.dumps({"message": "File renamed", "file": new_name}).encode())
            # Check if the file already exists
            if os.path.exists(file_path):
                self.send_response(409)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"error": "File with this name already exists"}).encode())
                return
            with open(file_path, 'w') as f:
                f.write(clear_script_content(content))
            # Recompile metadata on any new script addition
            compile_metadata()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"message": "File created", "file": file_name}).encode())
        except (json.JSONDecodeError, ValueError) as e:
            self.send_response(400)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode())

    def do_PUT(self):
        """Handle PUT requests to update an existing file's content and metadata."""
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        try:
            data = json.loads(post_data)
            file_name = data.get("name")
            content = data.get("content", "")

            if not file_name:
                raise ValueError("File name is missing")

            file_path = os.path.join(SCRIPTS_DIR, file_name)
            # Check if the file exists
            if not os.path.exists(file_path):
                self.send_response(404)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"error": "File not found"}).encode())
                return

            # Update the file content
            with open(file_path, 'w') as file:
                file.write(clear_script_content(content))
            # Update metadata in the JSON file
            compile_metadata()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"message": "File updated", "file": file_name}).encode())

        except (json.JSONDecodeError, ValueError) as e:
            self.send_response(400)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode())

    def do_DELETE(self):
        """Handle DELETE requests to remove a file and its metadata."""
        file_name = self.path.strip("/")
        file_path = os.path.join(SCRIPTS_DIR, file_name)
        if os.path.exists(file_path):
            os.remove(file_path)
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"message": "File deleted", "file": file_name}).encode())
        else:
            self.send_response(404)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"error": "File not found"}).encode())


class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    """Handle requests in a separate thread."""


class CORSHandler(ScriptHandler):
    def send_response(self, *args, **kwargs):
        ScriptHandler.send_response(self, *args, **kwargs)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

# Setting up the HTTP server
def start_server():
    """Start the server using asyncio and threading."""
    server_address = ('', 9696)
    httpd = ThreadedHTTPServer(server_address, CORSHandler)
    print("Server running on https://localhost:9696")
    httpd.serve_forever()



start_server()
