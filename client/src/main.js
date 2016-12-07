"use strict";

import angular from 'angular';
import ngSanitize from 'angular-sanitize';
import duScroll from 'angular-scroll';
import components from './components';
import {titles, headings} from './data';
import ErdmanController from './erdman.controller'
import jQuery from 'jquery';


angular.module("Erdman", ['duScroll',components])
    .value('duScrollOffset', 60)
    .controller('ErdmanController', ErdmanController)
    /*.run(function($rootScope) {
      if(!window.history || !history.replaceState) {
        return;
      }
      $rootScope.$on('duScrollspy:becameActive', function ($event, $element, $target) {
        var hash = $element.prop('hash');
        if (hash) {
          history.replaceState(null, null, hash);
        }
      });
    })*/
    .run(function($rootScope){
      $rootScope.$on('duScrollspy:becameActive', function ($event, $element, $target) {
        jQuery('.toc-item.expandible').each(function(k,v){
          if (jQuery(v).find('.active').length || jQuery(v).hasClass('active')) {
            jQuery(v).addClass('expanded');
            /*if(jQuery(v)[0].id === $element[0].id && $element.hasClass('expanded')){
              jQuery(v).removeClass('expanded');
            } else {
              jQuery(v).addClass('expanded');
            }*/
          } else {
            jQuery(v).removeClass('expanded');
          }
        });

        /*if(jQuery($element).hasClass('expanded')){
          jQuery($element).removeClass('expanded');
        }*/
      });
    })
    .run(function($rootScope){
      $rootScope.$on('newSearch', function($event){
        jQuery('.search-results').animate({scrollTop: 0}, 'fast');
      })
    })
    .config(function($locationProvider) {
      $locationProvider.html5Mode(true).hashPrefix('!');
    });