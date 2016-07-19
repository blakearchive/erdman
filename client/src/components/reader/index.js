import angular from 'angular';
import ReaderComponent from './reader.component';

const reader = angular
    .module('reader', [])
    .component('reader', ReaderComponent)
    .name;

export default reader;