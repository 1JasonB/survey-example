angular.module('surveyBuilderUser')
.controller('UsersController', [
'$scope',
'users',
function($scope, $http) {
    $scope.users = [];
    $http.get('/getusers').success(function(data, status, headers, config) {
        $scope.users = data;
        if (data == "") {
            $scope.users = [];
        }
    }).error(function(data, status, headers, config) {
        console.log("Oops: could not get any users");
    });

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
