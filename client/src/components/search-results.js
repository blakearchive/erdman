class SearchResultsController {
    constructor() {

    }

    handleGoToPage(pageId){
        this.goToPage({pageId: pageId});
    }

    scrubLineNumbers(result){
        console.log(result);
        const ret = result.replace(/\d/gi,' ');
        return ret;
    }
}

const SearchResultsComponent = {
    bindings: {
        results: '<',
        goToPage: '&',
        closeSearchResults: '&'
    },
    controller: SearchResultsController,
    template: `
            <h2 ng-if="$ctrl.results.keys.length == 0">No results found</h2>
            <div ng-repeat="(id,heading) in $ctrl.results track by $index">
                <h5>{{heading.heading}}</h5>
                <ul class="list-unstyled" ng-repeat="result in heading.results track by $index">
                    <li ng-repeat="preview in result.preview track by $index" style="margin-left: 10px; padding: 3px 0;">
                        <span class="preview" ng-bind-html="$ctrl.scrubLineNumbers(preview)"></span>
                        <a href="#" ng-click="$ctrl.handleGoToPage(result.page_id); $ctrl.closeSearchResults()">(...Page {{ result.page_id }})</a>
                    </li>
                </ul>
            </div>
        `
};

const searchResults = angular
    .module('searchResults', ['ngSanitize'])
    .component('searchResults', SearchResultsComponent)
    .name;

export default searchResults;