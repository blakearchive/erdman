import jQuery from 'jquery';
import {ErdmanDataService, PageService} from './services';
import {titles, pages, notes} from './data';

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
        this.note = false;
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
            jQuery('html, body').animate({
                scrollTop: jQuery("#"+newHash).offset().top
            }, 100);
        }
    }

    searchPages( query ){
        if(!query) return;

        ErdmanDataService.search(query).then(response => {
            const results = {};
            for(const doc of response.docs) {
                const pageObject = pages.filter(page => page.page_id == doc.page_id);
                let headingId = '';
                if(Array.isArray(pageObject[0].headings[0][1])){
                    headingId = pageObject[0].headings[0][1][0][0];
                } else {
                    headingId = pageObject[0].headings[0][0];
                }

                const headingText = titles[headingId];

                const result = {
                    preview: response.highlighting[doc.id].text_contents,
                    page_id: doc.page_id,
                };

                if(results[headingId]) {
                    results[headingId].results.push(result);
                } else {
                    results[headingId] = {
                        'heading': headingText,
                        'results': []
                    };
                    results[headingId].results.push(result);
                }
            }
            console.log(results);
            this.scope.$apply(this.results = Object.assign({}, results));
            this.showSearchResults = true;
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

    openNote(id) {
        this.scope.$apply(this.note = notes[id]);
    }

    closeNote() {
        this.scope.$apply(this.note = false);
    }


}

export default ErdmanController