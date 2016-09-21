"use strict";

import angular from 'angular';
import ngSanitize from 'angular-sanitize';
import components from './components';
import {titles, headings} from './data';
import ErdmanController from './erdman.controller'


angular.module("Erdman", [components])
    .controller('ErdmanController', ErdmanController)
    .config(function($locationProvider) {
      $locationProvider.html5Mode(true).hashPrefix('!');
    })


