angular.module('surveyBuilderAdmin.adminController', [
])
.controller('adminController', function($scope) {
    
    console.log('Load adminController');
    $scope.loginAdmin = function() {
        
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
});
