
// Question, Choice, and Answer models
module.exports = function(sequelize, DataTypes) {

	var getRnd = function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};
    
    // Return questions indexed by question ID
    function initQuestionSummary(questions, choices)
    {
        var i, summary = {};
        
        for (i = 0; i < questions.length; i++)
        {
            summary[questions[i].id] = {
                text: questions[i].text,
                choices: {}
            };
        }

        for (i = 0; i < choices.length; i++)
        {
            choices[i].count = 0;
            summary[choices[i].QuestionId].choices[choices[i].id] = {
                text: choices[i].text,
                count: 0
            };
        }

        return summary;
    }
    
    // Total the number of answer for each choice and add to question summary
    function summarizeAnswers(questions, choices, answers)
    {
        var i, questionsSummary = initQuestionSummary(questions, choices);
        
        for (i = 0; i < answers.length; i++)
        {
            questionsSummary[answers[i].QuestionId].choices[answers[i].ChoiceId].count++;
        }
        
        return questionsSummary;
    }

    var Answer = sequelize.define("Answer", {
        UserId: DataTypes.INTEGER,
    }, {
        classMethods: {
            addAnswer: function(userId, choiceId, questionId, callback) {
                
                Answer.create({
                    UserId: userId,
                    ChoiceId: choiceId,
                    QuestionId: questionId,
                }).then(function(answer) {
                    console.log('New answer from: ' + answer.UserId);
                    console.log('   Question: ' + answer.QuestionId);
                    console.log('   Choice: ' + answer.ChoiceId);
                    
                    callback(null, answer);
                }).error(function(error) {
                    console.log('ERROR: new Answer - ' + error);
                    callback(error, null);
                });
            },

            answersForUser: function(userId, callback) {
                console.log('...find answers for ' + userId);
                Answer.findAll({
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
        classMethods: {
            addChoices: function(question, choices, callback) {
                var i;
                if (choices)
                {
                    console.log('Add Choices to question: ' + choices);
                    for (i = 0; i < choices.length; i++)
                    {
                        Choice.create({text: choices[i].text,
                                       QuestionId: question.id  });
                    }
                    console.log('Added Choices...');
                    callback(0, question);
                }
                else
                {
                    console.log('ERROR: No choices to add.');
                    callback(0, question);
                }
            },

            addQuestion: function(questionText, choices, callback) {
                
                var question = Question.build({text: questionText});
                question.save().then(function(newQuestion) {
                    if (choices && choices.length)
                    {
                        console.log('Adding ' + choices.length + ' to question: ' + newQuestion.text);
                        Question.addChoices(newQuestion, choices, callback);
                    }
                    else
                    {
                        callback('New question requires choices', null);
                    }
                }).catch(function(error) {
                    console.log('ERROR: addQuestion - ' + error);
                    callback(error, null);
                });
            },
            
            getNewQuestionForUser: function(userId, callback) {
                // Get users previous answers
                var answers = Answer.answersForUser(userId, function(err, answers) {
                    var newQuestions = [],
                        oldQuestions = [0],
                        nextQuestion = null;
                        
                    if (answers && answers.length)
                    {
                        // Build list of previous questions
                        answers.forEach(function(a) {
                            oldQuestions.push(a.QuestionId);
                        });
                    }
                    // Get new questions
                    newQuestions = Question.findAll({
                        where: {id: {$notIn:oldQuestions}}
                    }).then(function(questions) {
                        var id;
                        if (questions && questions.length)
                        {
                            id = getRnd(0, questions.length - 1);
                            console.log('...found ' + questions.length + ' questions for user');
                            console.log('...selected question ' + id + ': ' + JSON.stringify(questions[id]));
                            Choice.findAll({
                                where:{QuestionId: questions[id].id}
                            }).then(function(questionChoices) {
                                nextQuestion = {
                                    QuestionId: questions[id].id,
                                    text: questions[id].text,
                                    choices: questionChoices,
                                };
                                console.log('...returning question: ' + JSON.stringify(nextQuestion));
                                callback(null, nextQuestion);
                            }).error(function(error) {
                                console.log('ERROR: findQuestionChoices ' + error);
                                callback(error, null);
                            });
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
            
            getResults: function(callback) {
            
                var resultsSummary = {status:'ok'};
                
                Question.findAll()
                .then(function(questions) {

                    console.log(questions.length + ' questions');
                    resultsSummary.questionCount = questions.length;

                    if (questions && questions.length)
                    {
                        Choice.findAll()
                        .then(function(choices) {
                            Answer.findAll()
                            .then(function(answers) {
                                resultsSummary.answerSummary = summarizeAnswers(questions, choices, answers);
                                console.log('RESULTS:');
                                console.log(JSON.stringify(resultsSummary.answerSummary));
                                callback(null, resultsSummary);
                            })
                            .catch(function(error) {
                                console.log('ERROR: findAll Answers - ' - error);
                                callback(null, {status:'none'});
                            });
                        })
                        .catch(function(error) {
                            console.log('ERROR: findAll Choices - ' - error);
                            callback(null, {status:'none'});
                        });
                    }
                    else
                    {
                        callback(null, {status:'none'});
                    }
                }).catch(function(error) {
                    console.log('ERROR: resultsSummary - ' + error);
                    callback(error, {status:'none'});
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