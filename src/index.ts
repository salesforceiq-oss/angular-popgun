///<reference path="../typings/browser.d.ts" />

declare var angular;
declare var require;
let popgun = require('popgun').default;

export const name = 'AngularPopgun';

export const angularModule = angular.module(name, [])
  .factory('AngularPopgunSrvc', function($compile) {

      let AngularPopgunSrvc = {

        init: function($scope, $element): void {
          $element[0].addEventListener('PopgunContentSetup', function(e) {
            let pop = popgun.getPopFromGroupId((<Element>e.target).getAttribute('popgun-group'));
            $compile(pop.popOver.element)($scope);
            $scope.$apply();
          }, false);
        },

        registerGroup: function(groupId: string, opts: any): void {
          popgun.registerGroup(groupId, opts);
        },

        registerSchema: function(schemaId: string, opts: any): void {
          popgun.registerSchema(schemaId, opts);
        },

        getPopFromGroupId: function(groupId: string): any {
          return popgun.getPopFromGroupId(groupId);
        },

        getPopState: function(groupId: string): string {
          return popgun.getPopState(popgun.getPopFromGroupId(groupId));
        },

        showPop: function(target: Element, isPinned: boolean, trigger: string): void {
          return popgun.showPop(target, isPinned, trigger);
        },

        hidePop: function(target: Element): void {
          return popgun.hidePop(target);
        }
    };

    return AngularPopgunSrvc;
  });