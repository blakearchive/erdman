/// <reference path="../definitions/react-treeview/react-treeview.d.ts" />

import * as api from './api';
import * as React from 'react';
import TreeView = require('react-treeview');


export class App extends React.Component<IAppProps, any> {
    constructor() {
        super();
        this.state = {filter: ""};
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        var searchTerm = (document.getElementById("search-text") as HTMLInputElement).value;
        this.setState({filter: searchTerm});
        e.preventDefault();
    }

    render() {
        let {titles, pages} = this.props,
            matchingPages = api.pagesMatchingSearch(pages, this.state.filter);
        return (
            <div>
                <div className="row" onSubmit={this.handleSubmit}>

                    <div className="col-md-3"><h1 className="text-center">Erdman</h1></div>
                    <div className="col-md-9">
                        <div className="search-ctrl pull-right">
                        <form className="form-inline">
                            <input className="form-control" type="text" id="search-text"/>
                            <button className="btn btn-default" type="submit">Search</button>
                        </form>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <TableOfContents pages={matchingPages} titles={titles}/>
                    <PageSet pages={pages}/>
                </div>
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
            <div className="col-md-3">
                {this.createTree(contents)}
            </div>
        );
    }

    createTree(heading) {
        return heading.__index__.map(entryId => {
            let entry = heading[entryId];
            if (entry instanceof api.Page) {
                return (<a key={entry.page_id} href={'#' + entry.page_id}>page {entry.page_id}</a>);
            } else {
                let result, label = (<a href={'#' + entryId}>{this.props.titles[entryId] || entryId}</a>);
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
            <div className="col-md-9">
                {this.props.pages.map((page, idx) => <Page key={idx} page={page}/>)}
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
            <div className="page-container">
                <div className="page-number pull-right">{ this.props.page.page_id }</div>
                <div dangerouslySetInnerHTML={{__html: this.props.page.contents}}/>
            </div>
        )
    }
}