angular.module('surveyBuilder.surveyControllers', [])
.factory('question', ['$http', function($http){
    var o = {
        question: 'Sample question',
        choices: [{text: 'Answer 1'}, {text: 'Answer 2'}, {text: 'Answer 3'}, {text: 'Answer 4'}],
    };
    console.log('Init question factory...');
    /*
    o.getAll = function() {
        return $http.get('/getusers').success(function(data){
            angular.copy(data, o.users);
        });
    };
    o.create = function(user) {
        $http.post('/newuser', user).success(function(data, status, headers, config) {
            o.users.push(user);
        }).error(function(data, status, headers, config) {
            console.log("Oops: " + data);
        });
    };
    */
    return o;
}])
.controller('SurveyController', [
'$scope',
'question',
function($scope, question) {
    $scope.question = question.question;
    $scope.choices = question.choices;

    $scope.submitAnswer = function() {
        console.log('Answered question.');
    };
}]);
