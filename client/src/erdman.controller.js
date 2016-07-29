import {ErdmanDataService} from './services';

class ErdmanController {
    constructor($rootScope) {
        ErdmanDataService.getPages().then(response => $rootScope.$apply(_ => this.pages = response));
    }

    static create($rootScope) {
        return new ErdmanController($rootScope);
    }
}

export default ErdmanController