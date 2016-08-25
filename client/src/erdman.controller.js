import jQuery from 'jquery';
import {ErdmanDataService, PageService} from './services';
import {pages} from './data';


class ErdmanController {
    constructor($rootScope) {
        this.scope = $rootScope;
        this.pages = pages.map(p => {
            return {page_id: p.page_id, contents: ""}
        });
        jQuery(document).ready(() => this.loadPagesForViewport());
        jQuery(document).scroll(() => {
            clearTimeout(this.timeoutId);
            this.timeoutId = setTimeout(() => this.loadPagesForViewport(), 500)
        });
    }

    updatePageContents(pages) {
        let pageMap = {};
        pages.forEach(page => pageMap[page.page_id] = page);

        this.scope.$apply(() => {
            this.pages.forEach(page => {
                let newPage = pageMap[page.page_id];
                if (newPage) {
                    page.contents = newPage.contents;
                }
                else page.contents = "";
            });
        });
    }

    loadPagesForViewport() {
        let active = PageService.active();
        ErdmanDataService.getPages(active)
            .then(response => this.updatePageContents(response));
    }
}

export default ErdmanController