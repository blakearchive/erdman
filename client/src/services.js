import jQuery from 'jquery';
import Page from './models';

jQuery.ajaxSettings.traditional = true;

export class ErdmanDataService {

    static getPages(pageIds) {
        let url = 'http://localhost:8002/api/pages',
            promise = jQuery.getJSON(url, {"page_id": pageIds || []});
        return promise.then(data => {
            return data.map(i => new Page(i));
        });
    }

    static search(query) {
        let url = 'http://localhost:8002/api/search',
            promise = jQuery.getJSON(url, {"q": encodeURIComponent(query) || ''});
        return promise.then(data => {
            return data.map(i => new Page(i));
        });
    }
}