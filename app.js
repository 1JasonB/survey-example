// Survey app: Node, MySQL

var app = require('express')(),
    crypto = require('crypto');

var db = require('./models');

// Environment
var SVY_SQLPORT = 2835,
    APP_PORT = 4227;

/*
var Question = sequelize.define("Question", {
    question_id: Sequelize.INTEGER,
    question: Sequelize.STRING,
    count: Sequelize.INTEGER,
}, {
    instanceMethods: {
        getChoices: function(question_id, onSuccess, onError) {
            Choice,find({where:{question_id: question_id}}).success(onSuccess).error(onError);
        },
    }
});

var Choice = sequelize.define("Choice", {
    choice: Sequelize.STRING,
    question_id: Sequelize.INTEGER,
    count: Sequelize.INTEGER,
});

var Answer = sequelize.define("Answer", {
    user_id: Sequelize.INTEGER,
    choice_id: Sequelize.INTEGER,
    question_id: Sequelize.INTEGER,
});

Question.hasMany(Choice, {as: 'Choices'});
// question.setChoices([choice]);
*/

var SVY_User = {};

app.get('/users', function(req, res) {
    res.send(200, SVY_User);
});

function initUsers()
{
    //sync the model with the database
    db.sequelize.sync({ force: true }).complete(function(err) {
    
        if (err)
        {
            throw(err[0]);
        }
        else
        {
            console.log("DB Synch'd...");
            var User = db.User;
            var user = User.addUser("guest", "guest", function(err, newUser) {
                if (newUser)
                {
                    console.log(newUser);
                    SVY_User = newUser;
                }
                else
                {
                    console.log('ERROR: ' + err);
                }
            });
        }
    });
}

// initializing a port
app.listen(APP_PORT);
console.log('...listending on port ' + APP_PORT);
initUsers();
