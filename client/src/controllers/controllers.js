var angular = require("angular"), 
	app = require("../app").app, 
	AppController = require("./appController").AppController,
	EditorController = require("./editorController").EditorController,
	FilesController = require("./filesController").FilesController,
	ProjectsController = require("./projectsController").ProjectsController;


app.controller('AppController', ['$scope', AppController]);
app.controller('ProjectsController', ['$scope', '$routeParams', 'UserBubble', 'Projects', ProjectsController]);	
app.controller('FilesController', ['$scope', '$location', '$routeParams', FilesController]);

app.controller('EditorController', ['$scope', '$routeParams', '$location', '$modal', 'Projects', 'Scripts', 'UserBubble', EditorController]);
