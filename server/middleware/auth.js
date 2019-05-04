const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
    if (req.cookies !== undefined) {
        if (req.cookies.shortlyid === undefined) {
            models.Sessions.create()
                .then((result) => {
                    return models.Sessions.get({id: result.insertId})
                })
                .then(({ hash }) => {
                    req.session = { "hash": hash };
                    res.cookies = { "shortlyid": {value: hash } };
                    next();
                });
        } else {
            req.session = { hash: req.cookies.shortlyid };
            next();
        }
    }
    else next();
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

