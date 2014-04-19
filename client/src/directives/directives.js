var app = require('../app'), contextMenu = require('./contextMenu').contextMenu;

require('./abntreedirective');

var l2jsDesignerDirectives = angular.module('l2jsDesignerDirectives', ['angularBootstrapNavTree']);
l2jsDesignerDirectives.directive('contextMenu', [contextMenu]);
exports.l2jsDesignerDirectives = l2jsDesignerDirectives;

