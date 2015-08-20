// Survey app: Node, MySQL

var app = require('express')(),
    crypto = require('crypto'),
    Sequelize = require('sequelize');

// Environment
var SVY_SQLPORT = 2835,
    APP_PORT = 4227;

// var sequelize = new Sequelize('mysql://localhost:' + SVY_SQLPORT + '/survey');
var sequelize = new Sequelize('survey', null, null, {
    dialect: 'mysql'
});

// model definition
var User = sequelize.define("User", {
//    user_id: Sequelize.INT,
    username: Sequelize.STRING,
    password: Sequelize.STRING,
}, {
    instanceMethods: {
        add: function(onSuccess, onError) {
            var username = this.username;
            var password = this.password;
            
            var shasum = crypto.createHash('sha1');
            shasum.update(password);
            password = shasum.digest('hex');
            
            User.build({ username: username, password: password })
                .save().success(onSuccess).error(onError);
        },
    }
});

var Question = sequelize.define("Question", {
    question_id: Sequelize.INT,
    question: Sequelize.STRING,
    count: Sequelize.INT,
}, {
    instanceMethods: {
        getChoices: function(question_id, onSuccess, onError) {
            Choice,find({where:{question_id: question_id}}).success(onSuccess).error(onError);
        },
    }
});

var Choice = sequelize.define("Choice", {
    choice: Sequelize.STRING,
    question_id: Sequelize.INT,
    count: Sequelize.INT,
});

var Answer = sequelize.define("Answer", {
    user_id: Sequelize.INT,
    choice_id: Sequelize.INT,
    question_id: Sequelize.INT,
});

Question.hasMany(Choice, {as: 'Choices'});
// question.setChoices([choice]);



app.get('/users', function(req, res) {
    
});

function initUsers()
{
    //sync the model with the database
    sequelize.sync({ force: true }).success(function(err) {
        // insert new user
        User.create({
            username: "guest",
            password: "guest",
        }).success(function(user) {
            // you can now access the newly created user via the variable user
            console.log('User: ' + user);
        });
    });
}

// initializing a port
app.listen(APP_PORT);
console.log('...listending on port ' + APP_PORT);
initUsers();
