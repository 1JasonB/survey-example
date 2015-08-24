angular.module('surveyBuilder.surveyControllers', [])
.factory('question', ['$http', function($http){
    var o = {
        text: 'Sample question',
        choices: [{text: 'Answer 1'}, {text: 'Answer 2'}, {text: 'Answer 3'}, {text: 'Answer 4'}],
    };
    console.log('Init question factory...');
    o.getQuestion = function() {
        return $http.get('/nextquestion').success(function(data){
            console.log('Received data: ' + JSON.stringify(data));
            if (data.text)
            {
                angular.copy(data, o.question);
            }
            else
            {
                // No more questions for this user
                console.log('No more questions.');
                o.text = 'No more questions';
                o.choices = [];
            }
        });
    };
    return o;
}])
.controller('SurveyController', [
'$scope',
'question',
function($scope, question) {
    $scope.question = question.text;
    $scope.choices = question.choices;

    $scope.submitAnswer = function() {
        console.log('Answered question.');
    };
}]);

