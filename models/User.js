
module.exports = function(sequelize, DataTypes) {

    // model definition
    var User = sequelize.define("User", {
    //    user_id: Sequelize.INT,
        username: DataTypes.STRING,
        password: DataTypes.STRING,
    }, {
        instanceMethods: {
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
        }
    });
    
    return {
        User: User,
    };
};