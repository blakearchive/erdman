//import * as ngSanitize from 'angular-sanitize';

class SearchResultsController {
    constructor($sce) {
        this.$sce = $sce;
    }

    handleGoToPage(pageId){
        this.goToPage({pageId: pageId});
    }

    scrubLineNumbers(result){
        return result.replace(/\d/gi,' ');
    }

    noResults(){
        return angular.equals(this.results,{});
    }
/*
    safe(string){
        return this.$sce.trustAsHtml(string);
    }
*/
}

const SearchResultsComponent = {
    bindings: {
        results: '<',
        goToPage: '&',
        closeSearchResults: '&',
        query: '@'
    },
    controller: SearchResultsController,
    template: `
            <div class="no-results" ng-if="$ctrl.noResults()">
                <h2>No results found for <em>{{ $ctrl.query }}</em></h2>
            </div>
            <div ng-repeat="(id,heading) in $ctrl.results track by $index" class="result-group">
                <span class="result-heading">{{heading.heading.heading}}</span>
                <ul class="list-unstyled" ng-repeat="result in heading.results track by $index">
                    <li ng-repeat="preview in result.preview track by $index" style="margin-left: 20px; padding: 3px 0;">
                        <span class="preview" ng-bind-html="$ctrl.scrubLineNumbers(preview)"></span>
                        <a href="#{{ result.page_id }}" ng-click="$ctrl.closeSearchResults()">(...Page {{ result.page_id }})</a>
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