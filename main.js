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

const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();


const sendMsg = require('./src/sendMsg');
const deleteMsg = require('./src/deleteMsg');
const banPhrases = require('./src/banPhrases');



client.once('ready', async () => {
    console.log('Connected!');
});

client.once('reconnecting', () => {
    console.log('Reconnecting...');
});

client.once('disconnect', () => {
    console.log('Disconnected!');
});


const bannedPhrases = [
    // insert banned phrases here
];


client.on('message', message => {
    const channel = message.channel;
    const content = message.content.toLowerCase().trim();


    banPhrases(message, bannedPhrases);

    if (content == "prefix")
        sendMsg(`My prefix is ${prefix}`, channel);

    if (content == `${prefix}delete_this_message`)
        deleteMsg(message);
});



client.login(token);