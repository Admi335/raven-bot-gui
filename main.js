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

// Node
const fs = require('fs');
const readline = require('readline');


// Discord
const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();


// Scripts
const sendMsg = require('./src/sendMsg');
const deleteMsg = require('./src/deleteMsg');


// BOT SETTINGS
const deletePhrases = true;  // Delete message if it includes a blacklisted phrase
const banForPhrases = false; // Ban user if his message includes a blacklisted phrase
const blacklistedPhrases = [];

let rl = readline.createInterface({
    input: fs.createReadStream('./phrases_blacklist.txt'),
    crlfDelay: Infinity
});

console.log("Blacklisted phrases:");

rl.on('line', line => {
    line.trim();

    if (!line.startsWith("!--")) {
        console.log(line);
        blacklistedPhrases.push(line);
    }
});

const maxLength = 256; // Maximum amount of characters in a message
                       // In case you don't want to have a limit, set this to -1


client.once('ready', () => {
    /*client.api.applications(client.user.id).commands.post({
        data: {
            name: '',
            description: ''
        }
    });*/

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
    const author = message.author;

    if (content.length >= maxLength && maxLength != -1) {
        deleteMsg(message, `Your message is too long! ${author}`, channel);
    }

    blacklistedPhrases.forEach(phrase => {
        if (content.toLowerCase().includes(phrase)) {
            if ((content[content.indexOf(phrase) - 1] == ' ' ||
                !content[content.indexOf(phrase) - 1])
                &&
                (content[content.indexOf(phrase) + phrase.length] == ' ' ||
                !content[content.indexOf(phrase) + phrase.length])) {
                    if (deletePhrases)
                        deleteMsg(message);
                
                    //if (banForPhrases)
                        //ban(author); // Ban function not implemented, yet
            }
        }
    });

    if (content.toLowerCase() == "prefix")
        sendMsg(`My prefix is ${prefix}`, channel);

    if (content.startsWith(prefix)) {
        let command = content.slice(prefix.length);

        for (let i = 0; i < command.length; i++) {
            if (command[i] == " " || !command[i]) break;
            command[i].toLowerCase();
        }

        if (command.startsWith("send")) {
            function findQuotes(quote = "\"") {
                let msgI = command.indexOf(quote);
                let msgEnd;

                if (msgI != -1) {
                    for (let i = msgI; i < command.length; i++)
                    {
                        if (command[i] == quote && command[i - 1] != "\\")
                            msgEnd = i;
                    }

                    return [msgI + 1, msgEnd];
                }

                if (msgI == -1 || msgEnd == -1) {
                    if (quote == "\"") {
                        return findQuotes("'");
                    }

                    else {
                        sendMsg("Syntax error! You have to write your message inside of \"\" or ''", channel);
                        return undefined;
                    }
                }
            }

            let msgIs = findQuotes();
            if (!msgIs) return;

            let msg = command.substring(msgIs[0], msgIs[1]);
            let msgLocation = message.mentions.channels.first();
            sendMsg(msg, msgLocation);
        }
    }
});

client.login(token);