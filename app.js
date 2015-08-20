// Survey app: Node, MySQL

var app = require('express')();

var db = require('./models/index')();

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

var SVY_User = {username:null,password:null};

app.get('/users', function(req, res) {
    res.status(200).send(SVY_User);
});

function initUsers()
{
    //sync the model with the database
    db.sequelize.sync({ force: true }).then(function() {
    
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
    }).catch(function(err) {
        console.log('ERROR: ' + err);
    });
}

// initializing a port
app.listen(APP_PORT);
console.log('...listening on port ' + APP_PORT);
initUsers();
