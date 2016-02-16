angular.module('MyApp', ['appRoutes', 'mainCtrl', 'authService', 'userCtrl', 'userService', 'feedbackService', 
	'feedbackCtrl', 'reverseDirective'])

.config(function($httpProvider) {

	$httpProvider.interceptors.push('AuthInterceptor');


})