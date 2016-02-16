angular.module('mainCtrl', [])


.controller('MainController', function($rootScope, $location, Auth) {

	var vm = this;

	//vm.userSet = false;
	
	vm.loggedIn = Auth.isLoggedIn();
	$rootScope.$on('$routeChangeStart', function() {

		vm.loggedIn = Auth.isLoggedIn();
		Auth.getUser()
			.then(function(data) {
				$rootScope.user = data.data;
				console.log("$rootScope.user ", $rootScope.user);
				vm.user = data.data;
				//vm.userSet = true;
			});

		
	});

	vm.addFeedback = function(event, item){
		console.log("event ", item);
		vm.currentFeedback = item;
	}


	vm.doLogin = function() {

		vm.processing = true;
		vm.error = '';
		Auth.login(vm.loginData.username, vm.loginData.password)
			.success(function(data) {
				vm.processing = false;
				Auth.getUser()
					.then(function(data) {
						vm.user = data.data;
						$rootScope.user = vm.user;
						$rootScope.$broadcast("logInChange");
					});

				if(data.success)
					$location.path('/');
				else
					vm.error = data.message;

			});
	}


	vm.doLogout = function() {
		Auth.logout();
		$location.path('/logout');
	}


});