import jQuery from 'jquery';
import Page from './models';

jQuery.ajaxSettings.traditional = true;

export class ErdmanDataService {

    static getPages() {
        let url = '/api/pages',
            promise = jQuery.getJSON(url);
        return promise.then(data => {
            return data.map(i => new Page(i));
        });
    }

    static getPageIdByHeading(heading) {
        let url = '/api/heading',
          promise = jQuery.getJSON(url, {"heading": heading || []});
        return promise.then(data => {
            return data;
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