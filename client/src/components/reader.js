import * as ngSanitize from 'angular-sanitize';

class ReaderController {
    constructor($sce) {
        this.$sce = $sce;
    }

    safe(content){
        return this.$sce.trustAsHtml(content);
    }
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
            <div ng-repeat="page in $ctrl.pages" id="{{ page.page_id }}" class="page-container" ng-class="{'hidden': page.contents == ''}">
                <div class="page-id">{{ page.page_id }}</div>
                <div ng-bind-html="$ctrl.safe(page.contents)"></div>
            </div>
        </div>
        `
};

const reader = angular
    .module('reader', ['ngSanitize'])
    .component('reader', ReaderComponent)
    .name;

export default reader;