import jQuery from 'jquery';

jQuery.ajaxSettings.traditional = true;

class _ErdmanDataService {

    constructor() {

    }

    getPages() {
        let url = '/api/pages';
        let promise = jQuery.get(url);
        return promise.then(data => {
            return JSON.parse(data);
        });
    }

    search(query) {
        let url = '/api/search',
            promise = jQuery.post(url, {"q": query || ''});
        return promise.then(data => {
            return JSON.parse(data);
        });
    }
}

export const ErdmanDataService = new _ErdmanDataService();