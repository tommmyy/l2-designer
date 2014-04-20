var app = require('../app'), contextMenu = require('./contextMenu').contextMenu, selectDir = require('./selectDir').selectDir;

require('./abntreedirective');

var l2jsDesignerDirectives = angular.module('l2jsDesignerDirectives', ['angularBootstrapNavTree']);
l2jsDesignerDirectives.directive('contextMenu', [contextMenu]);
l2jsDesignerDirectives.directive('selectDir', ['$modal', 'Projects', selectDir]);
exports.l2jsDesignerDirectives = l2jsDesignerDirectives;

