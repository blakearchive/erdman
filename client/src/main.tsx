import * as data from './data';
import * as ReactDOM from 'react-dom';
import * as React from 'react';
import {App} from './components';

var el = document.getElementById("table-of-contents");

ReactDOM.render(<App pages={data.pages} titles={data.titles}/>, el);