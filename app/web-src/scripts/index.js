'use strict';

angular.module('webapp', [])
.config(function ($routeProvider, $locationProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'views/main.html',
				controller: 'MainCtrl'
			})
			.when('/account', {
				templateUrl: 'views/account.html',
				controller: 'AccountCtrl'
			})
			.otherwise({
				redirectTo: '/'
			});

		$locationProvider.html5Mode(true);
	})
.run(function ($rootScope, $http, $location) {

	//global object representing the user who is logged in
	$rootScope.user = {};

	//as the app spins up, let's check to see if we have an active session with the server
	$http.get('/user')
		.success(function (data) {
			$rootScope.user.username = data.username;
		})
		.error(function (data) {
		});

		//global function for logging out a user
		$rootScope.logout = function () {
			$rootScope.user = {}
			$http.post('user/logout', {});
			$location.path('/');
		}

		$rootScope.loggedInString = function() {
			if ($rootScope.user.username != null) {
				return "Logged in as " + $rootScope.user.username;
			} else {
				return "Login";
			}
		}
});
