///<reference path="../typings/browser.d.ts" />

declare var angular;
declare var require;
let popgun = require('popgun').default;

export const name = 'AngularPopgun';

export const angularModule = angular.module(name, [])
  .factory('AngularPopgunSrvc', function($compile) {

      let AngularPopgunSrvc = {

        appSetup: function(): void {
          popgun.init();
        },

        init: function($scope, el): void {
          if (!el.hasAttribute('popgun-listening')) {
            el.addEventListener('PopgunContentSetup', function(e) {
              let pop = popgun.getPopFromGroupId((<Element>e.target).getAttribute('popgun-group'));
              $compile(pop.popOver.element)($scope);
              $scope.$apply();
            }, false);
            el.setAttribute('popgun-listening', '');
          }
        },

        // Store a group w/ options to reuse
        // schema is a base set of options, options attr will precedence over schema
        registerGroup: function(groupId: string, opts: any): void {
          popgun.registerGroup(groupId, opts);
        },

        // Store a schema of options
        registerSchema: function(schemaId: string, opts: any): void {
          popgun.registerSchema(schemaId, opts);
        },

        // Returns a popover model based on a group
        getPopFromGroupId: function(groupId: string): any {
          return popgun.getPopFromGroupId(groupId);
        },

        // Returns the state of a given popover
        // (hidden, content_setup, pre_position, pre_show, showing, pre_hide)
        getPopState: function(groupId: string): string {
          return popgun.getPopState(popgun.getPopFromGroupId(groupId));
        },

        // Returns a boolean about whether a popover for a specific target is alrady open
        isPopAlreadyOpenForTarget: function(target: Element): boolean {
          return popgun.isPopAlreadyOpenForTarget(target);
        },

        // Returns a boolean about whether a popover is already open for a group
        isPopAlreadyOpenForGroup: function(groupId: string): boolean {
          return popgun.isPopAlreadyOpenForGroup(groupId);
        },

        // Show the popover for a particular target
        showPop: function(target: Element, isPinned: boolean, trigger: string): void {
          return popgun.showPop(target, isPinned, trigger);
        },

        // Hide the popover for a particular target
        hidePop: function(target: Element, hideFullChain: boolean): void {
          return popgun.hidePop(target, hideFullChain);
        }
    };

    return AngularPopgunSrvc;
  });
