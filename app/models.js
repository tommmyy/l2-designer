var mongoose = require('mongoose'), Schema = mongoose.Schema, ObjectId = Schema.ObjectId;
var Counter, User, Directory, Script, Project;

Counter = new mongoose.Schema({
	_id : String,
	next : {
		type : Number,
		'default' : 1
	}
});

Counter.statics.increment = function(counter, callback) {
	return this.findByIdAndUpdate(counter, {
		$inc : {
			next : 1
		}
	}, {
		'new' : true,
		upsert : true,
		select : {
			next : 1
		}
	}, callback);
};

Script = new Schema({
	_id : Number,
	name : String,
	code : String
});

User = new Schema({
	_id : Number,
	username : String,
	password : String
});

Project = new Schema({
	_id : Number,
	name : String,
	directories : [Directory],
	_user : {
		type : Number,
		ref : 'User'
	}
});

function removeScriptsFromDirectories(dirs) {
	for (var i = 0; i < dirs.length; i++) {
		var scripts = dirs[i]._scripts;

		if (scripts) {
			for (var j = 0; j < scripts.length; j++) {
				var script = scripts[j];
				
				this.model('Script').find({
					_id : script,
				}, function(err, scripts) {
					if (!err) {
						scripts[0].remove();
					} 
				});
			}
		}

		if (dirs[i].directories) {
			removeScriptsFromDirectories.call(this, dirs[i].directories);
		}
	}
}

Project.pre('remove', function(next) {
	removeScriptsFromDirectories.call(this, this.directories);
	next();
});


Directory = new Schema({
	_id : Number,
	name : String,
	_scripts : [{
		type : Number,
		ref : 'Script'
	}]

});
Directory.pre('remove', function(next) {
	removeScriptsFromDirectories.call(this, [this]);
	next();
});



module.exports = {
	Counter : mongoose.model('Counter', Counter),
	User : mongoose.model('User', User),
	Script : mongoose.model('Script', Script),
	Directory : mongoose.model('Directory', Directory),
	Project : mongoose.model('Project', Project)
};
