angular.module('surveyBuilderAdmin', [
    'surveyBuilderAdmin.controllers',
    // 'ui-router',
    'ngRoute',
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.
	when("/admin", {templateUrl: "/admin.html", controller: "adminController"}).
	otherwise({redirectTo: '/admin'});
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

