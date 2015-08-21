// Survey app: Node, MySQL

var express = require('express');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var db = require('./models/index')();

var routes = require('./routes/index')(db);
// var users = require('./routes/users');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
// app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


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

function addUser(name, password)
{
        var User = db.User;
        var user = User.addUser(name, password, function(err, newUser) {
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

function initDB(callback)
{
    //sync the model with the database
    db.sequelize.sync({ force: true }).then(function() {
    
        console.log("DB Synch'd...");
        callback();
    }).catch(function(err) {
        console.log('ERROR: ' + err);
    });
}

// initializing a port
app.listen(APP_PORT);
console.log('...listening on port ' + APP_PORT);
initDB(function() {
    addUser('jason','jason');
});

