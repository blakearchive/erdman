import angular from 'angular';
import reader from './reader';
import toc from './toc';
import noteOverlay from './note-overlay';
import searchForm from './search-form';
import searchResults from './search-results';
import pageJump from './page-jump';

const components = angular
    .module('app.components', [
        noteOverlay,
        pageJump,
        reader,
        searchForm,
        searchResults,
        toc
    ])
    .name;

export default components;