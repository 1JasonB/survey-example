
module.exports = function(db) {

    var express = require('express');
    var router = express.Router();

    // GET home page.
    router.get('/', function(req, res, next) {
        console.log('RENDER INDEX');
        res.render('index', { title: 'Survey Builder' });
    });

    // GET list of users
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

    // Login user
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

    // POST new user (Admin only)
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

    // POST new question (admin only)
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

    // POST answer to question
    router.post('/answer', function(req, res, next) {
        console.log('NEW ANSWER POST from User ID ' + req.session.userid + ': ' + JSON.stringify(req.body));
        if (req.session && req.session.userid)
        {
            db.Answer.addAnswer(req.session.userid, req.body.ChoiceId, req.body.QuestionId, function(err, answer) {
                res.status(200).send();
            });
        }
        else
        {
            res.status(500).send('Unauthorized');
        }
    });

    // GET all questions (without answers)
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

    // GET next question for logged in user
    router.get('/nextquestion', function(req, res, next) {
        console.log('NEXT QUESTION FOR: ' + req.session.username);
        if (!req.session.userid)
        {
            console.log('ERROR: No user ID');
            res.status(500).send('Unauthorized');
            return;
        }
        db.Question.getNewQuestionForUser(req.session.userid, function(err, question) {
        
            console.log('nextquestion: ' + JSON.stringify(question));
            if (question)
            {
                res.send(question);
            }
            else
            {
                if (err)
                {
                    console.log('ERROR: getNewQuestion - ' + err);
                }
                res.status(200).send('No more questions');
            }
        });
    });

    router.get('/results', function(req, res, next) {
        console.log('GET RESULTS...');
        if ((req.session) && (req.session.username === 'admin'))
        {
            db.Question.getResults(function(err, results) {
            
                if (results)
                {
                    res.send(results);
                }
                else
                {
                    if (err)
                    {
                        console.log('ERROR: getResults - ' + err);
                    }
                    res.send({status:'none'});
                }
                
            });
        }
        else
        {
            res.status(500).send('Unauthorized');
        }
    });

    return router;
};
