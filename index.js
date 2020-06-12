/* This program is a Discord bot made using discord.js
 * Copyright (C) 2020 Adam Říha
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
const Command = require('./command.js');

client.once('ready', () => {
    console.log('Ready!');
});
/*
let y = process.openStdin()
y.addListener("data", res => {
    let x = res.toString().trim().split(/ +/g);
    client.channels.send(x.join(" "));
});
*/

//const commands = [{"kick", "kick an user from the server", `${prefix}kick @user`}];

client.on('message', message => {
    message.content = message.content.toLowerCase();
    if (message.member.hasPermission('ADMINISTRATOR'))
    {
        if (message.content.startsWith("prefix"))
        {
            message.channel.send("My prefix here is $");
        }
    }

    if (message.content.startsWith(`${prefix}commands`))
    {

    }

    if (message.member.hasPermission(['KICK_MEMBERS', 'BAN_MEMBERS']))
    {
        if (message.content.startsWith(`${prefix}kick`))
        {
            let member = message.mentions.members.first();
            member.kick().then((member) => {
                message.channel.send("S Tuxem, " + member.displayName + " :wave:");
            });
        }
        
    }

    const greetings = ["ahoj", "zdravím", "čest", "Здравствуйте", "Здравствуй", "čau", "čus"];
    greetings.forEach(function(greeting) {
        if (message.content.startsWith(greeting))
        {
            /*if (message.member.user.)
                message.channel.send("Drž hubu");*/
            if (message.author.id === '395250596975738880')
                message.channel.send(":wave: Buď zdráv, můj vůdče!");

            else
                message.channel.send(":wave: Здравствуйте, товарищи!");
        }
    });

    const rozlouceni = ["Sbohem", "Tak zatím"];
    rozlouceni.forEach(function(i) {
        if (message.content.startsWith(i))
        {
            if (message.author.id === '395250596975738880')
                message.channel.send(":wave: Sbohem, můj vůdče!");

            else
                message.channel.send(":wave: До свидания, товарищиS!");
        }
    });
});

client.login(token);