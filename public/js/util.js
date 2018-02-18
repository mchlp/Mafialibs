
function getURL(urlString, level) {
    if (urlString.indexOf('http://') === 0 || urlString.indexOf('https://') === 0) {
        return urlString;
    } else {
        for (var i=0; i<level; i++) {
            urlString = "../" + urlString;
        }
        return urlString;
    }
}