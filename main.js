/* This program is a Discord bot made using discord.js, a Discord API implementation for node.js
 * Copyright (C) 2021 Adam Říha
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 * 
 * You can contact me, the creator of this program, via this email address: rihaadam1@seznam.cz
 */

const fs = require('fs');
const readline = require('readline'); 

const banUser = require('./src/banUser.js');
const deleteMsg = require('./src/deleteMsg.js');
const findSubstring = require('./src/findSubstring.js');
const sendMsg = require('./src/sendMsg.js');

const musicFuncs = require('./src/music.js');


/*----------------------------------------------------*/
/*-------------------- WEB SERVER --------------------*/
/*----------------------------------------------------*/

const http = require('http');
const express = require('express');
const app = new express();

const hostname = '127.0.0.1';
const port = process.env.PORT || 3000;
const server = http.createServer(app);

app.use(express.static('./'));

app.get('/', (req, res) => {
    res.sendFile('index.html');
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});


/*-----------------------------------------------------*/
/*-------------------- DISCORD BOT --------------------*/
/*-----------------------------------------------------*/

// Discord
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();


// Bot settings
const settings = new Map();

fs.readFile('./settings.json', 'utf-8', (err, data) => {
    if (err) 
        return console.error("There was an error loading settings file\n" + err);

    data = JSON.parse(data);

    for (let i = 0; i < Object.keys(data).length; i++)
        settings.set(Object.keys(data)[i], data[Object.keys(data)[i]]);

    console.log(settings);
});


const blacklistedPhrases = [];

fs.access('./phrases_blacklist.txt', fs.F_OK, err => {
    if (err) {
        return console.log("Blacklist of phrases doesn't exist");
    }

    let rl = readline.createInterface({
        input: fs.createReadStream('./phrases_blacklist.txt'),
        crlfDelay: Infinity
    });

    console.log("Blacklisted phrases:");

    rl.input.on('error', err => {
        console.log("Failed to read file!\n" + err);
    });

    rl.on('line', line => {
        line.trim();

        if (!line.startsWith("!--")) {
            console.log(line);
            blacklistedPhrases.push(line.toLowerCase());
        }
    });
});


const commands = [
    { name: 'help',     admin: false, description: `Shows this list\nUsage: \`${prefix}help\`` },
    { name: 'set',      admin: true,  description: `Sets a setting\nUsage: \`${prefix}set exampleSetting "true"\`` },
    { name: 'settings', admin: true,  description: `Shows the list of available settings\nUsage: \`${prefix}settings\`` },
    { name: 'send',     admin: true,  description: `Sends a message to a channel (if not specified, it sends the message to the current channel)\nUsage: \`${prefix}send "example"\` or \`${prefix}send "example" #example-channel\`` },
    { name: 'ban',      admin: true,  description: `Bans a user (optional: reason, channel whither the reason will be posted)\nUsage: \`${prefix}ban @example-user "Bad behavior" #bans\`` },
    { name: 'play',     admin: false, description: `Plays a song from YouTube\nUsage: \`${prefix}play "https://youtu.be/AbC(123-4F"\`` },
    { name: 'skip',     admin: false, description: `Skips the current song\nUsage: \`${prefix}skip\`` },
    { name: 'stop',     admin: false, description: `Stops the bot from playing music\nUsage: \`${prefix}stop\`` },
    { name: 'current',  admin: false, description: `Shows some info about the current song\nUsage: \`${prefix}current\`` },
    { name: 'queue',    admin: false, description: `Show the list of queued songs\nUsage: \`${prefix}queue\`` }
]



client.once('ready', () => {
    console.log('\nConnected!');
});

client.once('reconnecting', () => {
    console.log('\nReconnecting...');
});

client.once('disconnect', () => {
    console.log('\nDisconnected!');
});


