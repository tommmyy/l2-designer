exports.AppController = function($scope, $timeout) {
	$scope.ui = {};

	$scope.$on('user_bubble', function(e, bubble) {
		$scope.ui.message = bubble.message;
		$timeout(function(){
			$scope.ui.message = '';
		}, 10000);
	});
};
