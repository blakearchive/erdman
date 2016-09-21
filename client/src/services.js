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

    getPages(pageIds) {
        let url = '/api/pages';
        pageIds = pageIds || [];
        let _getPages = _ => {
            return this.server.pages.query().filter(p => pageIds.indexOf(p.page_id) >= 0).execute().then(results => {
                let cachedIds = results.map(r => r.page_id);
                let uncached = pageIds.filter(p => cachedIds.indexOf(p) == -1);
                if (uncached.length > 0) {
                    return jQuery.getJSON(url, {"page_id": uncached}).then(data => {
                        let pages = data.map(i => new Page(i));
                        this.server.pages.add.apply(null, pages).catch(_ => _);
                        return pages.concat(results).sort((a, b) => a.id - b.id);
                    });
                }
                else return results;
            });
        };
        if (this.server.then) {
            return this.server.then(s => _getPages());
        } else return _getPages();
    }

    getPageIdByHeading(heading) {
        let url = '/api/heading',
          promise = jQuery.getJSON(url, {"heading": heading || []});
        return promise.then(data => {
            return data;
        });
    }


    search(query) {
        let url = '/api/search',
            promise = jQuery.getJSON(url, {"q": encodeURIComponent(query) || ''});
        return promise.then(data => {
            return data;
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