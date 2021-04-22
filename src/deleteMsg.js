const sendMsg = require('./sendMsg');

module.exports = (message, reason = "", reasonLocation) => {

    message.delete();

    reason.trim();
    if (reason != "")
        sendMsg(reason, reasonLocation);
        
}