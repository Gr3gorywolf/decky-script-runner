import os
import json
from http.server import BaseHTTPRequestHandler, HTTPServer
from socketserver import ThreadingMixIn
SCRIPTS_DIR = "/home/deck/homebrew/data/decky-script-runner/scripts"
#SCRIPTS_DIR = "./uploads"  # Directory to store files

# Ensure the upload directory exists
os.makedirs(SCRIPTS_DIR, exist_ok=True)
httpd = None


def get_script_infos(): 
    files = os.listdir(SCRIPTS_DIR)
    file_infos = []
    
    for file_name in files:
        file_path = os.path.join(SCRIPTS_DIR, file_name)
        
        # Skip metadata JSON files
        if file_name.endswith('.json') or not os.path.isfile(file_path):
            continue
        
        # Get the base name and extension without the dot
        
        # Set up initial file data
        file_data = {"name": file_name}
        extension = os.path.splitext(file_name)
        # Set language as the extension without the dot
        language = extension[1:] if extension else 'Unknown'
        file_data['language'] = language
        
        # Check for associated metadata
        metadata_path = f"{file_path}.json"
        if os.path.exists(metadata_path):
            with open(metadata_path, 'r') as metadata_file:
                metadata = json.load(metadata_file)
                file_data.update(metadata)  # Add metadata to the file info
        
        file_infos.append(file_data)
    
    return file_infos   

class SimpleHTTPRequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        """Handle GET requests to list files and their metadata."""
        if(self.path.startswith("/logs")):
            file_name = self.path.strip("/") + ".log"
            file_path = os.path.join(SCRIPTS_DIR, file_name)
            if(os.path.exists(file_path)):
                with open(file_path, 'r') as file:
                    file_content = file.read()
                    self.send_response(200)
                    self.send_header("Content-Type", "text/plain")
                    self.end_headers()
                    self.wfile.write(file_content.encode())
        else:
            file_info = get_script_infos()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps(file_info).encode())

    def do_POST(self):
        """Handle POST requests to create a new file with metadata."""
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        try:
            data = json.loads(post_data)
            file_name = data.get("name")
            content = data.get("content", "")
            description = data.get("description", "")
            language = data.get("language", "")
            author = data.get("author", "")  # Optional field

            if not file_name:
                raise ValueError("File name is missing")

            file_path = os.path.join(SCRIPTS_DIR, file_name)
            metadata_path = f"{file_path}.json"
            
            # Check if the file already exists
            if os.path.exists(file_path):
                self.send_response(409)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"error": "File with this name already exists"}).encode())
                return

            # Write the file content
            with open(file_path, 'w') as file:
                file.write(content)
            
            # Save metadata in a JSON file
            metadata = {
                "description": description,
                "language": language,
                "author": author  # Add author to metadata
            }
            with open(metadata_path, 'w') as metadata_file:
                json.dump(metadata, metadata_file)
            
            self.send_response(201)
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
            description = data.get("description", "")
            language = data.get("language", "")
            author = data.get("author", "")  # Optional field

            if not file_name:
                raise ValueError("File name is missing")

            file_path = os.path.join(SCRIPTS_DIR, file_name)
            metadata_path = f"{file_path}.json"
            
            # Check if the file exists
            if not os.path.exists(file_path):
                self.send_response(404)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"error": "File not found"}).encode())
                return

            # Update the file content
            with open(file_path, 'w') as file:
                file.write(content)
            
            # Update metadata in the JSON file
            metadata = {
                "description": description,
                "language": language,
                "author": author  # Add/Update author in metadata
            }
            with open(metadata_path, 'w') as metadata_file:
                json.dump(metadata, metadata_file)
            
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
        metadata_path = f"{file_path}.json"
        
        if os.path.exists(file_path):
            os.remove(file_path)
            if os.path.exists(metadata_path):
                os.remove(metadata_path)
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
def start_server():
    """Start the server using asyncio and threading."""
    server_address = ('', 9696)
    httpd = ThreadedHTTPServer(server_address, SimpleHTTPRequestHandler)
    httpd.serve_forever()



start_server()