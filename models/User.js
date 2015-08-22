
module.exports = function(sequelize, DataTypes) {

    var crypto = require('crypto');

    // model definition
    var User = sequelize.define("User", {
    //    user_id: Sequelize.INT,
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
                    callback(null, user);
                }).catch(function(error) {
                    callback(error, null);
                });
            },
        }
    });
    
    return User;
};