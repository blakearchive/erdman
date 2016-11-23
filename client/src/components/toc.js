class TocController {
    constructor() {
        this.sortItems();
        this.getPageRange();
    }

    $onChanges(changes){
        if(changes.currentPage){
            this.activateItem();
        }
    }

    activateItem(){
        for (const k of this.items){
            if (k.page == this.currentPage) {
                k.active = true;
                k.showChildren = true;
            } else if(k.children.length && k.childPages.includes(this.currentPage)){
                k.active = false;
                k.showChildren = true;
            } else {
                k.active = false;
                k.showChildren = false;
            }

        }
    }

    getPageRange(){
        for (const k of this.items){
            if(k.children){
                k.childPages = this.getChildrenPages(k.children);
            }
        }
    }

    getChildrenPages(children){
        //console.log(children);
        var pages = children.map(function(a) {return a.page;});
        var additionalChildren = children.filter(function(a) {return a.children.length > 0});
        if(additionalChildren.length){
            for (const c of additionalChildren){
                pages.concat(this.getChildrenPages(c.children));
            }
        }
        return pages;
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
        onGetPage: '&',
        currentPage: '<',
        deactivateParents: '&'
    },
    controller: TocController,
    template: `
        <ul class="nav nav-sidebar">
          <li ng-repeat="item in $ctrl.items track by $index" ng-class="{'expanded': item.showChildren && item.children.length, 'active': item.active }" data-key="{{ item.key }}" data-page="{{ item.page }}">
            <a href="#" ng-click="item.showChildren = !item.showChildren; $ctrl.handleGetPage(item.key)">
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
    .module('toc', ['ngSanitize'])
    .component('toc', TocComponent)
    .name;

export default toc;