exports.DirController = function($scope, $modalInstance, parentScope, Projects) {

    $scope.project = parentScope.project;
    var parent = parentScope;
    $scope.selected = {
        newDirectory: ''
    };


    $scope.addDirectory = function() {
        var dir = $scope.selected.newDirectory.trim();
        if (!dir) {
            return;
        }

        Projects.addDirectory({
            projectId: $scope.project._id
        }, {
            name: dir,
            _scripts: []
        }).$promise.then(function(res) {
            $scope.project = res;
            parentScope.project = res;
        });


        $scope.selected.newDirectory = '';
    };
    $scope.select = function(dir) {
        $modalInstance.close(dir);
    };

    $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
    };
    $scope.done = function() {
        $modalInstance.close();
    };
};
