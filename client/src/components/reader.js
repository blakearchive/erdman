class ReaderController {
    constructor() {
    }
}

const ReaderComponent = {
    bindings: {
        pages: '<'
    },
    controller: ReaderController,
    template: `
        <div id="reader">
            <div ng-repeat="page in $ctrl.pages">
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