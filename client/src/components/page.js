import angular from 'angular';

const template = `<div>Page working!</div>`;

const page = angular.module("page", []).component('page', {
    template: template
}).name;

export default page;