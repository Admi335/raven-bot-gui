/* This program is a Discord bot made using discord.js, Discord API implementation for node.js.
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

client.once('ready', async () => {
    console.log('Ready!');
    client.user.setActivity("Kontrola soudruhů", {type: 'CUSTOM_STATUS'});
});
client.once('reconnecting', () => {
    console.log('Reconnecting!');
});
client.once('disconnect', () => {
    console.log('Disconnected!');
});

client.on('message', async message => {
    message.content = message.content.toLowerCase();

    const prefixes = ["prefix", "!prefix", "-prefix", "$prefix", "&prefix"];
    prefixes.forEach(function(prefixArr) {
      if (message.content.startsWith(prefixArr))
          message.channel.send(`Můj prefix je ${prefix}\nPoužití: ${prefix}command (argument)`);
    });
    
    if (message.member.hasPermission(['KICK_MEMBERS', 'BAN_MEMBERS']))
    {
        if (message.content.startsWith(`${prefix}kick`))
        {
            let member = message.mentions.members.first();
            member.kick().then((member) => {
                message.channel.send("Uživatel " + member.displayName + " byl vyhozen :wave:");
            });
        }
        
        if (message.content.startsWith(`${prefix}ban`))
        {
            let member = message.mentions.members.first();
            member.ban().then((member) => {
                message.channel.send("Uživatel " + member.displayName + " byl zabanován :wave:");
            });
        }
    }

    const greetings = ["ahoj", "zdravím", "čest", "Здравствуйте", "Здравствуй", "čau", "čus"];
    greetings.forEach(function(greeting) {
        if (message.content.startsWith(greeting))
        {
            if (message.author.id === '395250596975738880')
                message.reply(":wave: Buď zdráv, můj vůdče!");

            else
                message.reply(":wave: Здравствуйте, товарищи!");
        }
    });

    const rozlouceni = ["sbohem", "tak zatím"];
    rozlouceni.forEach(function(i) {
        if (message.content.startsWith(i))
        {
            if (message.author.id === '395250596975738880')
                message.reply(":wave: Sbohem, můj vůdče!");

            else
                message.reply(":wave: До свидания, товарищиS!");
        }
    });
});

client.login(token);
