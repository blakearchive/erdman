import angular from 'angular';
import Reader from './reader';

const components = angular
    .module('app.components', [
        Reader
    ])
    .name;

export default components;