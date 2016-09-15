import {ErdmanDataService} from './services';
import {titles} from './data';

class ErdmanController {
    constructor($rootScope) {
        this.$rootScope = $rootScope;
        this.pages = [];
        this.results = [];
        this.lastPage = 0;
        this.getNextPages(0);
        this.getting = false;
        this.titles = Object.assign({}, titles);
        this.tocTree = [];
        this.nestTitles();
    }

    getPages(){
        ErdmanDataService.getPages().then(response => {
            this.$rootScope.$apply(this.pages = response)
        });
    }

    getNextPages(pageId){
        this.getting = true;
        ErdmanDataService.getPageGroup(pageId).then(response => {
            this.$rootScope.$apply(this.pages = this.pages.concat(response));
            this.lastPage = response[response.length - 1].id;
            console.log(this.lastPage);
            this.getting = false;
        });
    }

    getPageByHeading( heading ) {
        console.log('getting pages by heading');
        if(!heading) {
            return;
        }

        this.getting = true;
        ErdmanDataService.getPageByHeading(heading).then(response => {
            this.$rootScope.$apply(this.pages = response);
            this.lastPage = response[response.length - 1].id;
            console.log(this.lastPage);
            this.getting = false;
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