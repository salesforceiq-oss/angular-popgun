///<reference path="../../typings/browser.d.ts" />

import {SampleModuleCtrl} from './SampleModuleCtrl';
import {SampleModulePopCtrl} from './SampleModulePopCtrl';

declare var angular;
declare var require;

export const name = 'SampleModule';

export const angularModule = angular.module(name, [])
  .directive('sampleModule', function() {
    return {
      restrict: 'E',
      scope: {
        word: '='
      },
      controller: SampleModuleCtrl,
      controllerAs: 'ctrl',
      template: require('./sampleModule.html')
    };
  })
  .directive('sampleModulePop', function() {
    return {
      restrict: 'E',
      scope: {
        word: '='
      },
      controller: SampleModulePopCtrl,
      controllerAs: 'ctrl',
      template: require('./sampleModulePop.html')
    };
  });