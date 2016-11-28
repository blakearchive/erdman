import * as ngSanitize from 'angular-sanitize';

class ReaderController {
    constructor() {}
}

const ReaderComponent = {
    bindings: {
        pages: '=',
        openNote: '&',
        highlight: '@'
    },
    controller: ReaderController,
    template: `
        <div id="reader">
            <div ng-repeat="page in $ctrl.pages" id="{{ page.page_id }}" class="page-container">
                <div class="page-id">{{ page.page_id }}</div>
                <div ng-bind-html="page.contents"></div>
            </div>
        </div>
        `
};

const reader = angular
    .module('reader', ['ngSanitize'])
    .component('reader', ReaderComponent)
    .name;

export default reader;