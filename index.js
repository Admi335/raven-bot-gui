/* This program is a Discord bot made using discord.js, Discord API implementation for node.js
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
    client.user.setActivity("Kontrola soudruhů", {type: 'WATCHING'});
});
client.once('reconnecting', () => {
    console.log('Reconnecting!');
});
client.once('disconnect', () => {
    console.log('Disconnected!');
});

function poslatDoGulagu(member, reason) {
    member.roles.remove(['721000809441001532', '721058398228971581', '721058217416720495', '720723970202140702', '720724097537015840', '721396297264922625', '720727778672246825', '720732920343429133', '721056101642272830', '720729222162808832']);
    member.roles.add('721266865279860824');
    member.setNickname(reason);
}

client.on('message', async message => {
    message.content = message.content.toLowerCase();

    if (message.channel.id !== '721699440372744192' || message.channel.id !== '721622388277510165' || !message.member.roles.cache.has('721266865279860824') || !message.member.roles.cache.has('721056101642272830'))
    {
        const swears = ["fuck", "nigga", "nigger", "negr", "píča", "kunda", "kokot", "čůrák"];
        swears.forEach(function(swear) {
            if (message.content.includes(swear) && message.author.id !== '395250596975738880')
            {
                message.delete();
                message.channel.send("Zpráva uživatele <@" + message.author.id + "> byla cenzurována.\nDůvod: zakázaná slova");
                message.channel.send("<:FeelsOkayMan:720679806445944862>");
                message.author.send("Byl jsi varován!\nUž nepiš zakázaná slova nebo dostaneš permanentní ban!");
            }
        });

        const prefixes = ["", "!", "/", "-", "$", "&"];
        prefixes.forEach(function(prefixArr) {
            if (message.content.startsWith(`${prefixArr}prefix`))
                message.channel.send(`Můj prefix je ${prefix}\nPoužití: ${prefix}command (argument)`);
        });
        
        if (message.member.hasPermission(['KICK_MEMBERS', 'BAN_MEMBERS']))
        {
            if (message.content.startsWith(`${prefix}zatknout`))
            {
                let member = message.mentions.members.first();

                if (!member.guild.roles.cache.has('721719328013156463'))
                {
                    if (Math.floor(Math.random() * 10) < 8)
                    {
                        message.channel.send(`Podařilo se mi najít občana <@${member.id}>.`);
                        message.channel.send(`Občan <@${member.id}> byl poslán do gulagu a již nadále není naším soudruhem.`);
                        message.channel.send("<:FeelsOkayMan:720679806445944862>");
                        poslatDoGulagu(member, "Útěk");
                    }
                    else
                    {
                        message.channel.send(`Občana <@${member.id}> se mi nepodařilo najít.`);
                        message.channel.send("<:Sadge:720679806542282762>");
                    }
                }
                else
                    message.channel.send(`Občan <@${member.id}> je v zahraničí!`);
            }

            if (message.content.startsWith(`${prefix}vzahraničízatknout`))
            {
                let member = message.mentions.members.first();
                    
                if (member.guild.roles.cache.has('721719328013156463'))
                {
                    if (Math.floor(Math.random() * 10) < 5)
                    {
                        message.channel.send(`Podařilo se mi najít občana <@${member.id}> v zahraničí.`);
                        message.channel.send(`Občan <@${member.id}> byl poslán do gulagu a již nadále není naším soudruhem.`)
                        message.channel.send("<:FeelsOkayMan:720679806445944862>");
                        poslatDoGulagu(member, "Útěk");
                    }
                    else
                    {
                        message.channel.send(`Občana <@${member.id}> se mi nepodařilo najít.`)
                        message.channel.send("<:Sadge:720679806542282762>");
                    }
                }
                else
                    message.channel.send(`Občan <@${member.id}> není v zahraničí!`)
            }

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

        if (message.channel.id === '721683053998506035' || message.channel.id === '721680108678545478')
        {
            if (message.content.startsWith(`${prefix}dozahraničí`))
            {
                if (!message.member.roles.cache.has('721719328013156463'))
                {
                    if (message.member.roles.cache.has('720729222162808832'))
                    {
                        message.member.roles.add('721719328013156463');
                        message.channel.reply(" odcestoval do zahraničí.");
                    }
                    else if (Math.floor(Math.random() * 10 < 4))
                    {
                        message.member.roles.add('721719328013156463');
                        client.channels.cache.get('721704293954224230').send(`Občan <@${message.member.id}> utekl do zahraničí!`);
                        //message.member.send("Útěk do zahraničí se ti povedl, ale byl na tebe vydán zatykač!");
                    }
                    else
                    {
                        client.channels.cache.get('721704293954224230').send(`Občan <@${message.member.id}> se neúspěšně pokusil o útěk do zahraničí.`);
                        client.channels.cache.get('721704293954224230').send(`Byl poslán do gulagu a již nadále není naším soudruhem!`);
                        client.channels.cache.get('721704293954224230').send("<:FeelsOkayMan:720679806445944862>");
                        poslatDoGulagu(message.member, "Pokus o útěk");
                        //message.member.send("Útěk do zahraničí se ti nezdařil!\nByl jsi poslán do gulagu.");
                    }
                }
                else
                    message.channel.send("Už v zahraničí jsi!");
            }
        }

        if (message.channel.id === '721795206424559668')
        {
            if (message.content.startsWith(`${prefix}zezahraničí`))
            {
                if (message.member.roles.cache.has('721719328013156463'))
                {
                    if (message.member.roles.cache.has('720729222162808832'))
                    {
                        message.member.roles.remove('721719328013156463');
                        message.channel.reply(" přicestoval zpět ze zahraničí.");
                    }
                    else
                    {
                        message.member.roles.remove('721719328013156463');
                        client.channels.cache.get('721704293954224230').send(`Občan <@${message.member.id}> se vrátil zpět ze zahraničí.`);
                        client.channels.cache.get('721704293954224230').send(`Byl poslán do gulagu a již nadále není naším soudruhem!`);
                        client.channels.cache.get('721704293954224230').send("<:FeelsOkayMan:720679806445944862>");
                        poslatDoGulagu(message.member, "Pokus o útěk");
                        //message.member.send("Byl jsi poslán do gulagu za útěk do zahraničí!");
                    }
                }
                else
                    message.channel.send("Nejsi v zahraničí!");
            }
        }

        if (message.content.startsWith("okay"))
        {
            message.delete();
            message.channel.send("<:FeelsOkayMan:720679806445944862>");
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
    }

    if (message.member.roles.cache.has('721266865279860824'))
    {
        if (message.channel.id === '721795206424559668')
        {
            if (message.content.startsWith(`${prefix}zgulagu`))
            {
                message.member.roles.remove(['721266865279860824', '721719328013156463']);
                message.member.roles.add('721056101642272830');
                message.member.setNickname("Od nuly");
            }
        }
    }
});

client.login(token);
