const sendMsg = require('./sendMsg');
const deleteMsg = require('./deleteMsg');

module.exports = function (message, bannedPhrases, deleteBool = true, banBool = false) {

    const content = message.content;
    console.log(content);
    bannedPhrases.forEach(phrase => {
        if (content.includes(phrase)) {
            if ((content[content.indexOf(phrase) - 1] == ' ' ||
                !content[content.indexOf(phrase) - 1])
                &&
                (content[content.indexOf(phrase) + phrase.length] == ' ' ||
                !content[content.indexOf(phrase) + phrase.length])) {
                    if (deleteBool)
                        deleteMsg(message);
            }
        }
    });

}