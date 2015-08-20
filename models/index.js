
module.exports = function() {

    console.log('Init index.js...');
    
    var Sequelize = require('sequelize'),
        sequelize = new Sequelize('survey', 'app', 'app', {
            dialect: 'mysql'
        });

    // load models
    var models = [
        'User'
        ],
        db = {};

    models.forEach(function(model) {
        var path = __dirname + '/' + model;
        db[model] = sequelize.import(path);
        console.log('...importing model, ' + model + ', from ' + path);
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
