exports.AppController = function($scope) {
	$scope.$on('user_bubble', function(e, bubble) {
		alert(bubble.message);
		
		
	});
};
