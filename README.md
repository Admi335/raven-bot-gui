# Discord bot

This program is a discord bot, made using a module for Node.js, discord.js, that allows you to interact with the Discord API.

## Getting Started

### Prerequisites

The list of software you need to install to launch the bot.
You can check if Node.js is installed on your computer by typing in the terminal or the cmd this command: "node -v". If it outputs something like this: 

```
$ node -v
v14.3.0
```

Node.js is installed on your computer and you can skip this part.

#### Linux

1. node.js

```
// Ubuntu
sudo apt-get install nodejs

// Fedora
sudo dnf install nodejs

// Arch linux
sudo pacman -S nodejs
```

2. npm

```
// Ubuntu
sudo apt-get install npm

// Fedora
// npm is already part of the Node.js package

// Arch linux
sudo pacman -S npm
```

#### macOS

1. node.js & npm

```
curl "https://nodejs.org/dist/latest/node-${VERSION:-$(wget -qO- https://nodejs.org/dist/latest/ | sed -nE 's|.*>node-(.*)\.pkg</a>.*|\1|p')}.pkg" > "$HOME/Downloads/node-latest.pkg" && sudo installer -store -pkg "$HOME/Downloads/node-latest.pkg" -target "/"

// or

brew install node
```

Or you can install it from here:
https://nodejs.org/en/download/package-manager/

### Installing

A step by step installation guide for launching the bot using the terminal.
It's almost all the same for every operating system.
For Linux you can use the terminal of your distro, for macOS you can use the macOS' terminal and for Windows you can use the cmd.
Or you can use any other terminal like XTerm (for Linux) or Windows subsytem for Linux (for Windows - in VS Code).

1. Create a folder wherever you want

```
mkdir [folder's name]
```

2. Change the directory to the folder you just created

```
cd [folder's name]
```

3. Initialize your node project

```
npm init

// After entering the command, hit enter a few times and you will exit the program
```

4. Install the modules

```
npm install discord.js ffmpeg fluent-ffmpeg @discordjs/opus ytdl-core --save
```

5. Delete all the files except for the node_modules directory (You can enter "rm *.json" in either Linux or macOS terminal, howerer it's better to enter "rm -v *.json" in the Linux terminal and "rm -i *.json" in the macOS terminal.)

```
// Linux
rm -v *.json

// macOS
rm -i *.json

// Windows
del *.json
```

6. Clone or unzip this project's files in the folder

```
// If you have git installed
git clone https://github.com/Admi335/Discord-bot.git

// otherwise unzip it with an unzip program
```

## Deployment

To deploy the bot go to this website: https://discord.com/developers/applications, sign in or sign up, create a new application and set the application up. Then go to this website: https://discordapi.com/permissions.html, tick what you need, fill in the Client ID, which can be obtained form the applications page, add the bot to your Discord server and put the token of your bot in the config.json file (the token can be found on the application page as well).

###

After all of that, enter this into the terminal or cmd:

###

1. Change the directory to where you have the files from this repo

```
cd [path to the directory]
```

2. Create a config.json file and put your bot's token and prefix of your choice in it. The config.json file without prefix and token should look like this:

```
{
    "prefix": "",
    "token": ""
}
```

3. Start Node.js

```
node index.js
```

###

The bot should become online and working.

## Built With

* [Node.js](https://nodejs.org/en/) - JavaScript runtime environment
* [discord.js](https://discord.js.org/#/) - Node.js module used for interacting with the Discord API

## Authors

* **Adam Říha** - *Initial work* - [Admi335](https://github.com/Admi335)

## License

This project is licensed under the GPLv2 License - see the [LICENSE](LICENSE) file for details
