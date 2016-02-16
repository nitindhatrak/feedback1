angular.module('feedbackService', [])


.factory('Feedback', function($http) {


	var feedbackFactory = {};

	feedbackFactory.allFeedbacks = function() {
		return $http.get('/api/all_feedbacks');
	}

	feedbackFactory.all = function(user) {
		console.log('user ', user)
		return $http.get('/api/?userId='+user.username);
	}

	feedbackFactory.create = function(feedbackData, user, createdBy) {
		feedbackData.createdFor = user;
		feedbackData.createdBy = createdBy;
		return $http.post('/api/', feedbackData);
	}

	return feedbackFactory;


})

.factory('socketio', function($rootScope) {

	var socket = io.connect();
	return {

		on: function(eventName, callback) {
			socket.on(eventName, function() {
				var args = arguments;
				$rootScope.$apply(function() {
					callback.apply(socket, args);
				});
			});
		},

		emit: function(eventName, data, callback) {
			socket.emit(eventName, data, function() {
				var args = arguments;
				$rootScope.apply(function() {
					if(callback) {
						callback.apply(socket, args);
					}
				});
			});
		}

	};

});