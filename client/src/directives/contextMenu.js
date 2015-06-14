exports.contextMenu = function() {
    return {
        restrict: 'A',
        scope: {
            project: '=',
            controller: '=contextMenuController'
        },
        link: function(scope, element, attrs) {
            if (!attrs.contextMenu) {
                return;
            }

            $(element).contextmenu({
                target: '#' + attrs.contextMenu,
                before: function(e, context) {
                    scope.$apply(function() {
                        if (scope.controller.before) {
                            return scope.controller.before(e, context);
                        }
                    });

                    return true;
                },
                onItem: function(context, e) {
                    if (scope.controller.onItem) {
                        scope.$apply(function() {
                            scope.controller.onItem(e, context);
                        });

                    }
                }
            });

        }
    };
};
