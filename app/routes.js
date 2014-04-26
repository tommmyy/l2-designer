var home = require('../controllers/home'),
    projects = require('../controllers/projects'), 
    scripts = require('../controllers/scripts'),
    env = require('../controllers/env');

module.exports.initialize = function(app) {
    app.get('/', home.index);
    app.get('/projects', home.index);
    app.get('/projects/:id', home.index);
    app.get('/projects/:id/scripts/:scriptId', home.index);
    app.get('/projects/:id/scripts/:scriptId/:mode', home.index);
    
    app.post('/env/derive', env.derive);
    
    app.get('/api/projects', projects.index);
    app.get('/api/projects/:id', projects.getById);
    app.post('/api/projects', projects.add);
    app.put('/api/projects/:id', projects.update);
    app['delete']('/api/projects/:id', projects['delete']);
    
    app.post('/api/projects/:id/directories', projects.addDirectory);
    app.put('/api/projects/:id/directories/:dirId', projects.updateDirectory);
    app['delete']('/api/projects/:id/directories/:dirId', projects.deleteDirectory);
    
    app.get('/api/scripts', scripts.index);
    app.get('/api/scripts/:id', scripts.getById);
    app.post('/api/scripts', scripts.add);
    app.put('/api/scripts/:id', scripts.update);
    app['delete']('/api/scripts/:id', scripts['delete']);
};
