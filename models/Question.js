
// Question, Choice, and Answer models
module.exports = function(sequelize, DataTypes) {

    // QUESTION model definition
    var Question = sequelize.define("Question", {
    //    user_id: Sequelize.INT,
        question: DataTypes.STRING,
    }, {
        classMethods: {
            addQuestion: function(questionText, choices, callback) {
                
                var question = Question.build({question: questionText});
                question.save().then(function(newQuestion) {
                    callback(0, newQuestion);
                }).catch(function(error) {
                    callback(error, null);
                });
            },
        }
    });
    
    return {
        Question: Question,
    };
};