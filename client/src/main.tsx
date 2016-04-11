import * as api from './api';
import * as data from './data';
import * as React from 'react';
import {TableOfContents} from './components';

var contents = api.createContentsTree(data.pages);

React.createElement(<TableOfContents pages={data.pages} titles={data.titles}/>)