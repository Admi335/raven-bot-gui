module.exports = str => {

    function findSubstring(quote = "\"") {
        let subStrI = str.indexOf(quote);
        let subStrEnd;

        if (subStrI != -1 && subStrEnd != -1) {
            for (let i = subStrI; i < str.length; i++)
            {
                if (str[i] == quote && str[i - 1] != "\\")
                    subStrEnd = i;
            }

            return str.substring(subStrI + 1, subStrEnd);
        }

        if (subStrI == -1 || subStrEnd == -1) {
            if (quote == "\"") return findSubstring("'");
            else               return undefined;
        }
    }

    return findSubstring();

}