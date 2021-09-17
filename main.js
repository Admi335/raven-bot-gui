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
        console.log("Blacklist of phrases doesn't exist");
        return;
    }

    let rl = readline.createInterface({
        input: fs.createReadStream('./phrases_blacklist.txt'),
        crlfDelay: Infinity
    });

    console.log("Blacklisted phrases:");

    rl.input.on('error', err => {});

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
    console.log('Reconnecting...');
});

client.once('disconnect', () => {
    console.log('Disconnected!');
});


client.on('message', message => {
    const channel = message.channel;
    const content = message.content.trim();
    const author = message.member;

    const voiceChannel = message.member.voice.channel;
    //const VCpermissions = voiceChannel.permissionsFor(message.client.user);

    const serverQueue = musicFuncs.getQueue().get(message.guild.id);


    if (content.length >= maxLength && maxLength != -1) {
        deleteMsg(message, `Your message is too long! ${author}`, channel);
        return;
    }

    blacklistedPhrases.forEach(phrase => {
        if (content.toLowerCase().includes(phrase)) {
            if ((content[content.indexOf(phrase) - 1] == ' ' ||
                !content[content.indexOf(phrase) - 1])
                &&
                (content[content.indexOf(phrase) + phrase.length] == ' ' ||
                !content[content.indexOf(phrase) + phrase.length])) {
                    if (deletePhrases)
                        deleteMsg(message, `You wrote some bad words! ${author}`, channel);
                
                    else if (banForPhrases)
                        banUser(author, `You wrote some bad words! ${author}`, author);

                    return;
            }
        }
    });

    if (message.author.bot) return;
    
    if (content.toLowerCase() == "prefix") {
        sendMsg(`My prefix is ${prefix}`, channel);
        return;
    }

    else if (content.startsWith(prefix)) {
        let command = content.slice(prefix.length);
        let targetUser = message.mentions.members.first();
        let targetString = findSubstring(command);
        let targetChannel = message.mentions.channels.first();

        for (let i = 0; i < command.length; i++) {
            if (command[i] == " " || !command[i]) break;
            command[i].toLowerCase();
        }

        if (command.startsWith("ban")) {
            banUser(targetUser, targetString, targetChannel);
            return;
        }

        else if (command.startsWith("send")) {
            if (!targetString || targetString.length == 0) {
                sendMsg(`[ERROR] You must write your message inside of two " or ', and your message cannot be empty. ${author}`, channel);
                return;
            }

            if (targetChannel) sendMsg(targetString, targetChannel);
            else               sendMsg(targetString, channel);

            return;
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

            serverQueue.connection.dispatcher.end();

            sendMsg(`Current song has been skipped!`, channel)

            return;
        }

        else if (command.startsWith("stop")) {
            if (!voiceChannel)
                return sendMsg("You have to be in a voice channel to stop the music!", channel);

            if (!serverQueue)
                return sendMsg("There is no song that I could stop!", channel);

            serverQueue.songs = [];
            serverQueue.connection.dispatcher.end();

            sendMsg(`Stopped playing songs!`, channel)

            return;
        }
    }
});

client.login(token);
