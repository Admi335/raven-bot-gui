const ytdl = require('ytdl-core');

const sendMsg = require('./sendMsg.js');

const queue = new Map();

async function queueSong(message, url, serverQueue) {
    const songInfo = await ytdl.getInfo(url);
    console.log(songInfo);
    console.log(url);
    const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url
    };

    if (!serverQueue) {
        const queueContruct = {
            textChannel: message.channel,
            voiceChannel: message.member.voice.channel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        };

        queue.set(message.guild.id, queueContruct);
        queueContruct.songs.push(song);

        try {
            let connection = await message.member.voice.channel.join();
            queueContruct.connection = connection;

            play(message.guild, queueContruct.songs[0]);
        } catch (err) {
            console.log(err);
            queue.delete(message.guild.id);

            return sendMsg("err", message.channel);
        }
    }
    else {
        serverQueue.songs.push(song);
        console.log(serverQueue.songs);
                
        return sendMsg(`Queued: **${song.title}**`, message.channel);
    }
}

function play(guild, song) {
    const serverQueue = queue.get(guild.id);

    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }

    const dispatcher = serverQueue.connection
        .play(ytdl(song.url))
        .on("finish", () => {
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
        })
        .on("error", error => console.error(error));

    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    sendMsg(`Now playing: **${song.title}**`, serverQueue.textChannel);
}

function getQueue() {
    return queue;
}

module.exports = {
    queueSong,
    getQueue
};