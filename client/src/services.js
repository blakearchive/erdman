import jQuery from 'jquery';
import db from 'db.js';
import Page from './models';
import {pages} from './data';

jQuery.ajaxSettings.traditional = true;

class _ErdmanDataService {

    constructor() {
        this.server = db.open({
            server: 'Erdman',
            version: 1,
            schema: {
                pages: {
                    key: {keyPath: 'page_id'}
                },
                searches: {
                    key: {keypath: 'id', autoIncrement: true}
                },
                searchResults: {
                    key: {keypath: 'id', autoIncrement: true}
                }
            }
        });
        this.server.then(s => this.server = s);
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

class _PageService {
    constructor() {
        this.pages = pages;
    }

    isActive(page) {
        let el = document.getElementById(page.page_id);
        if (el) {
            return this.inBoundingArea(el);
        }
        return false;
    }

    active() {
        return this.pages.filter(p => this.isActive(p)).map(p => p.page_id);
    }

    inactive() {
        return this.pages.filter(p => !this.isActive(p)).map(p => p.page_id)
    }

    inBoundingArea(el) {
        let rect = el.getBoundingClientRect();

        let buffer = 3000;

        return (
          rect.bottom >= 0 &&
          rect.bottom <= jQuery(window).height() + buffer
        );
    }
}

export const ErdmanDataService = new _ErdmanDataService(), PageService = new _PageService();