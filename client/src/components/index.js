import angular from 'angular';
import reader from './reader';
import toc from './toc';
import searchForm from './search-form';
import searchResults from './search-results';

const components = angular
    .module('app.components', [
        reader,
        searchForm,
        searchResults,
        toc
    ])
    .name;

export default components;