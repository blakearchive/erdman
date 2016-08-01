import * as ngSanitize from 'angular-sanitize';

class ReaderController {
    constructor() {
    }
}

const ReaderComponent = {
    bindings: {
        pages: '='
    },
    controller: ReaderController.create,
    template: `
        <div id="reader">
            <div ng-repeat="page in $ctrl.pages">
                <div ng-bind-html="page.contents" class="page"></div>
            </div>
        </div>
        `
};

const reader = angular
    .module('reader', ['ngSanitize'])
    .component('reader', ReaderComponent)
    .name;

export default reader;