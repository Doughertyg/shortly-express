const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
    if (!req.cookies.shortlyid) {
        models.Sessions.create()
            .then(next());
    }
    else next();
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

