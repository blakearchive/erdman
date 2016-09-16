class SearchResultsController {
    constructor() {

    }

    renderPreview(preview) {
        preview = preview.replace(/<em>/gi,'[startHighlight]');
        preview = preview.replace(/<\/em>/gi, '[endHighlight]');

        preview = preview.replace(/<(.*?)>/gi,'');
        preview = preview.replace(/<(.*?)$/gi,'');
        preview = preview.replace(/^(.*?)>/gi,'');

        preview = preview.replace(/\[startHighlight\]/gi,'<span class="highlight">');
        preview = preview.replace(/\[endHighlight\]/gi,'</span>');
        return preview;
    }
}

const SearchResultsComponent = {
    bindings: {
        results: '<'
    },
    controller: SearchResultsController,
    template: `
            <div class="container">
                <div class="row">
                    <h2 ng-if="$ctrl.results.length == 0">No results found</h2>
                    <div ng-repeat="result in $ctrl.results">
                        <h5>Page {{result.page_id}}</h5>
                        <span class="preview" ng-repeat="preview in result.preview track by $index" ng-bind-html="$ctrl.renderPreview(preview)"></span>
                    </div>
                </div>
            </div>
        `
};

const searchResults = angular
    .module('searchResults', ['ngSanitize'])
    .component('searchResults', SearchResultsComponent)
    .name;

export default searchResults;