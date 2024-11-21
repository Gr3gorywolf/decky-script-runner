# Decky Script Runner Plugin  
![image](https://github.com/user-attachments/assets/299b625e-ffd8-40cc-b0e2-de650ac8c462)

## Table of Contents  
1. [Overview](#overview)  
2. [Features](#features)  
   - [Script Launcher](#script-launcher)  
   - [SideLoader](#sideloader)  
   - [Editing Scripts](#editing-scripts)  
   - [Root Scripts](#root-scripts)  
   - [Supported Languages](#supported-languages)  
   - [Community Scripts](#community-scripts)  
   - [Log Viewer](#log-viewer)  
3. [Development](#development)  
   - [Dependencies](#dependencies)  
   - [Setting Up](#setting-up)  
   - [Building and Testing](#building-and-testing)  
   - [Distribution](#distribution)  
4. [License](#license)  

---

## Overview  
The **Decky Script Runner** is a plugin designed for the Steam Deck, offering a powerful environment to run, manage, and edit scripts. With a focus on flexibility, it supports running multiple scripts simultaneously, editing and uploading script through the integrated sideloader, and sharing scripts within a community-driven repository. Whether you're automating tasks or developing new scripts, this plugin is a must-have for any Steam Deck user.  

---

## Features  

### Script Launcher  
The plugin’s script launcher allows you to run multiple scripts simultaneously, enabling complex automation tasks such as hosting multiple web servers or handling various background processes. By default, scripts open a console for feedback but continue running in the background. You can disable the console view if you prefer a more streamlined experience.

### SideLoader  
The **SideLoader** tool offers a built-in Monaco editor for creating, editing, and managing scripts directly on your Steam Deck. With a simple button press in the plugin’s menu, you can access the SideLoader, which also displays the IP address where it's running, enabling remote access for easy script management.

### Editing Scripts  
You can edit and manage your scripts using the SideLoader or directly by placing them in the `/home/deck/decky-scripts` folder. Scripts in this directory are automatically recognized by the plugin. For a clean and informative presentation, it’s recommended to add a metadata template to the top of each script.

### Root Scripts  
Some scripts may require root access to perform system-level tasks. These scripts are flagged with a `root: true` property in their metadata. Root scripts from the community are tested to ensure they don’t damage your device, but always exercise caution when using third-party root scripts.

### Supported Languages  
The Decky Script Runner currently supports the following languages:  
- <img height="15px" width="15px" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" />  **JavaScript (Node.js)**  
- <img height="15px" width="15px" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" /> **Python**  
- <img height="15px" width="15px" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/lua/lua-original.svg" /> **Lua**  
- <img height="15px" width="15px" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/perl/perl-original.svg" /> **Perl**  
- <img height="15px" width="15px" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg" /> **PHP**  
- <img height="15px" width="15px" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bash/bash-original.svg" /> **Bash**  
- <img height="15px" width="15px" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/ruby/ruby-original.svg" /> **Ruby**  

If you’d like to request support for additional languages, open an issue and it may be considered in a future update.

### Community Scripts  
Users can share their scripts with the community by contributing to the [community repository](https://github.com/Gr3gorywolf/decky-script-runner-scripts). Once approved, these scripts are immediately available to others, helping to build a collaborative environment for all users.
> ⚠️ **Warning**  
> 1. Some scripts require root and unlock the Steam Deck filesystem. In those cases, we are not responsible for Steam Deck damages. (Verify the code before running them)  
> 2. Neither the Plugin or Developer are responsible for anything done by the script runner since the plugin was made just for running scripts. Any script that you run will be at your own risk.


### Log Viewer  
The **Log Viewer** provides real-time feedback on script outputs, making it easier to debug and monitor script execution. This tool is also accessible through the SideLoader for seamless integration.

---

## Development  

### Dependencies  
To develop and test plugins, you need to have **Node.js v16.14+** and **pnpm v9** installed. This is required to avoid CI issues during plugin submission. You can install pnpm via npm with the following command:  

```bash
sudo npm i -g pnpm@9
```

For custom backends, Docker is also required for compatibility with the Decky CLI tool.  

### Setting Up  
To get started with plugin development, either fork this repository or use the "Use this template" button on GitHub. After that, run the following commands in your local repository:  
1. `pnpm i`  
2. `pnpm run build`  

These commands will install dependencies and build the frontend code for testing.  

### Building and Testing  
You can reference the [decky-frontend-lib](https://github.com/SteamDeckHomebrew/decky-frontend-lib) for additional resources on how to develop your plugin. If using VSCode or VSCodium, simply run the `setup` and `build` tasks to compile and deploy your plugin.  

If you’re not using VSCode, manually execute the build process as needed.

### Distribution  
To distribute your plugin, you can either publish it on the [decky-plugin-database](https://github.com/SteamDeckHomebrew/decky-plugin-database) or package it in a ZIP file. The ZIP should include the necessary files, including `index.js`, `package.json`, and `plugin.json`.  

For distribution through the plugin store, you must include a license file in your repository. For more information on distribution and CI setup, refer to the [decky-plugin-database](https://github.com/SteamDeckHomebrew/decky-plugin-database).


