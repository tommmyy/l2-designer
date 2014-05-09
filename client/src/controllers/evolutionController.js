exports.EvolutionController = function($scope, $modalInstance, parentScope, script, Projects) {

	$scope.project = parentScope.project;
	var parent = parentScope;
	var evolver;
	$scope.mode = "code";
	$scope.ev = {
		scripts : [],
		lsystems : ""
	};
	
	$scope.options = {
		numberOfIndividuals : 10,
		lsystems : [], // L-systems names to evolve within individual, default is main call
		opProbabilities : {
			expressionsVariationMutation : 0.5,
			expressionsCreationMutation : 0.5,
			rulesCrossover : 0.8,
			rulesCrossoverAsNewRule : 1,
			rulesSymbolEpressionMutation : 0.5,
			rulesStringMutation : 1,
			rulesMutationAsNewRule : 1
			//			,stringsPermutation : 0.1
		},
		colorMutation : {
			h : [60, 180, 30, 0], // degrees
			hVariation : 10, // percents
			sVariation : 5,
			vVariation : 5,
			rVariation : 5,
			gVariation : 5,
			bVariation : 5,
			aVariation : 5
		},
		numberMutation : {
			variation : 10 // in percent
		},
		selection: {
			elitism: 3
		},
		newRuleProbabilityFactor : 2,
		evolveLScriptExpressions : true,
		maxLevelForRandomExpressions : 3,
		maxExpressionLevel : 4,
		stringMutation : {
			blackList : ["PU", "PS"]
		}
	};

	$scope.runIndividual = function() {
		var i = $scope.ev.scriptIndex - 1;
		if ($scope.population[i]) {
			$scope.canvas = "interpretation-canvas-" + i;
			$scope.$broadcast("run_script_ast", $scope.population[i].ast);
		}
	};

	$scope.nextGeneration = function() {
		
		$('#evolution-content .kineticjs-content').remove();
		evolver.setOptions($scope.options);
		evolver.nextGeneration();
		$scope.population = evolver.getPopulation();
		$scope.ev.scripts = [];
		$scope.ev.scriptIndex = 1;

		var compiler = new l2js.compiler.Compiler();
		for (var i = 0; i < $scope.population.length; i++) {
			$scope.ev.scripts.push(compiler.ASTToL2($scope.population[i].ast));
		}
	};

	$scope.changeMode = function(mode) {
		$scope.mode = mode;
	};

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};
	$scope.done = function() {
		$modalInstance.close();
	};

	$scope.$watch("ev.lsystems", function(val) {
		$scope.options.lsystems = $.map(val.split(","), $.trim);
	});
	
	$scope.$watch("ev.hDegrees", function(val) {
		if(val) {
			$scope.options.colorMutation.h = $.map(val.split(","), _trimInt);
		}
		
		
	});
	function _trimInt(val) {
		return parseInt($.trim(val));	
	}

	function _init() {
		$scope.ev.hDegrees = $scope.options.colorMutation.h.join(",");
		var compiler = new l2js.compiler.Compiler(), asts = [];
		var ast = compiler.toAST(script.code);
		asts.push({
			evaluation : 0,
			ast : ast
		});

		evolver = new l2js.evolver.Evolver(asts, $scope.options);
		$scope.population = evolver.getPopulation();
		$scope.ev.scriptIndex = 1;
		$scope.ev.scripts = [script.code];
	}

	_init();

};
