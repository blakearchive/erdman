class ReaderController {
    constructor() {
    }

    static create() {
        return new ReaderController();
    }
}

const ReaderComponent = {
    bindings: {
        pages: '='
    },
    controller: ReaderController.create,
    template: `
        <div id="reader">
        <h1>Pages</h1>
            <div ng-repeat="page in $ctrl.pages" class="page">
                {{ page.contents }}
            </div>
        </div>
        `
};

const reader = angular
    .module('reader', [])
    .component('reader', ReaderComponent)
    .name;

export default reader;