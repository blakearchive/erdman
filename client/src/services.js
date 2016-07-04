import jQuery from 'jquery';
import Page from './models';

jQuery.ajaxSettings.traditional = true;

class ErdmanDataService {
    getPages(pageIds) {
        let url = '/api/pages',
            promise = jQuery.getJSON(url, {"page_id": pageIds});
        return promise.then(data => {
            data.map(i => new Page(i));
        });
    }
}

export default ErdmanDataService;