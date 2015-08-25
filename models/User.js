
module.exports = function(sequelize, DataTypes) {

    var crypto = require('crypto');

    // model definition
    var User = sequelize.define("User", {
        username: DataTypes.STRING,
        password: DataTypes.STRING,
    }, {
        classMethods: {
            addUser: function(username, password, callback) {

                var shasum = crypto.createHash('sha1');

                shasum.update(password);
                password = shasum.digest('hex');
                
                var user = User.build({ username: username, password: password });
                user.save().then(function(user) {
                    callback(0, user);
                }).catch(function(error) {
                    callback(error, null);
                });
            },
            loginUser: function(username, password, callback) {

                var shasum = crypto.createHash('sha1');

                shasum.update(password);
                password = shasum.digest('hex');
                
                var user = User.findOne({
                    where:{username: username, password: password}
                }).then(function(user) {
                    console.log('LOGIN FOUND USER: ' + user);
                    callback(null, user);
                }).catch(function(error) {
                    console.log('ERROR: loginUser - ' + error);
                    callback(error, null);
                });
            },
            // If we don't have an admin user, create one
            ensureAdmin: function (adminUser, callback)
            {
                var user = User.findOne({
                    where:{username: adminUser.username}
                }).then(function(user) {
                    if (user)
                    {
                        console.log('ADMIN USER FOUND.');
                        callback(null);
                    }
                    else
                    {
                        User.addUser(adminUser, function(error, user) {
                            if (user)
                            {
                                console.log('ADDED NEW ADMIN USER.');
                            }
                            else
                            {
                                console.log('ERROR: Add admin - ' + error);
                            }
                            callback(error);
                        });
                    }
                }).catch(function(error) {
                    console.log('ERROR: ensureAdmin - ' + error);
                    callback(error);
                });
            }
        },
    });
    
    return User;
};