var DirController = require('../controllers/dirController').DirController;
exports.selectDir = function($modal, Projects) {
	return {
		restrict : 'A',
		require : 'ngModel', 
		link : function(scope, element, attrs, ngModel) {

			element.on('click', function() {
				scope.$apply(selectDir);
			});

			// Write data to the model
			function selectDir() {
				var modalInstance = $modal.open({
					templateUrl : '/templates/selectDirModal.html',
					controller : DirController,
					resolve : {
						Projects : function() {
							return Projects;
						},
						parentScope : function() {
							return scope.$parent;
						}
					}
				});

				modalInstance.result.then(function(selectedItem) {
					ngModel.$setViewValue(selectedItem._id);
				}, function() {
					//dissmiss
				});

			}

		}
	};
};
