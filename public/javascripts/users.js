angular.module('surveyBuilderUsers', ['ui.router'])
.config([
'$stateProvider',
function($stateProvider) {

  $stateProvider
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
}])
.factory('users', ['$http', function(){
    var o = {
        users: [],
    };
    o.getAll = function() {
        return $http.get('/getusers').success(function(data){
            angular.copy(data, o.users);
        });
    };
    return o;
}])
.controller('UsersController', [
'$scope',
'users',
function($scope, $http) {
    $scope.users = users.users;

    $scope.addUser = function() {
        $http.post('/newuser', {
            username : $scope.username,
            password : $scope.password,
        }).success(function(data, status, headers, config) {
            $scope.users.push({
                username : $scope.username,
            });
            $scope.username = '';
            $scope.password = '';
        }).error(function(data, status, headers, config) {
            console.log("Ops: " + data);
        });
    };
}]);
