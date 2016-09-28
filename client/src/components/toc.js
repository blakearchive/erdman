class TocController {
    constructor() {
        this.sortItems();
    }

    sortItems() {
        // Sort the items
        this.items.sort((a, b) => {

            const aNorm = this.normalizeKey(a.key);
            const bNorm = this.normalizeKey(b.key);

            if (aNorm < bNorm) {
                return -1;
            }
            if (aNorm > bNorm) {
                return 1;
            }
            return 0;
        });
    }

    normalizeKey(key) {
        const parts = key.split('.');
        const normalized = [];
        for (const part of parts) {
            if(isNaN(part)){
                const alpha = part.substr(0,1);
                let num = part.substr(1);
                num = num.length == 1 ? '0' + num : num;
                normalized.push(alpha + num);
            } else {
                const num = part.length == 1 ? '0' + part : part;
                normalized.push(num);
            }
        }

        return normalized.join('.');
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
          <li ng-repeat="item in $ctrl.items track by $index" ng-class="{'toc-level-open': item.showChildren }" data-key="{{ item.key }}">
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