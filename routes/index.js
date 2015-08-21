module.exports = function(db) {

    var express = require('express');
    var router = express.Router();

    /* GET home page. */
    router.get('/', function(req, res, next) {
        res.render('index', { title: 'Survey Builder' });
    });

    router.get('/users', function(req, res, next) {
        res.render('user', { title: 'Survey Builder - Users' });
    });

    router.get('/getusers', function(req, res, next) {
        db.User.findAll()
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

    router.post('/newuser', function(req, res, next) {
        console.log('NEW USER POST: ' + req.body.username);
        res.status(200);
    });

    return router;
};
