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
        this.loadPages()
        this.results = [];
        this.showSearchResults = false;
        this.titles = Object.assign({}, titles);
        this.tocTree = [];
        this.nestTitles();
        this.note = false;
        this.query = '';
    }

    updatePageContents(pages) {
        let pageMap = {};
        pages.forEach(page => pageMap[page.page_id] = page);

        this.scope.$apply(() => {
            this.pages.forEach(page => {
                let newPage = pageMap[page.page_id];
                if (newPage) {
                    page.contents = this.highlightSearchTerm(this.query, newPage.contents, newPage.text_contents);
                }
                else page.contents = "";
            });
        });
    }

    loadPages() {
        ErdmanDataService.getPages()
          .then(response => {this.scope.$apply(this.pages = Object.assign({},response))});
    }

    goToPage( pageId ) {
        if (!pageId) {
            return;
        }
        const newHash = pageId;

        if (this.$location.hash() !== newHash) {
            this.$location.hash(newHash);
            jQuery('html, body').animate({
                scrollTop: jQuery("#"+newHash).offset().top - 55
            }, 100);
        }
    }

    searchPages( query ){
        if(!query) return;


        this.query = query;

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

            this.scope.$apply(this.results = Object.assign({}, results));
            this.showSearchResults = true;
        });
    }

    nestTitles() {
        for (const k in this.titles) {
            if (k.indexOf('.') === -1) {
                const toplvl = {
                    title: this.titles[k].heading,
                    key: k,
                    children: this.getChildren(k)
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
            if (parent === test) {
                const grandChildren = this.getChildren(k);
                const child = {
                    title: this.titles[k].heading,
                    key: k,
                    children: grandChildren
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

    highlightSearchTerm(phrase,text,noHtmlText) {

        if (phrase !== ''){
            if(noHtmlText.match(new RegExp('(' + phrase + ')', 'gim'))){

                if (phrase.startsWith('"') && phrase.endsWith('"')) {
                    phrase = phrase.replace(/"/g, '');
                    text = text.replace(new RegExp('(' + phrase + ')', 'gim'), '<span class="highlighted">$1</span>');
                } else if (phrase.indexOf(' ')) {
                    var phraseArray = phrase.split(' ');
                    angular.forEach(phraseArray, function (ph) {
                        text = text.replace(new RegExp('(\\b' + ph + '\\b)', 'gim'), '<span class="highlighted">$1</span>');
                    });
                } else {
                    text = text.replace(new RegExp('(' + phrase + ')', 'gim'), '<span class="highlighted">$1</span>');
                }
            }
        }

        return text;
    }
}

export default ErdmanController