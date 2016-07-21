import {ErdmanDataService} from './services';

class ErdmanController {
    constructor($rootScope) {
        this.$rootScope = $rootScope;
        this.pages = [];
        this.results = [];
        this.getPages();
    }

    getPages(){
        ErdmanDataService.getPages().then(response => this.$rootScope.$apply(this.pages = response));
    }

    searchPages( query ){
        if(!query) return;
        ErdmanDataService.search().then(response => this.$rootScope.$apply(this.results = response));
    }

    static create($rootScope) {
        return new ErdmanController($rootScope);
    }
}

export default ErdmanController