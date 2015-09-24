var l2js = require('l2js');
exports.InterpretationController = function($scope, UserBubble, Env) {
    // var width = 1440, height = 810;

    var width = 880,
        height = 880;
    // a4 72 PPI
    //var width = 595,
    //    height = 842;

    // a4 200 PPI
    //var width = 1654 , height = 2339;

    // a3 200 py
    // var width = 2339,
    //    height = 3308;

    $scope.interpretationSettings = {
        x: Math.round(width / 2),
        y: Math.round(height / 2),
        width: width,
        height: height,
        orientation: -90,
        symbolsPerFrame: 5,
        background: '#ffffff'
    };

    $scope.$watch('interpretationSettings.width', function(val) {
        $scope.interpretationSettings.x = Math.round(parseInt(val) / 2);
    });

    $scope.$watch('interpretationSettings.height', function(val) {
        $scope.interpretationSettings.y = Math.round(parseInt(val) / 2);
    });

    $scope.interpretation = {};

    $scope.$on('run_script', function(e, code) {
        $scope.run(code);
    });

    $scope.$on('run_script_ast', function(e, ast) {
        if ($scope.interpretation.compiling || $scope.interpretation.derivating) {
            return;
        }
        $scope.changeMode('interpretation');
        //$scope.interpretation.compiling = true;

        compiled(new l2js.compiler.Compiler().ASTToJS(ast));
        $scope.interpretation.compiling = false;
    });

    $scope.run = function(code) {
        if ($scope.interpretation.compiling || $scope.interpretation.derivating) {
            return;
        }
        $scope.changeMode('interpretation');
        $scope.interpretation.compiling = true;
        l2js.compile(code).then(compiled, errorHandler);

    };

    function compiledAsync(js) {
        $scope.interpretation.compiling = false;
        $scope.interpretation.derivating = true;
        Env.derive({}, {
            code: js
        }).$promise.then(function(resource) {
            $scope.interpretation.derivating = false;
            if (resource.error) {
                errorHandler(resource.error);
            }
            var result = JSON.parse(resource.result);
            console.log(toString(result.interpretation));
            l2js.interpretAll(result, {
                container: $scope.canvas || 'interpretation-canvas',
                width: $scope.interpretationSettings.width,
                height: $scope.interpretationSettings.height,
                symbolsPerFrame: $scope.interpretationSettings.symbolsPerFrame,
                bgColor: $scope.interpretationSettings.background,
                turtle: {
                    initPosition: [$scope.interpretationSettings.x, $scope.interpretationSettings.y],
                    initOrientation: $scope.interpretationSettings.orientation
                }
            });
        }, errorHandler);
    }

    function compiled(js) {
        $scope.$apply(function() {
            $scope.interpretation.compiling = false;
        })

        var result = l2js.derive(js);

        console.log(toString(result.interpretation));
        l2js.interpretAll(result, {
            container: $scope.canvas || 'interpretation-canvas',
            width: $scope.interpretationSettings.width,
            height: $scope.interpretationSettings.height,
            symbolsPerFrame: $scope.interpretationSettings.symbolsPerFrame,
            bgColor: $scope.interpretationSettings.background,
            turtle: {
                initPosition: [$scope.interpretationSettings.x, $scope.interpretationSettings.y],
                initOrientation: $scope.interpretationSettings.orientation
            }
        });

    }

    function errorHandler(err) {
        $scope.$emit('user_bubble', new UserBubble(err));
    }

    function toString(symbols) {

        var stringSymbols = symbols.map(function(s) {

            if (s.type === 'stack') {
                return '[ ' + toString(s.string) + ' ]';
            } else {
                return s.symbol;
            }

        });

        return stringSymbols.join(' ');
    }

};
