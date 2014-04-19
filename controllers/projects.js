var models = require('../app/models');

function populateScripts(project, res) {

	models.Script.populate(project, {
		path : 'directories._scripts'
	}, function(err, project) {
		if (err) {
			res.json({
				error : 'Project not found.'
			});
			return;
		}
		res.json(project);
	});

}

module.exports = {
	index : function(req, res) {
		models.Project.find({}, function(err, data) {
			res.json(data);
		});
	},
	// TODO:  dir hiearchy
	getById : function(req, res) {
		models.Project.findOne({
			_id : req.params.id
		}).exec(function(err, project) {

			if (!project) {
				res.statusCode = 404;
				return res.send('Error 404: No project found');
			}

			if (err) {
				res.json({
					error : 'Project cannot be retrieved.'
				});
			} else {

				populateScripts(project, res);
			}

		});
	},
	add : function(req, res) {
		models.Counter.increment('Project', function(err, result) {
			if (err) {
				console.error('Counter on Project save error: ' + err);
				return;
			}

			var newProject = new models.Project(req.body);
			newProject._id = result.next;

			//TODO: Users
			newProject._user = 0;

			newProject.save(function(err, project) {
				if (err) {
					res.json({
						error : 'Error adding Project.'
					});
				} else {
					res.json(project);
				}
			});
		});

	},
	update : function(req, res) {

		console.log("Updating project " + req.params.id);

		models.Project.findById(Number(req.params.id), {

		}, function(err, project) {
			if (err) {
				res.json({
					error : 'Project not found.'
				});
			} else {

				project.name = req.body.name;
				project._user = req.body._user;
				project.directories = req.body.directories;
				project.markModified('directories');

				project.save(function(err, updatedProject) {
					if (err) {
						res.json({
							error : 'Project not found.'
						});
					} else {
						populateScripts(updatedProject, res);
					}
				});

			}
		});

	},
	'delete' : function(req, res) {
		models.Project.findOne({
			_id : req.params.id
		}, function(err, project) {
			if (err) {
				res.json({
					error : 'Project not found.'
				});
			} else {
				project.remove(function(err) {
					res.json(200, {
						status : 'Success'
					});
				});
			}
		});
	},

	'addDirectory' : function(req, res) {
		console.log("Adding directory to project " + req.params.id);

		models.Counter.increment('Directory', function(err, result) {
			if (err) {
				console.error('Counter on Directory save error: ' + err);
				return;
			}

			models.Project.findByIdAndUpdate(req.params.id, {
				$push : {
					'directories' : {
						name : req.body.name,
						_id : result.next,
						_scripts : req.body._scripts || []
					}
				}
			}, function(err, updated) {
				if (err) {
					res.json({
						error : 'Project not found.'
					});
				} else {
					populateScripts(updated, res);
				}
			});
		});
	},
	'updateDirectory' : function(req, res) {
		console.log("Updating directory " + req.params.dirId + " in project " + req.params.id);

		models.Project.update({
			'_id' : Number(req.params.id),
			'directories._id' : Number(req.params.dirId)
		}, {
			$set : {
				'directories.$.name' : req.body.name,
				'directories.$._scripts' : req.body._scripts || []
			}
		}, function(err, numberAffected, updated) {
			if (err) {
				res.json({
					error : 'Project not found.'
				});
			} else {
				populateScripts(updated, res);
			}
		});

	},
	'deleteDirectory' : function(req, res) {
		console.log("Updating directory " + req.params.dirId + " in project " + req.params.id);

		models.Project.findOne({
			'_id' : Number(req.params.id)

		}, function(err, project) {
			if (err) {
				res.json({
					error : 'Project not found.'
				});
				return;
			}

			var dir;
			for (var i = 0; i < project.directories.length && !dir; i++) {
				if (project.directories[i]._id === Number(req.params.dirId)) {
					dir = project.directories.splice(i, 1)[0];
				}
			}
			if (!dir) {
				res.json(project);
				return;
			}

			project.markModified('directories');

			models.Script.remove({
				'_id' : {
					"$in" : dir._scripts
				}
			}, scriptsRemoved);

			function scriptsRemoved(err) {
				if (err) {
					res.json({
						error : 'Project not found.'
					});
					return;
				}

				project.save(projectSaved);
			}

			function projectSaved(err) {
				if (err) {
					errorHandler(err);
					return;
				}
				populateScripts(project, res);
			}

		});

	}
};
