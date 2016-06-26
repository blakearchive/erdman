var template = require('ngtemplate?requireAngular!html!./templates/table-of-contents.html');

angular.module("Erdman").directive('tableOfContents', function () {
    return {
        restrict: 'E',
        templateUrl: template
    }
});