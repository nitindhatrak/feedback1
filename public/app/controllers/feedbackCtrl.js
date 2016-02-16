angular.module('feedbackCtrl', ['feedbackService', 'userService'])


	.controller('FeedbackController', function($rootScope,Feedback, socketio, Auth, User) {


		var vm = this;

		$rootScope.$on("logInChange", function($event){
			console.log("dsjkfksdfksdjflidsjflksdjfklsdjflksdjkfjsdlkjflksdjflksdjflksdjflksdjflksdjlfkjsdlkjflksd");
			Feedback.all($rootScope.user)
			.success(function(data) {
				console.log("data ", data)
				vm.feedbacks = data;
			});
		})

		Feedback.all($rootScope.user)
		.success(function(data) {
			console.log("data ", data)
			vm.feedbacks = data;
		});

		User.all()
			.success(function(data){
				vm.allUsers = data
				console.log('data ', data)
			})

		vm.createFeedback = function() {
			vm.processing = true;
			vm.message = '';
			var ele = document.getElementById('anonymous');
			var username;
			if(ele.checked){
				username = 'Anonymous';
			}
			else{
				username = $rootScope.user.username;
			}
			Feedback.create(vm.feedbackData, vm.currentFeedback.username, username)
				.success(function(data) {
					vm.processing = false;
					vm.feedbackData = {};
					vm.message = data.message;
					alert('feedback created successfully');
				});
		};

		vm.addFeedback = function(event, item){
			console.log("event ", item);
			vm.currentFeedback = item;
		}

		vm.getAllUsersForFeedback = function(){
			Auth.getAllUsers()
			.then(function(data) {
				vm.allUsers = data.data;
				console.log("users ", vm.allUsers);
			});
		}

		socketio.on('feedback', function(data) {
			console.log("data is ", data)
			if($rootScope.user.username !== data.createdBy){
				if($rootScope.user.username === data.createdFor)
					vm.feedbacks.push(data);
			}
		})

		//vm.getAllUsersForFeedback();

})

.controller('AllFeedbacksController', function(feedbacks, socketio) {

	var vm = this;

	vm.feedbacks = feedbacks.data;

	socketio.on('feedback', function(data) {
		vm.feedbacks.push(data);
	});



});