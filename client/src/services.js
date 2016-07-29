import jQuery from 'jquery';
import db from 'db.js';
import Page from './models';

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
            this.server.pages.query().filter(p => pageIds.indexOf(p.page_id) >= 0).execute().then(results => {
                let cachedIds = results.map(r => r.page_id);
                let uncached = pageIds.filter(p => cachedIds.indexOf(p) >= 0);
                if (uncached.length > 0 || pageIds.length == 0) {
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
}

export const ErdmanDataService = new _ErdmanDataService();