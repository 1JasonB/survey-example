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
        return $http.get('/getquestion').success(function(data){
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
        questionList.create({
            text : $scope.questionText,
            choices : [
                {text: $scope.answerText1},
                {text: $scope.answerText2},
                {text: $scope.answerText3},
                {text: $scope.answerText4},
            ]
         });
        $scope.questions.push({text: $scope.questionText});
        $scope.questionText = '';
        $scope.answerText1 = '';
        $scope.answerText2 = '';
        $scope.answerText3 = '';
        $scope.answerText4 = '';
    };
}]);

