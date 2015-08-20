
module.exports = function() {

    var Sequelize = require('sequelize'),
        sequelize = new Sequelize('survey', null, null, {
            dialect: 'mysql'
        });

    // load models
    var models = [
        'User'
        ],
        db = {};

    models.forEach(function(model) {
      db[model] = sequelize.import(__dirname + '/' + model);
    });

    Object.keys(db).forEach(function(modelName) {
      if ('associate' in db[modelName]) {
        db[modelName].associate(db);
      }
    });

    return {
        db: db,
        sequelize: sequelize,
    };
};
