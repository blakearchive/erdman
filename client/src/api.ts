export interface IPage {
    page_id: string,
    headings: any[];
    contents: string;
}



function createContentsTree(pages: IPage[]) {
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
                        contents[title] = page;
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
}