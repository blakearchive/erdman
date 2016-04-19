export interface IPage {
    page_id: string,
    headings: any[];
    contents: string;
}

export class Page implements IPage {
    page_id: string;
    headings: any[];
    contents: string;

    constructor(page: IPage) {
        this.page_id = page.page_id;
        this.headings = page.headings;
        this.contents = page.contents;
    }
}

export function createContentsTree(pages: IPage[]) {
    var contents = {__index__: []};

    pages.forEach((page: IPage) => {
        function processHeadingList(headingList, contents = {__index__: []}) {
            headingList.forEach(heading => {
                var title = heading[0], children = heading[1];
                if (contents[title]) {

                    processHeadingList(children, contents[title])
                }
                else {
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
}