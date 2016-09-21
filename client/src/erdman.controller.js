import jQuery from 'jquery';
import {ErdmanDataService, PageService} from './services';
import {titles, pages} from './data';

class ErdmanController {
    constructor($rootScope, $location, $anchorScroll) {
        this.$location = $location;
        this.$anchorScroll = $anchorScroll;
        this.scope = $rootScope;
        this.pages = pages.map(p => {
            return {page_id: p.page_id, contents: ""}
        });
        jQuery(document).ready(() => this.loadPagesForViewport());
        jQuery(document).scroll(() => {
            clearTimeout(this.timeoutId);
            this.timeoutId = setTimeout(() => this.loadPagesForViewport(), 150)
        });
        this.results = [];
        this.showSearchResults = false;
        this.titles = Object.assign({}, titles);
        this.tocTree = [];
        this.nestTitles();
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

    getPageByHeading( heading ) {
        if(!heading) {
            return;
        }
        ErdmanDataService.getPageIdByHeading(heading).then(response => {
            const newHash = response[0].page_id;
            if (this.$location.hash() !== newHash) {
                this.$location.hash(newHash);
                this.$anchorScroll();
            }
        });
    }

    goToPage( pageId ) {
        if (!pageId) {
            return;
        }
        const newHash = pageId;
        if (this.$location.hash() !== newHash) {
            this.$location.hash(newHash);
            this.$anchorScroll();
        }
    }

    searchPages( query ){
        if(!query) return;

        ErdmanDataService.search(query).then(response => {
            const results = [];
            for(const doc of response.docs) {
                const result = {
                    preview: response.highlighting[doc.id].contents,
                    page_id: doc.page_id
                };
                results.push(result);
            }
            this.scope.$apply(this.results = Object.assign([], results));
            this.showSearchResults = true;
            this.highlightSearchResults(query);
        });
    }

    nestTitles() {
        for (const k in this.titles) {
            if (k.indexOf('.') === -1) {
                const toplvl = {
                    title: this.titles[k],
                    key: k,
                    children: this.getChildren(k),
                    showChildren: false
                };
                this.tocTree.push(toplvl);
                delete this.titles[k];
            }
        }
    }

    getChildren(parent) {
        const children = [];
        for (const k in this.titles) {
            const test = k.substring(0, k.lastIndexOf("."));
            if(parent === test) {
                const grandChildren = this.getChildren(k);
                const child = {
                    title: this.titles[k],
                    key: k,
                    children: grandChildren,
                    showChildren: false
                };
                children.push(child);
                delete this.titles[k];
            }
        }
        return children;
    }

    closeSearchResults() {
        this.showSearchResults = false;
    }

    /*highlightSearchResults(term) {
        for (const page of this.pages){
            page.contents[0] = page.contents[0].replace(/term/gim,`<span class="highlight">${term}</span>`);
        }
    }*/

}

export default ErdmanController