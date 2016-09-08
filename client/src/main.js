"use strict";

import angular from 'angular';
import ngSanitize from 'angular-sanitize';
import infiniteScroll from 'ng-infinite-scroll'
import components from './components';
import {titles, headings} from './data';
import ErdmanController from './erdman.controller'


angular.module("Erdman", [infiniteScroll, components])
    .controller('ErdmanController', ErdmanController);


/*function buildTableOfContentsTree(pages) {
    var contents = {__index__: []};
    pages.forEach(function (page) {
        function processHeadingList(headingList, contents) {
            contents = contents ||  {__index__: []};
            headingList.forEach(function (heading) {
                var title = heading[0], children = heading[1];
                if (contents[title]) {
                    processHeadingList(children, contents[title])
                } else {
                    contents.__index__.push(title);
                    if (children.length == 0) {
                        contents[title] = {__index__: [page.page_id]};
                        contents[title][page.page_id] = new Page(page);
                    } else {
                        contents[title] = processHeadingList(children);
                    }
                }
            });
            return contents;
        }
        // should only ever be one heading in heading_1
        processHeadingList(page.headings, contents);
    });
    return contents;
}*/

