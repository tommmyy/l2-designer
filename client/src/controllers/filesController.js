exports.FilesController = function($scope, $location, $routeParams) {

	$scope.menuController = {
		before : function(e, context) {
			$scope.selected = null;
			var $elItem = $(e.target).closest("a[data-item-id]");
			if($elItem.length) {
				$scope.selected = {
					id: $elItem.data('itemId'),
					type: $elItem.data('itemType')
				};
			}
			return true;

		}
	};

	$scope.$watch('project', function(value) {
		if (value) {
			toTree();
		}
	}, true);

	function toTree() {
		$scope.treeFiles = [];
		var directories = $scope.project.directories;
		var alphSort = function(a, b) {
			if (a.name < b.name) {
				return -1;
			}
			if (a.name > b.name) {
				return 1;
			}
			return 0;
		};

		for (var i = 0; i < directories.length; i++) {
			var dir = {
				label : directories[i].name,
				data : {
					id : directories[i]._id,
					type : 'dir'
				}
			};

			if (directories[i]._scripts) {
				dir.children = [];
				var scripts = directories[i]._scripts;

				scripts.sort(alphSort);
				for (var j = 0; j < scripts.length; j++) {
					dir.children.push({
						label : scripts[j].name,
						onSelect : scriptClick,
						data : {
							id : scripts[j]._id,
							type : 'script'
						}
					});
				}
			}

			$scope.treeFiles.push(dir);
		}
	}

	function scriptClick(branch) {
		$scope.redirectToScript(branch.data.id );
	}

};
