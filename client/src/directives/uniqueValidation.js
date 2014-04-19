var app = require('../app').app;

app.directive('uniqueValidation', function (){ 
   return {
      require: 'ngModel',
      link: function(scope, elem, attrs, ngModel) {

          var blacklist = attrs.uniqueValidation;

          //For DOM -> model validation
          ngModel.$parsers.unshift(function(value) {
             var valid = blacklist.indexOf(value) === -1;
             ngModel.$setValidity('blacklist', valid);
             return valid ? value : undefined;
          });

          //For model -> DOM validation
          ngModel.$formatters.unshift(function(value) {
             ngModel.$setValidity('blacklist', blacklist.indexOf(value) === -1);
             return value;
          });
      }
   };
});