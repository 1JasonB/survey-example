
// Question, Choice, and Answer models
module.exports = function(sequelize, DataTypes) {

    var Answer = sequelize.define("Answer", {
        UserId: DataTypes.INTEGER,
    }, {
        classMethods: {
            addAnswer: function(userID, choiceId, questionId, callback) {
                
                Answer.create({
                    UserId: userId,
                    ChoiceId: choiceId,
                    QuestionId: questionId,
                });
            },

            answersForUser: function(userId, callback) {
                console.log('...find answers for ' + userId);
                Answer.find({
                    where: {'UserId': userId}
                }).then(function(answers) {
                    console.log('...found ' + answers.length + ' answers');
                    callback(null, answers);
                }).catch(function(err) {
                    console.log('ERROR: findAnswers - ' + err);
                    callback(err, null);
                });
            }
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
        instanceMethods: {
            addChoices: function(choices, callback) {
                var i;
                for (i = 0; i < choices.length; i++)
                {
                    Choice.create({text: choices[i],
                                   QuestionId: this.id  });
                }
                callback(0, this);
            },
            
            getChoices: function(callback) {
                Choice.find({
                    where: {QuestionId: this.id},
                }).then(function(choices) {
                    callback(null, choices);
                }).catch(function(err) {
                    callback(err, null);
                });
            },
        },
        classMethods: {
            addQuestion: function(questionText, choices, callback) {
                
                var question = Question.build({text: questionText});
                question.save().then(function(newQuestion) {
                    newQuestion.addChoices(choices, callback);
                }).catch(function(error) {
                    console.log('ERROR: addQuestion - ' + error);
                    callback(error, null);
                });
            },
            
            getNewQuestionForUser: function(userId, callback) {
                // Get users previous answers
                var answers = Answer.answersForUser(userId, function(err, answers) {
                    var newQuestions = [],
                        oldQuestions = [];
                        
                    // Build list of previous questions
                    answers.forEach(function(a) {
                        oldQuestions.push(a.QuestionId);
                    });
                    // Get new questions
                    newQuestions = Question.find({
                        where: {id: {$notIn:oldQuestions}}
                    }).then(function(questions) {
                        console.log('...found ' + questions.length + ' for user');
                        if (questions.length)
                        {
                            console.log('...found ' + questions.length + ' for user');
                            callback(null, questions[0]);
                        }
                        else
                        {
                            callback(null, null);
                        }
                    }).catch(function(err) {
                        console.log('ERROR: getNewQuestions - ' + err);
                        callback(err, null);
                    });
                });
            },

            associate: function(models) {
                Question.hasMany(models.Choice, { as : 'choices' });
                Question.hasMany(models.Answer, { as : 'answers' });
            },
        }
    });
    
    return [Question, Choice, Answer];
};