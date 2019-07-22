const parseCookies = (req, res, next) => {
    if (req.headers.cookie) {
        var cookie = req.headers.cookie.split('; ');
        var cookieObj = {};

        for(var i = 0; i < cookie.length; i++) {
            let split = cookie[i].split('=');
            cookieObj[split[0]] = split[1];
        }

        req.cookies = cookieObj;
    }
    next();
};

module.exports = parseCookies;