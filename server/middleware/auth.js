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
                    req.session = { hash };
                    res.cookies = { "shortlyid": { value: hash } };
                    next();
                });
        } else {
            req.session = { hash: req.cookies.shortlyid };
            models.Sessions.get({hash : req.session.hash })
                // .catch((e) => {
                //     console.log('CAUGHT BAD COOKIE', e);
                //     delete req.cookies.shortlyid;
                //     createSession(req, res, next);
                // })
                .then((sessionObj) => {
                    if(sessionObj === undefined) {
                        console.log('CAUGHT BAD COOKIE');
                        delete req.cookies.shortlyid;
                        models.Sessions.create()
                            .then((result) => {
                                return models.Sessions.get({id: result.insertId})
                            })
                            .then(({ hash }) => {
                                req.session = { hash };
                                res.cookies = { "shortlyid": { value: hash } };
                                throw 'promise aborted';
                            })
                            .catch(err => {
                                console.log('first catch and next', err);
                                next();
                            });
                    } else {
                        req.session.userId = sessionObj.userId;
                        return models.Users.get({ "id": req.session.userId })
                            .then(({ username }) => {
                                req.session.user = { username };
                                console.log('SECOND THEN');
                                next();
                            })
                            .catch(err => {
                                console.log('second catch');
                                next();
                            });
                    }
                });
        }
    }
    else next();
};

/************************************************************/
// Add additional authentication middleware functions below
/************************************************************/

