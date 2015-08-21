module.exports = function(db) {

    var express = require('express');
    var router = express.Router();

    /* GET home page. */
    router.get('/', function(req, res, next) {
        res.render('index', { title: 'Survey Builder' });
    });

    router.get('/users', function(req, res, next) {
        db.User.find({})
        .then(function(users) {
            if (users && users.length)
            {
                res.send(users);
            }
            else
            {
                res.send('No users');
            }
        });
    });

    return router;
};
