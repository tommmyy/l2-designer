exports.ProjectsController = function($scope, $routeParams, UserBubble, Projects) {
	var projects = $scope.projects = Projects.query();

	$scope.addProject = function() {
		var name = $scope.newProject.trim();
		if (!name.length) {
			return;
		}

		var project = Projects.save({
			name : name,
			directories : []
		}, function() {
			$scope.projects.push(project);
		}, function(err) {
			$scope.$emit('user_bubble', new UserBubble(err, UserBubble.WARNING));
		});

		$scope.newProject = '';
	};

	$scope.removeProject = function(project) {
		
		projects.splice(projects.indexOf(project), 1); 
		project.$remove({projectId: project._id}).catch(function(err){
			$scope.$emit('user_bubble', new UserBubble(err, UserBubble.WARNING));
		});
	};
};
