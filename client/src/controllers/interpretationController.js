//var l2js = require("l2js");
exports.InterpretationController = function($scope) {
	$scope.$on("run_script", function(e, code) {
		$scope.run(code);
	});
	
	$scope.run = function(code) {
		$scope.changeMode('interpretation');
		l2js.compile(code).then(compiled, compileError);

	};

	function compiled(js) {
		var derivation = l2js.derive(js);
		//console.log(derivation)
		l2js.interpretAll(derivation, {
			container : "interpretation-canvas",
			width : 800,
			height : 600,
			//turtle: {
			//initPosition: [100, 100],
			//initOrientation: 0
			//}
		});

	}

	function compileError(error) {
		
		console.error(error);
	}

};
