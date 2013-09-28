
'use strict';

angular.module('webapp')
.controller('MainCtrl', function ($scope, $http, $rootScope, $location, $window) {
	$scope.user = {};
	$scope.newUser = {};
	$scope.statusMessage = "";

	$scope.login = function(user) {
		console.log("Logging in as " + user.username);
	};

	$scope.register = function(newUser) {
		console.log("Registering new user " + newUser.username);

		if (newUser.password != newUser.confirmPassword) {
			console.log("Passwords don't match.");
			return null;
		}

	};

	$scope.connectTwitter = function() {
		console.log("Connecting to twitter");
		$location.path('/auth/twitter');
	};

	$scope.connectFacebook = function() {
		console.log("Connecting to facebook");
		$location.path('/auth/facebook');
	};



});