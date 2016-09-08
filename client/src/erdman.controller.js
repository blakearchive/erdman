import {ErdmanDataService} from './services';

class ErdmanController {
    constructor($rootScope) {
        this.$rootScope = $rootScope;
        this.pages = [];
        this.results = [];
        this.lastPage = 0;
        this.getNextPages(0);
        this.getting = false;
    }

    getPages(){
        ErdmanDataService.getPages().then(response => {
            this.$rootScope.$apply(this.pages = response)
        });
    }

    getNextPages(pageId){
        this.getting = true;
        ErdmanDataService.getPageGroup(pageId).then(response => {
            this.$rootScope.$apply(this.pages = this.pages.concat(response))
            this.lastPage = response[response.length - 1].id;
            console.log(this.lastPage);
            this.getting = false;
        });
    }

    searchPages( query ){
        if(!query) return;
        ErdmanDataService.search().then(response => this.$rootScope.$apply(this.results = response));
    }

}

export default ErdmanController