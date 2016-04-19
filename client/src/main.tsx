import * as data from './data';
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import {TableOfContents} from './components';

var el = document.getElementById("table-of-contents");

ReactDOM.render(<TableOfContents pages={data.pages} titles={data.titles}/>, el);