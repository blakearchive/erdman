"use strict";

import angular from 'angular';
import ngSanitize from 'angular-sanitize';
import infiniteScroll from 'ng-infinite-scroll'
import components from './components';
import {titles, headings} from './data';
import ErdmanController from './erdman.controller'


angular.module("Erdman", [infiniteScroll, components])
    .controller('ErdmanController', ErdmanController);


