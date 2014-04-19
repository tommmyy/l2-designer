var mongoose = require('mongoose'), models = require('./models');


module.exports = {
	check : function() {
		models.User.find({}, function(err, users) {
			if (users.length === 0) {

				console.log('no user found, seeding...');

				seedScript();

				function seedProject(dir) {
					models.Counter.increment('Project', function(err, result) {
						if (err) {
							console.error('Counter on Project save error: ' + err);
							return;
						}

						seedUser(function(user) {
							var newProject = new models.Project({
								_id : result.next,
								_user : user._id,
								name : 'demo',
								directories : [dir]
							});

							console.log(models.Directory);

							newProject.save(function(err, project) {
								console.log('successfully inserted project: ' + project._id);
							});
						});

					});
				}

				function seedUser(success) {
					models.Counter.increment('User', function(err, result) {
						if (err) {
							console.error('Counter on User save error: ' + err);
							return;
						}
						var newUser = new models.User({
							_id : result.next,
							username : 'user'
						});

						newUser.save(function(err, user) {
							console.log('successfully inserted user: ' + user._id);

							success(user);
						});

					});
				}

				function seedDirectory(script) {
					models.Counter.increment('Directory', function(err, result) {
						if (err) {
							console.error('Counter on Directory save error: ' + err);
							return;
						}
						var newDir = new models.Directory({
							_id : result.next,
							name : 'root',
							directories : [],
							_scripts : [script]
						});
						seedProject(newDir);
					});
				}

				function seedScript() {
					models.Counter.increment('Script', function(err, result) {
						if (err) {
							console.error('Counter on Script save error: ' + err);
							return;
						}

						var newScript = new models.Script({
							_id : result.next,
							name : 'script',
							code : 'code'
						});

						newScript.save(function(err, script) {
							console.log('successfully inserted script: ' + script._id);
							seedDirectory(script);
						});

					});

				}

			} else {
				console.log('found ' + users.length + ' existing users!');
			}
		});
	}
};
