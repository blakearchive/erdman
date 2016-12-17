class TocController {
    constructor($rootScope) {
        this.sortItems();
        this.scope = $rootScope;
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

    expand(key){
        this.scope.$broadcast('expand',{'key':this.removeDots(key)})
    }

    removeDots(key){
        return key.replace(/\./g,'-');
    }
}

const TocComponent = {
    bindings: {
        items: '<'
    },
    controller: TocController,
    template: `
        <ul class="nav nav-sidebar">
          <li ng-repeat="item in $ctrl.items track by $index" du-scrollspy="{{item.key}}" ng-class="{'expandible': item.children.length}" class="toc-item" id="toc-{{ $ctrl.removeDots(item.key) }}">
            <a href="#{{item.key}}" du-smooth-scroll class="toc-a" ng-click="$ctrl.expand(item.key)">
                <div class="row">
                    <div class="toc-icon">
                        <span class="glyphicon glyphicon-chevron-right" ng-if="item.children.length"></span>
                    </div>
                    <div class="toc-title" ng-class="{'no-children': !item.children.length}">{{ item.title }}</div>
                </div>
            </a>
            <div class="toc-level">
                <toc ng-if="item.children.length" items="item.children" on-get-page="$ctrl.handleGetPage(heading)" current-page="$ctrl.currentPage"></toc>
            </div>
          </li>
        </ul>
    `
};

const toc = angular
    .module('toc', ['ngSanitize','duScroll'])
    .component('toc', TocComponent)
    .name;

export default toc;