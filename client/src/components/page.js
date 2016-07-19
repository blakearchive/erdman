import angular from 'angular';

const template = `
    <div id="erdmanPages">
        <div ng-repeat="page in $ctrl.pages">
            {{ page.contents }}
        </div>
    </div>
`;

class PageController {

}


const page = angular.module("page", []).component('page', {
    bindings: {
        pages: '>'
    },
    template: template,
    controller: PageController
}).name;

export default page;