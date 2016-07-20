import angular from 'angular';
import reader from './reader';

const components = angular
    .module('app.components', [
        reader
    ])
    .name;

export default components;