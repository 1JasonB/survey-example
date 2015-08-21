angular.module('surveyBuilder', [
    'ui-router',
    'surveyBuilder.userModule',
])
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
}]);