import jQuery from 'jquery';
import Page from './models';

jQuery.ajaxSettings.traditional = true;

class ErdmanDataService {
    constructor(){
        this.apiBase = 'http://localhost:8002'
    }
    getPages() {
        let url = this.apiBase + '/api/pages',
            promise = jQuery.getJSON(url);
        return promise.then(data => {
            data.map(i => new Page(i));
        });
    }
}

export default ErdmanDataService;