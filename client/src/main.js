var angular = require('angular'),
    app = require('./app').app;


require('./directives/directives');
require('./services/services');
require('./controllers/controllers');

app.config(['$routeProvider', '$httpProvider', '$locationProvider',
    function($routeProvider, $httpProvider, $locationProvider) {

        $routeProvider
            .when('/projects', {
                templateUrl: '/templates/projects.html',
                controller: 'ProjectsController'
            })
            .when('/projects/:projectId', {
                templateUrl: '/templates/editor.html',
                controller: 'EditorController'
            })
            .when('/projects/:projectId/scripts/:scriptId/:mode', {
                templateUrl: '/templates/editor.html',
                controller: 'EditorController'
            })
            .otherwise({
                redirectTo: '/projects'
            });

        $locationProvider.html5Mode(true);

    }
]);

angular.bootstrap(document, ['l2Designer']);
