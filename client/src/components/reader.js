import * as ngSanitize from 'angular-sanitize';

class ReaderController {
    constructor() {}
}

const ReaderComponent = {
    bindings: {
        pages: '='
    },
    controller: ReaderController,
    template: `
        <div id="reader">
            <div ng-repeat="page in $ctrl.pages" id="{{ page.page_id }}" class="page-container">
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