client.on('message', message => {
    if (message.author.bot) return; // Check if author is bot

    if (!settings.has(message.guild.id)) {
        settings.set(message.guild.id, {
            maxMessageLength: -1,
            deleteBannedPhrases: true,
            banForBannedPhrases: false
        });
    }

    const channel = message.channel;
    const content = message.content.trim();
    const author = message.member;

    const voiceChannel = message.member.voice.channel;
    //const VCpermissions = voiceChannel.permissionsFor(message.client.user);

    const serverSettings = settings.get(message.guild.id);
    const serverQueue = musicFuncs.getQueue().get(message.guild.id);

    // Message length
    if (content.length >= serverSettings.maxMessageLength && serverSettings.maxMessageLength != -1) {
        return deleteMsg(message, `Your message is too long! ${author}`, channel);
    }

    // Blacklist
    blacklistedPhrases.forEach(phrase => {
        if (content.toLowerCase().includes(phrase)) {
            if ((content[content.indexOf(phrase) - 1] == ' ' ||
                !content[content.indexOf(phrase) - 1])
                &&
                (content[content.indexOf(phrase) + phrase.length] == ' ' ||
                !content[content.indexOf(phrase) + phrase.length])) {
                    if (serverSettings.deleteBannedPhrases)
                        deleteMsg(message, `You wrote some bad words! ${author}`, channel);
                
                    if (serverSettings.banForBannedPhrases)
                        banUser(author, `You wrote some bad words! ${author}`, author);

                    return;
            }
        }
    });
    
    // Send prefix
    if (content.toLowerCase() == "prefix")
        return sendMsg(`My prefix is ${prefix}`, channel);

/* COMMANDS */
    else if (content.startsWith(prefix)) {
        let command = content.slice(prefix.length);
        let targetUser = message.mentions.members.first();
        let targetString = findSubstring(command);
        let targetChannel = message.mentions.channels.first();

        for (let i = 0; i < command.length; i++) {
            if (command[i] == " " || !command[i]) break;
            command[i].toLowerCase();
        }

        if (command.startsWith("help")) {
            let commandsFields = [];

            for (let i = 0; i < commands.length; i++) {
                if (!commands[i].admin)
                    commandsFields.push({ name: commands[i].name, value: commands[i].description });
            }

            const helpEmbed = new Discord.MessageEmbed()
                .setColor('#FF0000')
                .setTitle('Help')
                .setDescription('List of all useful commands and their usage')
                .addFields(
                    { name: 'prefix', value: `Shows my command prefix\nUsage: \`prefix\`` },
                    commandsFields
                );
            
            return sendMsg(helpEmbed, channel);
        }

        else if (command.startsWith("adminHelp")) {
            let commandsFields = [];

            for (let i = 0; i < commands.length; i++) {
                if (commands[i].admin)
                    commandsFields.push({ name: commands[i].name, value: commands[i].description });
            }

            const helpEmbed = new Discord.MessageEmbed()
                .setColor('#FF0000')
                .setTitle('Help - Admin')
                .setDescription('List of all useful **admin** commands and their usage')
                .addFields(commandsFields);
            
            return sendMsg(helpEmbed, channel);
        }

        else if (command.startsWith("settings") || command.startsWith("options")) {
            const settingsEmbed = new Discord.MessageEmbed()
                .setColor('#FF6666')
                .setTitle('Settings')
                .setDescription('List of all settings available')
                .addFields(
                    { name: 'maxMessageLength',    value: `Maximum amount of characters a message can have (if you don\'t want a limit, set this to -1)\nCurrent: ${serverSettings.maxMessageLength}\nDefault: -1\nArguments: number <-1;∞>` },
                    { name: 'deleteBannedPhrases', value: `Whether to delete a message if it includes a blacklisted phrase\nCurrent: ${serverSettings.deleteBannedPhrases}\nDefault: true\nArguments: "true" or "false"` },
                    { name: 'banForBannedPhrases', value: `Whether to ban a user if his message includes a blacklisted phrase\nCurrent: ${serverSettings.banForBannedPhrases}\nDefault: false\nArguments: "true" or "false"` }
                );

            return sendMsg(settingsEmbed, channel);
        }

        else if (command.startsWith("ban")) {
            if (!targetUser)         return sendMsg("You need to specify whom to ban!", channel);
            else if (!targetString)  return banUser(targetUser);
            else if (!targetChannel) return banUser(targetUser, targetString, channel);
            else                     return banUser(targetUser, targetString, targetChannel);
        }

        else if (command.startsWith("send")) {
            if (!targetString || targetString.length == 0)
                return sendMsg(`[ERROR] You must write your message inside of two " or ', and your message cannot be empty. ${author}`, channel);

            if (targetChannel) return sendMsg(targetString, targetChannel);
            else               return sendMsg(targetString, channel);
        }

    /* PLAYING MUSIC */
        else if (command.startsWith("play")) {
            if (!voiceChannel)
                return sendMsg("You need to be in a voice channel to play music!", channel);
        
            return musicFuncs.queueSong(message, targetString, serverQueue);
        }

        else if (command.startsWith("skip")) {
            if (!voiceChannel)
                return sendMsg("You have to be in a voice channel to skip the music!", channel);

            if (!serverQueue)
                return sendMsg("There is no song that I could skip!", channel);

            musicFuncs.skip(serverQueue);
            sendMsg(`Current song has been skipped!`, channel)

            return;
        }

        else if (command.startsWith("stop")) {
            if (!voiceChannel)
                return sendMsg("You have to be in a voice channel to stop the music!", channel);

            if (!serverQueue)
                return sendMsg("There is no song that I could stop!", channel);

            musicFuncs.stop(serverQueue);
            sendMsg(`Stopped playing songs!`, channel)

            return;
        }

        else if (command.startsWith("current")) {
            songLen = serverQueue.songs[0].lengthSeconds;

            let seconds = songLen % 60;
            let minutes = parseInt(songLen / 60) % 60;
            let hours = parseInt(songLen / 3600);

            let time = "";
            if (hours != 0)   time += (hours.toString().length == 1 ? `0${hours}` : hours) + ":";
            if (minutes != 0) time += (minutes.toString().length == 1 && hours != 0 ? `0${minutes}` : minutes) + ":";
                              time += (seconds.toString().length == 1 && minutes != 0 ? `0${seconds}` : seconds);

            const currentEmbed = new Discord.MessageEmbed()
                .setColor('#30FF00')
                .setTitle('Current song info')
                .addFields(
                    { name: "Title", value: `[${serverQueue.songs[0].title}](${serverQueue.songs[0].url})` },
                    { name: "Author", value: serverQueue.songs[0].author, inline: true },
                    { name: "Length", value: time, inline: true },
                )
                .setImage(serverQueue.songs[0].thumbnails[serverQueue.songs[0].thumbnails.length - 1].url);

            return sendMsg(currentEmbed, channel);
        }

        else if (command.startsWith("queue")) {
            if (!serverQueue) 
                return sendMsg("There are no songs in the queue!", channel);
            
            let fieldValues = [];

            for (let i = 0; i < serverQueue.songs.length; i++) {
                songLen = serverQueue.songs[i].lengthSeconds;

                let seconds = songLen % 60;
                let minutes = parseInt(songLen / 60) % 60;
                let hours = parseInt(songLen / 3600);

                let songName = serverQueue.songs[i].title;
                let songURL = serverQueue.songs[i].url;

                if (songName.length > 50) fieldValues[i] = `[${songName.substr(0, 46)}](${songURL})...`;
                else                      fieldValues[i] = `[${songName}](${songURL})`;

                fieldValues[i] += ` by **${serverQueue.songs[i].author}** - `;

                if (hours != 0)   fieldValues[i] += (hours.toString().length == 1 ? `0${hours}` : hours) + ":";
                if (minutes != 0) fieldValues[i] += (minutes.toString().length == 1 && hours != 0 ? `0${minutes}` : minutes) + ":";  
                                  fieldValues[i] += (seconds.toString().length == 1 && minutes != 0 ? `0${seconds}` : seconds);
            }
            
            fields = [];
            fields.push({ name: "Now playing:", value: fieldValues[0] });
            
            for (let i = 1; i < serverQueue.songs.length; i++)
                fields.push({ name: `${i})`, value: fieldValues[i] });

            const queueEmbed = new Discord.MessageEmbed()
                .setColor('#202020')
                .addFields(fields);

            return sendMsg(queueEmbed, channel);
        }

    /* SETTINGS */
        else if (command.startsWith("set")) {
            const setting = command.split(" ")[1];
            let origValue;

            if (!setting)
                return sendMsg("You have to specify which setting you want to change!", channel);

            if (setting == "maxMessageLength") {
                if ((isNaN(targetString) && isNaN(parseFloat(targetString))) || parseInt(targetString) < -1)
                    return sendMsg("This can only be set to a number higher or equal to -1!", channel);

                origValue = serverSettings.maxMessageLength;
                serverSettings.maxMessageLength = parseInt(targetString);
            }  
            else if (setting == "deleteBannedPhrases") {
                if (targetString != "true" || targetString != "false")
                    return sendMsg("This can only be set to true and false!", channel);

                origValue = serverSettings.deleteBannedPhrases;
                serverSettings.deleteBannedPhrases = targetString;
            }
            else if (setting == "banForBannedPhrases") {
                if (targetString != "true" || targetString != "false")
                    return sendMsg("This can only be set to true and false!", channel);
                    
                origValue = serverSettings.banForBannedPhrases;
                serverSettings.banForBannedPhrases = targetString;
            }
            else {
                return sendMsg(`${setting} does not exist!`, channel);
            }

            console.log(settings.get(message.guild.id));

            sendMsg(`${setting} has been changed from "${origValue}" to "${targetString}"`, channel)
                
            return settings.set(message.guild.id, serverSettings);
        }
    }
});

client.login(token);


// Save settings on exit
["exit", "SIGINT", "SIGUSR1", "SIGUSR2", "uncaughtException"].forEach(eventType => {
    process.on(eventType, () => {
        const settingsJSON = JSON.stringify(Object.fromEntries(settings));

        fs.writeFileSync('./settings.json', settingsJSON, err => {
            if (err)
                return console.error("There was an error saving settings file!");
        });

        process.exit();
    });
});