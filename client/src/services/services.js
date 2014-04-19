angular = require('angular');

var l2jsDesignerServices = exports.l2jsDesignerServices = angular.module('l2jsDesignerServices', ['ngResource']);

l2jsDesignerServices.factory('UserBubble', [
function() {

	function UserBubble(message, type) {
		this.type = type;
		this.message = message;
	}


	UserBubble.WARNING = 'warning';

	return UserBubble;
}]);
l2jsDesignerServices.factory('Projects', ['$resource',
function($resource) {

	function unpopulateScripts(dirs) {
		
		var map = function(d) {
			return $.map(d, function(o) {
				return o._id;
			});
		};
		if ( typeof dirs._scripts !== 'undefined') {
			dirs._scripts = map(dirs._scripts);
		} else {
			for (var i = 0; i < dirs.length; i++) {
				dirs[i]._scripts = map(dirs[i]._scripts);
			}
		}
	}
	return $resource('/api/projects/:projectId', {
		projectId : "@projectId"
	}, {
		'save' : {
			method : 'POST',
			transformRequest : function(data) {
				unpopulateScripts(data.directories);
				return JSON.stringify(data);
			}
		},
		'update' : {
			method : 'PUT',
			transformRequest : function(data) {
				unpopulateScripts(data.directories);
				return JSON.stringify(data);
			}
		},
		'addDirectory' : {
			method : 'POST',
			url : '/api/projects/:projectId/directories',
			transformRequest : function(data) {
				unpopulateScripts(data);
				return JSON.stringify(data);
			}
		},
		'updateDirectory' : {
			method : 'PUT',
			url : '/api/projects/:projectId/directories/:dirId',
			transformRequest : function(data) {
				unpopulateScripts(data);
				return JSON.stringify(data);
			}
		},
		'deleteDirectory' : {
			method : 'DELETE',
			url : '/api/projects/:projectId/directories/:dirId'
		},
		'addScript' : {
			method : 'POST',
			url : '/api/projects/:projectId/directories/:dirId'
		},
		'deleteScript' : {
			method : 'DELETE',
			url : '/api/projects/:projectId/directories/:dirId'
		}
	});
}]);

l2jsDesignerServices.factory('Scripts', ['$resource',
function($resource) {
	return $resource('/api/scripts/:scriptId', {
		scriptId : "@scriptId"
	}, {
		'update' : {
			method : 'PUT'
		}
	});
}]);
