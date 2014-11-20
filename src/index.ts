///<reference path="../typings/browser.d.ts" />

import {SampleModule} from './SampleModule';

declare var angular;
declare var require;

export const name = 'SampleModule';

export const angularModule = angular.module(name, [])
  .directive('sampleModule', function() {
    return {
      restrict: 'E',
      scope: {},
      controller: SampleModule,
      controllerAs: 'ctrl',
      template: require('./index.html')
    }
  });
