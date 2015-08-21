angular.module('surveyBuilder', ['ui.router'])
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
    .state('posts', {
        url: '/posts/{id}',
        templateUrl: '/posts.html',
        controller: 'PostsController'
    });
    .state('users', {
        url: '/users',
        templateUrl: '/users.html',
        controller: 'UsersController'
    });

  $urlRouterProvider.otherwise('home');
}])
.factory('posts', [function(){
    var o = {
        posts: [
            {title: 'post 1', upvotes: 5},
            {title: 'post 2', upvotes: 2},
            {title: 'post 3', upvotes: 15},
            {title: 'post 4', upvotes: 9},
            {title: 'post 5', upvotes: 4}
        ]
    };
    return o;
}])
.controller('PostsController', [
'$scope',
'$stateParams',
'posts',
function($scope, $stateParams, posts) {
    $scope.post = posts.posts[$stateParams.id];
    $scope.addComment = function(){
      if($scope.body === '') { return; }
      $scope.post.comments.push({
        body: $scope.body,
        author: 'user',
        upvotes: 0
      });
      $scope.body = '';
    };
}])
.controller('UsersController', [
'$scope',
'users',
function($scope, $http) {
    $scope.users = [];
    $http.get('/users').success(function(data, status, headers, config) {
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
}])
.controller('mainController', [
'$scope',
'posts',
function($scope, posts){
    $scope.test = 'Hello world!';
    $scope.posts = posts.posts;
    $scope.addPost = function() {
        if (!$scope.title || $scope.title === '')
        {
            return;
        }
        $scope.posts.push({
            title: $scope.title,
            link: $scope.link,
            upvotes: 0,
            comments: [
                {author: 'Joe', body: 'Cool post!', upvotes: 0},
                {author: 'Bob', body: 'Great idea but everything is wrong!', upvotes: 0}
            ]
        });
        $scope.title = '';
        $scope.link = '';
    };
    $scope.incrementUpvotes = function(post) {
        post.upvotes += 1;
    };
}]);
