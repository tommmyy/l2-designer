exports.NameScriptController = function($scope, $modalInstance, name) {

	$scope.formdata = {
		name : name
	};

	$scope.save = function() {
		$modalInstance.close($scope.formdata.name);
	};

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};

};
