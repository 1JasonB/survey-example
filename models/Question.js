
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
                    if (answers)
                    {
                        console.log('...found ' + answers.length + ' answers');
                    }
                    else
                    {
                        console.log('...found 0 answers');
                    }
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
                if (choices)
                {
                    console.log('Add Choices to question: ' + choices);
                    for (i = 0; i < choices.length; i++)
                    {
                        Choice.create({text: choices[i],
                                       QuestionId: this.id  });
                    }
                    callback(0, this);
                }
                else
                {
                    console.log('ERROR: No choices to add.');
                    callback(0, this);
                }
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
                        
                    if (answers && answers.length)
                    {
                        // Build list of previous questions
                        answers.forEach(function(a) {
                            oldQuestions.push(a.QuestionId);
                        });
                    }
                    // Get new questions
                    newQuestions = Question.find({
                        where: {id: {$notIn:oldQuestions}}
                    }).then(function(questions) {
                        if (questions && questions.length)
                        {
                            console.log('...found ' + questions.length + ' for user');
                            callback(null, questions[0]);
                        }
                        else
                        {
                            console.log('...found 0 question for user');
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