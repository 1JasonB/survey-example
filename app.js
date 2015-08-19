// Survey app: Node, MySQL

var app = require('express'),
    Sequelize = require('sequelize');

/*
// Environment
var SVY_SQLPORT = 2835;

var sequelize = new Sequelize('mysql://localhost:' + SVY_SQLPORT + '/survey');

// model definition
var User = sequelize.define("User", {
    username: Sequelize.STRING,
    password: Sequelize.STRING
});
*/

app.get("/";, function(req, res) {
    res.send({name:"Hello Wolrd"});
});
 
// initializing a port
app.listen(4227);