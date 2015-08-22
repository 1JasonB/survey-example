angular.module('surveyBuilderAdmin.adminController', [
    'ui-router',
])
.controller('adminController', [
'$scope',
function($scope) {
    
    $scope.loginAdmin = function() {
        
        $http.post('/login', {username: $scope.username, password: $scope.password})
        .success(function(data, status, headers, config) {
            if (status == 200)
            {
                $scope.statusMessage = 'Logged in as admin...';
                $state.go('users');
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
}]);
