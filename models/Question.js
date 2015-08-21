
// Question, Choice, and Answer models
module.exports = function(sequelize, DataTypes) {

    var Answer = sequelize.define("Answer", {
        user: DataTypes.STRING,
    }, {
        classMethods: {
        }
    });

    var Choice = sequelize.define("Choice", {
        text: DataTypes.STRING,
    }, {
        classMethods: {
            associate: function(models) {
                Choice.hasMany(models.Answer, { as : 'answers' });
            },
        }
    });
    
    // QUESTION model definition
    var Question = sequelize.define("Question", {
    //    user_id: Sequelize.INT,
        text: DataTypes.STRING,
    }, {
        classMethods: {
            addQuestion: function(questionText, choices, callback) {
                
                var question = Question.build({text: questionText});
                question.save().then(function(newQuestion) {
                    callback(0, newQuestion);
                }).catch(function(error) {
                    callback(error, null);
                });
            },

            associate: function(models) {
                Question.hasMany(models.Choice, { as : 'choices' });
            },
        }
    });
    
    return [Question, Choice, Answer];
};