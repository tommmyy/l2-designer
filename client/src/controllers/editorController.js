var DirController = require('./dirController').DirController;
exports.EditorController = function($scope, $routeParams, $location, $modal, Projects, Scripts, UserBubble) {
	var DEFAULT_MODE = 'code', origDir;
	$scope.formdata = {};
	$scope.mode = $routeParams.mode || DEFAULT_MODE;

	$scope.$on('project_updated', function(e, project) {
		$scope.project = project;
	});

	$scope.createScript = function() {
		redirectToProject();
	};
	$scope.openScript = function(id) {
		redirectToScript(id);
	};

	$scope.deleteScript = function(id) {
		console.log("delete script: " + id);

		Scripts['delete']({
			scriptId : id
		}, $scope.formdata.script).$promise.then(function(res) {
			if (res.error) {
				errorHandler(script.error);
			} else {
				var script = {
					_id : id
				}, project = angular.copy($scope.project), dir = findDirByScript(project, script);

				deleteScriptFromDir(findDir(project, dir), script);

				updateProject(project, function() {
					$scope.$emit('user_bubble', new UserBubble("Script deleted."));
					if (Number($routeParams.scriptId) === id) {
						redirectToProject();
					}
				});

			}
		}, errorHandler);

	};

	$scope.deleteDir = function(id) {
		console.log("delete dir: " + id);
		var scripts = findDir({
			_id : id
		})._scripts;
		Projects.deleteDirectory({
			projectId : $scope.project._id,
			dirId : id
		}).$promise.then(function(res) {
			$scope.project = res;

			if (scripts && scripts.length) {
				var scriptsId = $.map(scripts, function(o) {
					return o._id;
				});

				if ($.inArray($routeParams.scriptsId, scriptsId)) {
					redirectToProject();
				}

			}

		}, errorHandler);

	};

	$scope.createDir = function() {
		console.log("create dir");
		var modalInstance = $modal.open({
			templateUrl : '/templates/createDirModal.html',
			controller : DirController,
			resolve : {
				Projects : function() {
					return Projects;
				},
				parentScope : function() {
					return $scope;
				}
			}
		});
	};

	/**
	 * Saves or updates script in $scope.formdata.script
	 */
	$scope.saveScript = function() {
		$scope.errors = {};

		if (!$scope.formdata.dir) {
			$scope.errors.dir = $scope.errors.dir || {};
			$scope.errors.dir.missing = true;

			return;
		}

		if ($scope.formdata.script._id) {
			Scripts.update({
				scriptId : $scope.formdata.script._id
			}, $scope.formdata.script).$promise.then(function(script) {
				if (script.error) {
					errorHandler(script.error);
				} else {
					var project = angular.copy($scope.project);
					if (origDir && origDir._id !== $scope.formdata.dir._id) {
						deleteScriptFromDir(findDir(project, origDir), script);
						findDir(project, $scope.formdata.dir)._scripts.push(script);
					}

					updateProject(project, function() {
						origDir = $scope.formdata.dir;
						$scope.$emit('user_bubble', new UserBubble("Script updated."));
					});
				}
			}, errorHandler);

		} else {
			Scripts.save($scope.formdata.script).$promise.then(function(script) {
				if (script.error) {
					errorHandler(script.error);
				} else {
					var dir = angular.copy($scope.formdata.dir);
					dir._scripts.push(script);
					Projects.updateDirectory({
						projectId : $scope.project._id,
						dirId : $scope.formdata.dir._id
					}, dir).$promise.then(function() {
						$scope.$emit('user_bubble', new UserBubble("Script saved."));
						redirectToScript(script._id);
					}, errorHandler);
				}
			}, errorHandler);
		}
	};

	$scope.selectDir = function() {
		var modalInstance = $modal.open({
			templateUrl : '/templates/selectDirModal.html',
			controller : DirController,
			resolve : {
				Projects : function() {
					return Projects;
				},
				parentScope : function() {
					return $scope;
				}
			}
		});

		modalInstance.result.then(function(selectedItem) {
			$scope.formdata.dir = selectedItem;
		}, function() {
			//dissmiss
		});
	};

	var newProject = Projects.get({
		projectId : $routeParams.projectId
	}).$promise.then(function(res) {
		if (res.error) {
			errorHandler(res.error);
			return;
		}

		$scope.project = res;
		if ($routeParams.scriptId) {
			$scope.formdata.script = Scripts.get({
				scriptId : $routeParams.scriptId
			}).$promise.then(function(script) {
				if (script.error) {
					errorHandler(script.error);
					return;
				}

				var dir = findDirByScript($scope.project, script);
				$scope.formdata.script = script;
				$scope.formdata.dir = dir;
				origDir = dir;
			}, function(err) {
				redirectToProject();
			});

		} else {
			$scope.formdata.script = {
				name : '',
				code : ''
			};
		}
	}, function(err) {
		$location.path('/projects');
	});

	function updateProject(project, success) {
		Projects.update({
			projectId : $scope.project._id
		}, project).$promise.then(function(project) {
			if (project.error) {
				errorHandler(project.error);
			} else {
				$scope.project = project;
				success();

			}
		}, errorHandler);
	}

	function redirectToProject() {
		$location.path("/projects/" + $scope.project._id);
	}

	function redirectToScript(id) {
		$location.path('/projects/' + $scope.project._id + "/scripts/" + id + "/code");
	}

	function errorHandler(err) {
		$scope.$emit("user_bubble", new UserBubble(err, UserBubble.WARNING));
	}

	function findDirByScript(project, script) {
		// TODO:  dir hiearchy
		var dirs = project.directories;

		for (var i = 0; i < dirs.length; i++) {
			for (var j = 0; j < dirs[i]._scripts.length; j++) {
				if (dirs[i]._scripts[j]._id === script._id) {
					return dirs[i];

				}
			}
		}
	}

	function findDir(project, dir) {
		var dirs = project.directories;
		for (var i = 0; i < dirs.length; i++) {
			if (dirs[i]._id === dir._id) {
				return dirs[i];
			}
		}
	}

	function deleteScriptFromDir(dir, script) {
		for (var j = 0; j < dir._scripts.length; j++) {
			if (dir._scripts[j]._id === script._id) {
				return dir._scripts.splice(j, 1);
			}
		}
	}

};
