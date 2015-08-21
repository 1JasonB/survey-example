module.exports = function(db) {

    var express = require('express');
    var router = express.Router();

    /* GET home page. */
    router.get('/', function(req, res, next) {
        console.log('RENDER INDEX');
        res.render('index', { title: 'Survey Builder' });
    });

    router.get('/users', function(req, res, next) {
        console.log('RENDER USERS');
        res.render('users', { title: 'Survey Builder - Users' });
    });

    router.get('/getusers', function(req, res, next) {
        console.log('GET USERS');
        db.User.findAll()
        .then(function(users) {

            if (users && users.length)
            {
                console.log(users.length + ' users');
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
        db.User.addUser(req.body.username, req.body.password, function(err, newUser) {
        });
    });

    return router;
};
