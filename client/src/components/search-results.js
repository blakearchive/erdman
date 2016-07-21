class SearchResultsController {
    constructor() {

    }

    static create() {
        return new SearchResultsController();
    }

}

const SearchResultsComponent = {
    bindings: {
        results: '<'
    },
    controller: SearchResultsController.create,
    template: `
        <div id="searchResults" class="well" ng-if="$ctrl.results.length">
            <div ng-repeat="page in $ctrl.results">
                <div ng-bind-html="page.id"></div>
            </div>
        </div>
        `
};

const searchResults = angular
    .module('searchResults', ['ngSanitize'])
    .component('searchResults', SearchResultsComponent)
    .name;

export default searchResults;