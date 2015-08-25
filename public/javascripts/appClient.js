angular.module('surveyBuilder', [
    'surveyBuilder.adminControllers',
    'surveyBuilder.surveyControllers',
    'ui.router'
])
.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('login', {
        url: '/login',
        templateUrl: '/login.html',
        controller: 'loginController'
    })
    .state('users', {
        url: '/users',
        templateUrl: '/users.html',
        controller: 'UsersController',
        resolve: {
            userPromise: ['users', function(users){
              return users.getAll();
            }]
        }
    })
    .state('posts', {
        url: '/posts/{id}',
        templateUrl: '/posts.html',
        controller: 'PostsController'
    })
    .state('question', {
        url: '/question',
        templateUrl: '/question.html',
        controller: 'SurveyController',
        resolve: {
            questionPromise: ['question', function(question){
              return question.getQuestion();
            }]
        }
    })
    .state('newquestion', {
        url: '/newquestion',
        templateUrl: '/newquestion.html',
        controller: 'NewQuestionController',
        resolve: {
            questionListPromise: ['questionList', function(questionList) {
              return questionList.getAll();
            }]
        }
    })
    .state('results', {
        url: '/results',
        templateUrl: '/results.html',
        controller: 'ResultsController'
    });
    $urlRouterProvider.otherwise('login');
}])
.controller('loginController', [
'$scope',
'$http',
'$state',
function($scope, $http, $state) {
    
    console.log('Load loginController');
    $scope.statusMessage = 'Log in to admin console...';
    $scope.loginUser = function() {
        
        console.log('Log in...');
        var username = $scope.username;
        $http.post('/login', {username: $scope.username, password: $scope.password})
        .success(function(data, status, headers, config) {
            console.log('status: ' + JSON.stringify(status));
            if (status === 200)
            {
                $scope.statusMessage = 'Logged in as ' + username + '...';
                if (username === 'admin')
                {
                    console.log('Go users...');
                    $state.go('users');
                }
                else
                {
                    console.log('Go question...');
                    $state.go('question');
                }
            }
        }).error(function(data, status, headers, config) {
            console.log("Oops: " + data);
            $scope.statusMessage = 'Invalid Credentials';
        });

        $scope.username = '';
        $scope.password = '';
    };
}]);

