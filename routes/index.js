module.exports = function(db) {

    var express = require('express');
    var router = express.Router();

    /* GET home page. */
    router.get('/', function(req, res, next) {
        console.log('RENDER INDEX');
        res.render('index', { title: 'Survey Builder' });
    });

    router.get('/admin/', function(req, res, next) {
        console.log('RENDER ADMIN');
        res.render('admin', { title: 'Survey Builder Admin' });
    });

    router.get('/users/', function(req, res, next) {
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

    router.post('/login', function(req, res, next) {
        console.log('LOGIN: ' + req.body.username);
        db.User.loginUser(req.body.username, req.body.password, function(err, user) {
            if (user)
            {
                console.log(req.body.username + ' is now logged in.');
                req.session.loggedIn = true;
                req.session.username = user.username;
                res.status(200).send();
            }
            else
            {
                console.log(req.body.username + ' not found');
                res.status(404).send();
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
