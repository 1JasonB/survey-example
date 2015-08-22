angular.module('surveyBuilderAdmin', [
    'ui-router',
    'surveyBuilderAdmin.AdminController',
])
.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('admin', {
        url: '/admin',
        templateUrl: '/admin.html',
        controller: 'AdminController'
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
    */
    $urlRouterProvider.otherwise('admin');
}])
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

