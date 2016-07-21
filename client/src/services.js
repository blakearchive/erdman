import jQuery from 'jquery';
import Page from './models';

jQuery.ajaxSettings.traditional = true;

export class ErdmanDataService {

    static getPages(pageIds) {
        let url = '/api/pages',
            promise = jQuery.getJSON(url, {"page_id": pageIds || []});
        return promise.then(data => {
            return data.map(i => new Page(i));
        });
    }
}