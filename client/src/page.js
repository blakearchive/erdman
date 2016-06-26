var template = require('ngtemplate?requireAngular!html!./templates/page.html');

angular.module("Erdman").directive('page', function () {
    return {
        restrict: 'E',
        templateUrl: template
    }
});