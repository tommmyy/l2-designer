var app = require('../app'), contextMenu = require('./contextMenu').contextMenu, selectDir = require('./selectDir').selectDir;

require('./abntreedirective');

var l2DesignerDirectives = angular.module('l2DesignerDirectives', ['angularBootstrapNavTree']);
l2DesignerDirectives.directive('contextMenu', [contextMenu]);
l2DesignerDirectives.directive('selectDir', ['$modal', 'Projects', selectDir]);
exports.l2DesignerDirectives = l2DesignerDirectives;

