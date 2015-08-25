// Survey app: Node, MySQL

// Environment
var SVY_PORT = 4227,            // App port
    SVY_Admin = {               // Default admin user added to fresh DB
        username: 'admin',
        password: 'admin'
    },
    SVY_sqlConfig = {           // Assumes this MYSQL database and user account
        dbName: 'survey',
        username: 'app',
        password: 'app',
    },
    SVY_forceNewDB = false;     // Set true to start DB from scratch

// External modules
var express = require('express');
var session = require('express-session');
var app = express();
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Database models
var db = require('./models/index')(SVY_sqlConfig);
// App URL routes
var routes = require('./routes/index')(db);

// Express config
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// Use session for attaching user IDs to requests
app.use(session({secret: 'survey-builder', resave: false, saveUninitialized: false}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// Error handlers

// Development error handler will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// Production error handler no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

function initDB(callback)
{
    // Sync the model with the database
    db.sequelize.sync({ force: SVY_forceNewDB }).then(function() {
    
        console.log("DB Synch'd...");
        callback();
    }).catch(function(err) {
        console.log('ERROR: ' + err);
    });
}

app.listen(SVY_PORT);
console.log('...listening on port ' + SVY_PORT);
initDB(function() {
    db.User.ensureAdmin(SVY_Admin, function(error) {
    });
});

