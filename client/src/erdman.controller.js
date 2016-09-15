import {ErdmanDataService} from './services';
import {titles} from './data';

class ErdmanController {
    constructor($rootScope, $location, $anchorScroll) {
        this.$rootScope = $rootScope;
        this.$location = $location;
        this.$anchorScroll = $anchorScroll;
        this.pages = [];
        this.results = [];
        this.titles = Object.assign({}, titles);
        this.tocTree = [];
        this.nestTitles();
        this.getPages();
    }

    getPages(){
        ErdmanDataService.getPages().then(response => {
            this.$rootScope.$apply(this.pages = response);
        });
    }

    /*getNextPages(pageId){
        this.getting = true;
        ErdmanDataService.getPageGroup(pageId).then(response => {
            this.$rootScope.$apply(this.pages = this.pages.concat(response));
            this.lastPage = response[response.length - 1].id;
            console.log(this.lastPage);
            this.getting = false;
        });
    }*/

    getPageByHeading( heading ) {
        console.log(heading);
        if(!heading) {
            return;
        }
        ErdmanDataService.getPageIdByHeading(heading).then(response => {
            const newHash = response[0].page_id;
            console.log(newHash);
            console.log(this.$location.hash());
            if (this.$location.hash() !== newHash) {
                this.$location.hash(newHash);
                this.$anchorScroll();
            }
            console.log(this.$location.hash());
        });

    }

    searchPages( query ){
        if(!query) return;
        ErdmanDataService.search().then(response => this.$rootScope.$apply(this.results = response));
    }

    nestTitles() {
        for (const k in this.titles) {
            if (k.indexOf('.') === -1) {
                const toplvl = {
                    title: this.titles[k],
                    key: k,
                    children: this.getChildren(k),
                    showChildren: false
                };
                this.tocTree.push(toplvl);
                delete this.titles[k];
            }
        }
    }

    getChildren(parent) {
        const children = [];
        for (const k in this.titles) {
            const test = k.substring(0, k.lastIndexOf("."));
            if(parent === test) {
                const grandChildren = this.getChildren(k);
                const child = {
                    title: this.titles[k],
                    key: k,
                    children: grandChildren,
                    showChildren: false
                };
                children.push(child);
                delete this.titles[k];
            }
        }
        return children;
    }

}

export default ErdmanController