//var l2js = require("l2js");
exports.InterpretationController = function($scope, UserBubble, Env) {
	var width = 1024, height = 768;

	$scope.interpretationSettings = {
		x : width / 2,
		y : height / 2,
		width : width,
		height : height,
		orientation : -90,
		symbolsPerFrame : 5,
		background : '#ffffff'
	};

	$scope.$watch('interpretationSettings.width', function(val) {
		$scope.interpretationSettings.x = parseInt(val) / 2;
	});

	$scope.$watch('interpretationSettings.height', function(val) {
		$scope.interpretationSettings.y = parseInt(val) / 2;
	});

	$scope.interpretation = {};

	$scope.$on("run_script", function(e, code) {
		$scope.run(code);
	});
	
	$scope.$on("run_script_ast", function(e, ast) {
		if ($scope.interpretation.compiling || $scope.interpretation.derivating) {
			return;
		}
		$scope.changeMode('interpretation');
		$scope.interpretation.compiling = true;
		
		compiled(new l2js.compiler.Compiler().ASTToJS(ast));
	});

	$scope.run = function(code) {
		if ($scope.interpretation.compiling || $scope.interpretation.derivating) {
			return;
		}
		$scope.changeMode('interpretation');
		$scope.interpretation.compiling = true;
		l2js.compile(code).then(compiled, errorHandler);

	};

	function compiled(js) {
		$scope.interpretation.compiling = false;
		$scope.interpretation.derivating = true;
		Env.derive({}, {
			code : js
		}).$promise.then(function(resource) {
			$scope.interpretation.derivating = false;
			if (resource.result.error) {
				errorHandler(resource.result.error);
			}

			l2js.interpretAll(resource.result, {
				container : $scope.canvas || "interpretation-canvas",
				width : $scope.interpretationSettings.width,
				height : $scope.interpretationSettings.height,
				symbolsPerFrame : $scope.interpretationSettings.symbolsPerFrame,
				bgColor : $scope.interpretationSettings.background,
				turtle : {
					initPosition : [$scope.interpretationSettings.x, $scope.interpretationSettings.y],
					initOrientation : $scope.interpretationSettings.orientation
				}
			});
		}, errorHandler);
	}

	function errorHandler(err) {
		$scope.$emit('user_bubble', new UserBubble(err));
	}

};
