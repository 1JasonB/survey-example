angular.module('surveyBuilderAdmin', [
    // surveyBuilderAdmin.controllers',
    'ui-router',
])
.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
        url: '/home',
        templateUrl: '/home.html',
        controller: 'mainController'
    })
 
    // $urlRouterProvider.otherwise('admin');
}])
.controller('mainController', [
'$scope',
function($scope) {
    
    console.log('Load adminController');
    $scope.statusMessage = 'Log in to admin console...';
    /*
    $scope.loginAdmin = function() {
        
        console.log('Log in admin...');
    };
     
        $http.post('/login', {username: $scope.username, password: $scope.password})
        .success(function(data, status, headers, config) {
            if (status == 200)
            {
                $scope.statusMessage = 'Logged in as admin...';
                // $state.go('users');
            }
            else
            {
                $scope.statusMessage = 'Invalid Credentials';
            }
        }).error(function(data, status, headers, config) {
            console.log("Oops: " + data);
        });

        $scope.username = '';
        $scope.password = '';
    };
    */
}]);

/*
.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
        url: '/admin',
        templateUrl: '/admin.html',
        controller: 'adminController'
    })
    /*
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
 
    $urlRouterProvider.otherwise('home');
}]);
*/
/*
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
        $scope.push($scope.username);
        $scope.username = '';
        $scope.password = '';
    };
}]);
*/

