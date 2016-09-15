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

    static getPageGroup(pageId) {
        let url = '/api/page_group',
          promise = jQuery.getJSON(url, {"page_id": pageId || []});
        return promise.then(data => {
            return data.map(i => new Page(i));
        });
    }

    static getPageByHeading(heading) {
        let url = '/api/heading',
          promise = jQuery.getJSON(url, {"heading": heading || []});
        return promise.then(data => {
            return data.map(i => new Page(i));
        });
    }


    static search(query) {
        let url = '/api/search',
            promise = jQuery.getJSON(url, {"q": encodeURIComponent(query) || ''});
        return promise.then(data => {
            return data.map(i => new Page(i));
        });
    }
}