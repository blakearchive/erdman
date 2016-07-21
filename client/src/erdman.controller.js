import {ErdmanDataService} from './services';

class ErdmanController {
    constructor($rootScope) {
        let that = this;
        ErdmanDataService.getPages().then(response => $rootScope.$apply(_ => that.pages = response));
    }

    static create($rootScope) {
        return new ErdmanController($rootScope);
    }
}

export default ErdmanController