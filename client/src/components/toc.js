class TocController {
    constructor() {
        this.sortItems();
    }

    sortItems() {
        // Sort the items
        this.items.sort((a, b) => {

            if (a.key < b.key) {
                return -1;
            }
            if (a.key > b.key) {
                return 1;
            }
            return 0;
        });
    }

    handleGetPage($heading) {
        console.log($heading);
        this.onGetPage({heading: $heading});
    }
}

const TocComponent = {
    bindings: {
        items: '<',
        onGetPage: '&'
    },
    controller: TocController,
    template: `
        <ul class="list-unstyled">
          <li ng-repeat="item in $ctrl.items track by $index" ng-class="{'toc-level-open': item.showChildren }">
            <span class="tree-bullet" ng-class="{ 'tree-children': item.children.length }"></span>
            <span class="toc-item">
                <a href="#" ng-click="item.showChildren = !item.showChildren; $ctrl.handleGetPage(item.key)">{{ item.title }}</a>
                <div class="toc-level">
                    <toc ng-if="item.children.length" items="item.children" on-get-page="$ctrl.handleGetPage(heading)"></toc>
                </div>
            </span>
          </li>
        </ul>
    `
};

const toc = angular
    .module('toc', ['ngSanitize'])
    .component('toc', TocComponent)
    .name;

export default toc;