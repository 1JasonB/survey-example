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
                req.session.userid = user.id;
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
        if ((req.session) && (req.session.username === 'admin'))
        {
            res.status(200).send();
            db.User.addUser(req.body.username, req.body.password, function(err, newUser) {
                
            });
        }
        else
        {
            res.status(500).send('Unauthorized');
        }
    });

    router.post('/newquestion', function(req, res, next) {
        console.log('NEW QUESTION POST: ' + JSON.stringify(req.body));
        if ((req.session) && (req.session.username === 'admin'))
        {
            res.status(200).send();
            db.Question.addQuestion(req.body.text, req.body.choices, function(err, newQuestion) {
                
            });
        }
        else
        {
            res.status(500).send('Unauthorized');
        }
    });

    router.get('/getquestions', function(req, res, next) {
        console.log('GET QUESTIONS');
        db.Question.findAll()
        .then(function(questions) {

            if (questions && questions.length)
            {
                console.log(questions.length + ' questions');
                res.status(200).send(questions);
            }
            else
            {
                res.status(200).send([]);
            }
        });
    });

    router.get('/nextquestion', function(req, res, next) {
        console.log('NEXT QUESTION FOR: ' + req.session.username);
        if (!req.session.userid)
        {
            res.status(500).send('Unauthorized');
        }
        db.Question.getNewQuestionForUser(req.session.userid, function(err, question) {
        
            if (question)
            {
                req.status(200).send(question);
            }
            else
            {
                if (err)
                {
                    console.log('ERROR: getNewQuestion - ' + error);
                }
                req.status(200).send('No more questions');
            }
        });
    });

    return router;
};
