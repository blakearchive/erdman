import {ErdmanDataService} from './services';

class ErdmanController {
    constructor() {
        let that = this;
        that.pages = [];
        ErdmanDataService.getPages().then(response => Array.prototype.push.apply(that.pages, response))
    }

    examine() {
    }

    static create() {
        return new ErdmanController();
    }
}

export default ErdmanController