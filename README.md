# Discord bot

This program is a discord bot, made using a module for Node.js, discord.js, that allows you to interact with the Discord API.

## Getting Started

### Prerequisites

The list of software you need to install to launch the bot.
You can check if Node.js is installed by typing in the terminal or the cmd this command: "node -v".

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

5. Delete all the files except for the node_modules directory

```
// Linux
rm -v *.json

// macOS
rm *.json

// Windows
del *.json
```

6. Put this project's files in the folder

```
// If you have git installed
git clone https://github.com/Admi335/Discord-bot.git

// otherwise unzip it with an unzip program
```

## Running the tests

Explain how to run the automated tests for this system

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

### And coding style tests

Explain what these tests test and why

```
Give an example
```

## Deployment

Add additional notes about how to deploy this on a live system

## Built With

* [Dropwizard](http://www.dropwizard.io/1.0.2/docs/) - The web framework used
* [Maven](https://maven.apache.org/) - Dependency Management
* [ROME](https://rometools.github.io/rome/) - Used to generate RSS Feeds

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Billie Thompson** - *Initial work* - [PurpleBooth](https://github.com/PurpleBooth)

See also the list of [contributors](https://github.com/your/project/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Hat tip to anyone whose code was used
* Inspiration
* etc
