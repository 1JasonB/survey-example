angular.module('surveyBuilder.surveyControllers', [])
.factory('question', ['$http', function($http){
    var o = {
        question: {
            text: 'Sample question',
            choices: [{text: 'Answer 1'}, {text: 'Answer 2'}, {text: 'Answer 3'}, {text: 'Answer 4'}],
        }
    };
    console.log('Init question factory...');
    o.getQuestion = function() {
        return $http.get('/nextquestion').success(function(data){
            console.log('Received data: ' + JSON.stringify(data));
            if (data)
            {
                angular.copy(data, o.question);
            }
            else
            {
                // No more questions for this user
                console.log('No more questions.');
                o.question.text = 'No more questions';
                o.question.choices = [];
            }
        }).error(function(error) {
            console.log('No next question found.');
        });
    };
    return o;
}])
.controller('SurveyController', [
'$scope',
'$http',
'question',
function($scope, $http, question) {
    console.log('Initial question: ' + JSON.stringify(question.question));
    $scope.question = question.question.text;
    $scope.choices = question.question.choices;

    $scope.submitAnswer = function() {
        console.log('Answered question: ' + $scope.choiceId);
        answer = {
            ChoiceId: $scope.choiceId,
            QuestionId: question.question.id,
        };
        $http.post('/answer', answer).success(function(data, status, headers, config) {
            
        }).error(function(data, status, headers, config) {
            console.log("ERROR: Could not answer - " + data);
        });
    };
}]);

