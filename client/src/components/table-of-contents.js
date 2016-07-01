import angular from 'angular';

const template = `<div>Table of contents working!</div>`;

const tableOfContents = angular.module("tableOfContents", []).component('tableOfContents', {
    template: template
}).name;

export default tableOfContents;