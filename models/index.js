
module.exports = function(sqlConfig) {

    console.log('Init index.js...');
    
    var Sequelize = require('sequelize'),
        sequelize = new Sequelize(sqlConfig.dbName, sqlConfig.username, sqlConfig.password, {
            dialect: 'mysql'
        });

    // load models
    var models = [
        'User',
        'Question',
        ],
        db = {};

    models.forEach(function(model) {
        var path = __dirname + '/' + model;
        var dbModels = sequelize.import(path);
        if (Array.isArray(dbModels))
        {
            dbModels.forEach(function(m) {
                db[m.name] = m;
                console.log('...importing model, ' + m.name + ', from ' + path);
            });
        }
        else
        {
            db[dbModels.name] = dbModels;
            console.log('...importing model, ' + dbModels.name + ', from ' + path);
        }
    });

    Object.keys(db).forEach(function(modelName) {
      if ('associate' in db[modelName]) {
        db[modelName].associate(db);
      }
    });

    db.sequelize = sequelize;
    
    return db;
};
