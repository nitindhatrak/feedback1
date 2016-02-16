angular.module('appRoutes', ['ngRoute'])


.config(function($routeProvider, $locationProvider) {

	$routeProvider

		.when('/', {
			templateUrl: 'app/views/pages/home.html',
			controller: 'MainController',
			controllerAs: 'main'
		})
		.when('/login', {
			templateUrl: 'app/views/pages/login.html'
		})
		.when('/signup', {
			templateUrl: 'app/views/pages/signup.html'
		})

		.when('/allFeedbacks', {
			templateUrl: 'app/views/pages/allFeedbacks.html',
			controller: 'AllFeedbacksController',
			controllerAs: 'feedback',
			resolve: {
				feedbacks: function(feedback) {
					return Feedback.allFeedbacks();
				}
			}

		})

	$locationProvider.html5Mode(true);

})