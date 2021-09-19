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
const deletePhrases = true;  // Delete message if it includes a blacklisted phrase
const banForPhrases = false; // Ban user if his message includes a blacklisted phrase
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

const maxLength = -1; // Maximum amount of characters in a message
                      // In case you don't want to have a limit, set this to -1



client.once('ready', () => {
    console.log('\nConnected!');
});

client.once('reconnecting', () => {
    console.log('\nReconnecting...');
});

client.once('disconnect', () => {
    console.log('\nDisconnected!');
});


client.on('message', async message => {
    const channel = message.channel;
    const content = message.content.trim();
    const author = message.member;

    const voiceChannel = message.member.voice.channel;
    //const VCpermissions = voiceChannel.permissionsFor(message.client.user);

    const serverQueue = musicFuncs.getQueue().get(message.guild.id);

    // Message length
    if (content.length >= maxLength && maxLength != -1) {
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
                    if (deletePhrases)
                        deleteMsg(message, `You wrote some bad words! ${author}`, channel);
                
                    if (banForPhrases)
                        banUser(author, `You wrote some bad words! ${author}`, author);

                    return;
            }
        }
    });

    // Check if author is bot
    if (message.author.bot) return;
    
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

        if (command.startsWith("ban"))
            return banUser(targetUser, targetString, targetChannel);

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
        
            musicFuncs.queueSong(message, targetString, serverQueue);

            return;
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
    }
});

client.login(token);
