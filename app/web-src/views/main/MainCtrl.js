
'use strict';

angular.module('webapp')
.controller('MainCtrl', function ($scope, $http, $rootScope, $location, $window) {
	$scope.user = {};
	$scope.newUser = {};
	$scope.statusMessage = "";

	$scope.shareMessage = "Hello from a test app!";
	$scope.shareOptions = {
		facebook: false,
		twitter: false
	};

	$scope.share = function(message, networks) {
		$http.post('/share', {message: message, networks: networks})
			.success(function(data) {
				$scope.statusMessage = data;
			})
			.error(function(data, status, headers, config) {
				$scope.statusMessage = data;
			});
	};

	$scope.login = function(user) {
		console.log("Logging in as " + user.username);
		$http.post('/user/login', $scope.user)
			.success(function(data) {
				console.log("Logged in as " + data);
				$rootScope.user = data;
				$location.path('/');
			})
			.error(function(data, status, headers, config) {
				$scope.statusMessage = data;
			});
	};

	$scope.register = function(newUser) {
		console.log("Registering new user " + newUser.username);

		if (newUser.password != newUser.confirmPassword) {
			console.log("Passwords don't match.");
			return null;
		}

		$http.post('/user/register', $scope.newUser)
			.success(function(data) {
				$rootScope.user = data;
				$location.path('/');
				$window.reload();
			})
			.error(function(data, status, headers, config) {
				$scope.statusMessage = data;
			});
	};
});