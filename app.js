// Survey app: Node, MySQL

var app = require('express')(),
    Sequelize = require('sequelize');

// Environment
var SVY_SQLPORT = 2835;

var sequelize = new Sequelize('mysql://localhost:' + SVY_SQLPORT + '/survey');

/*
// model definition
var User = sequelize.define("User", {
    username: Sequelize.STRING,
    password: Sequelize.STRING
});
*/

// check database connection
sequelize.authenticate().complete(function(err) {
    if (err)
    {
      console.log('Unable to connect to the database:', err);
    }
    else
    {
      console.log('Connection has been established successfully.');
    }
});

app.get("/", function(req, res) {
    res.send({name:"Hello World"});
});
 
// initializing a port
app.listen(4227);