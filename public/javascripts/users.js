angular.module('surveyBuilderUsers', [])
.factory('users', [function(){
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
