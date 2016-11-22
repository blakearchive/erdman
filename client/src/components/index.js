import angular from 'angular';
import reader from './reader';
import toc from './toc';
import noteOverlay from './note-overlay';
import searchForm from './search-form';
import searchResults from './search-results';

const components = angular
    .module('app.components', [
        reader,
        searchForm,
        searchResults,
        toc,
        noteOverlay
    ])
    .name;

export default components;