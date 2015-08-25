angular.module('surveyBuilder.adminControllers', [])
.factory('users', ['$http', function($http){
    var o = {
        users: ['test'],
    };
    console.log('Init users factory...');
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
    return o;
}])
.factory('questionList', ['$http', function($http){
    var o = {
        questionList: [
            {text:'Sample Question',
             choices: [{text:'Answer 1'},{text:'Answer 2'},{text:'Answer 3'},{text:'Answer 4'}]
            }],
    };
    console.log('Init questionList factory...');
    o.getAll = function() {
        return $http.get('/getquestions').success(function(data){
            angular.copy(data, o.questionList);
        }).error(function(error) {
            console.log('No questions found.');
        });
    };
    o.create = function(question) {
        $http.post('/newquestion', question).success(function(data, status, headers, config) {
            o.questionList.push(question);
        }).error(function(data, status, headers, config) {
            console.log("Oops: " + data);
        });
    };
    return o;
}])
.factory('resultsSummary', ['$http', function($http){
    var o = {
        results: {
            status:'ok',
            questionCount: 3,
        },
    };
    o.getAll = function() {
        return $http.get('/results').success(function(data){
            angular.copy(data, o.results);
        });
    };
    return o;
}])
.controller('UsersController', [
'$scope',
'users',
function($scope, users) {
    $scope.users = users.users;
    console.log('Initial users: ' + JSON.stringify(users.users));

    $scope.addUser = function() {
        users.create({
            username : $scope.username,
            password : $scope.password,
        });
        $scope.users.push($scope.username);
        $scope.username = '';
        $scope.password = '';
    };
}])
.controller('NewQuestionController', [
'$scope',
'questionList',
function($scope, questionList) {
    $scope.questions = questionList.questionList;
    console.log('Initial question: ' + JSON.stringify(questionList.questionList));

    $scope.addQuestion = function() {
        var validChoices = [];
        if ($scope.answerText1 && ($scope.answerText1 !== ''))
        {
            console.log('Adding choice: ' + $scope.answerText1);
            validChoices.push({text: $scope.answerText1});
        }
        if ($scope.answerText2 && ($scope.answerText2 !== ''))
        {
            console.log('Adding choice: ' + $scope.answerText2);
            validChoices.push({text: $scope.answerText2});
        }
        if ($scope.answerText3 && ($scope.answerText3 !== ''))
        {
            console.log('Adding choice: ' + $scope.answerText3);
            validChoices.push({text: $scope.answerText3});
        }
        if ($scope.answerText4 && ($scope.answerText4 !== ''))
        {
            console.log('Adding choice: ' + $scope.answerText4);
            validChoices.push({text: $scope.answerText4});
        }
        if (($scope.questionText !== '') && (validChoices.length > 1))
        {
            questionList.create({
                text : $scope.questionText,
                choices : validChoices,
             });
            $scope.questionText = '';
            $scope.answerText1 = '';
            $scope.answerText2 = '';
            $scope.answerText3 = '';
            $scope.answerText4 = '';
        }
        else
        {
            $scope.questionText = 'Invalid question';
        }
    };
}])
.controller('ResultsController', [
'$scope',
'resultsSummary',
function($scope, resultsSummary) {
    $scope.questionCount = resultsSummary.results.questionCount;
    $scope.results = resultsSummary.results.answerSummary;
}]);

