/// <reference path="../definitions/react/react.d.ts" />
/// <reference path="../definitions/immutable/immutable.d.ts" />
/// <reference path="../definitions/react-treeview/react-treeview.d.ts" />

import * as api from './api';
import * as React from 'react';
import TreeView = require('react-treeview');


export class App extends React.Component<IAppProps, any> {
    render() {
        let {titles, pages} = this.props;
        return (
            <div className="row">
                <TableOfContents pages={pages} titles={titles}/>
                <PageSet pages={pages}/>
            </div>
        )
    }
}

interface IAppProps {
    pages: api.Page[];
    titles: Object;
}

export class TableOfContents extends React.Component<IAppProps, any> {
    render() {
        var contents = api.createContentsTree(this.props.pages);
        return (
            <div className="col-md-4">
                {this.createTree(contents)}
            </div>
        );
    }

    createTree(heading) {
        return heading.__index__.map(entryId => {
            let entry = heading[entryId];
            if (entry instanceof api.Page) {
                return (<a key={entry.page_id} href={'#' + entry.page_id}>{entry.page_id}</a>);
            } else {
                let result, label = (<a href={'#' + entryId}>{this.props.titles[entryId]}</a>);
                // Don't create a tree-view for single page headings
                if (entry.__index__.length == 1 && entry[entry.__index__[0]] instanceof api.Page) {
                    result = <div key={entryId}>{label}</div>;
                } else {
                    result = (
                        <TreeView defaultCollapsed={true} key={entryId} nodeLabel={label}>
                            {this.createTree(entry)}
                        </TreeView>);
                }
                return result;
            }
        });
    }
}

interface IPageSetProps {
    pages: api.Page[];
}

export class PageSet extends React.Component<IPageSetProps, any> {
    render() {
        return (
            <div className="col-md-8">
                {this.props.pages.map(page => <Page page={page}/>)}
            </div>
        )
    }
}

interface IPageProps {
    page: api.Page;
}

export class Page extends React.Component<IPageProps, any> {
    render() {
        return (
            <div className="page" dangerouslySetInnerHTML={{__html: this.props.page.contents}}/>
        )
    }
}