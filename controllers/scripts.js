var models = require('../app/models');

module.exports = {
	index : function(req, res) {
		models.Script.find({}, function(err, data) {
			res.json(data);
		});
	},
	getById : function(req, res) {

		models.Script.findOne({
			_id : Number(req.params.id)
		}).exec(function(err, script) {
			if (!script) {
				res.statusCode = 404;
				return res.send('Error 404: No script found');
			}

			if (err) {
				res.json({
					error : 'Script cannot be retrieved.'
				});
			} else {
				res.json(script);
			}
		});
	},
	add : function(req, res) {
		models.Counter.increment('Script', function(err, result) {
			if (err) {
				console.error('Counter on Script save error: ' + err);
				return;
			}

			var newScript = new models.Script(req.body);
			newScript._id = result.next;
			newScript.save(function(err, script) {
				if (err) {
					res.json({
						error : 'Error adding Script.'
					});
				} else {
					res.json(script);
				}
			});
		});

	},
	update : function(req, res) {
		models.Script.findByIdAndUpdate(req.body._id, {
			$set : {
				name : req.body.name,
				code : req.body.code
			}
		}, function(err, updated) {
			if (err) {
				res.json({
					error : 'Script not found.'
				});
			} else {
				res.json(updated);
			}
		});
	},
	'delete' : function(req, res) {
		models.Script.findOne({
			_id : req.params.id
		}, function(err, script) {
			if (err) {
				res.json({
					error : 'Script not found.'
				});

			} else {
				script.remove(function(err) {
					res.json(200, {
						status : 'Success'
					});
				});
			}
		});
	}
};
