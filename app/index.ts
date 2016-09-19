///<reference path="../typings/browser.d.ts" />
declare var require: NodeRequire;

window['jQuery'] = require('jquery');
require('angular');

let angularPopgun = require('../.src');
let sampleModule = require('../.app/SampleModule');

module.exports = angular.module('app', [angularPopgun.name, sampleModule.name])
  .controller('appCtrl', function($scope, $element, AngularPopgunSrvc) {

    $scope.words = {
      banana: {
        word: 'Banana',
        definition: 'Not as delicious as Cheetos!!'
      },
      donut: {
        word: 'Donut',
        definition: 'More delicious than Cheetos!!'
      },
      cheetos: {
        word: 'Cheetos',
        definition: 'Hot Cheetos are objectively the tastiest of all types of Cheetos.'
      }
    };

    function init($scope): void {
      AngularPopgunSrvc.appSetup();
      AngularPopgunSrvc.registerGroup('definitions', {
        schemaId: null,
        options: {
          html: require('../.app/SampleModule/sampleModulePop.html'),
          trigger: 'hover'
        }
      });

      let el = document.createElement('div');
      el.setAttribute('popgun', '');
      el.setAttribute('class', 'target');
      el.setAttribute('popgun-group', 'test');
      el.setAttribute('popgun-trigger', 'click');
      el.setAttribute('popgun-text', 'Clicking on a target will pin the popover, which you can unpin with the escape key or clicking elsewhere.');
      el.innerText = 'Click Me!';
      $element.append(el);

      el = document.createElement('div');
      el.setAttribute('popgun', '');
      el.setAttribute('class', 'target different-class');
      el.setAttribute('popgun-group', 'test2');
      el.setAttribute('popgun-trigger', 'hover click');
      el.setAttribute('popgun-html', '<div class="target one-final-different-class" popgun popgun-trigger="hover" popgun-html="Congratulations! You have discovered a nested pop!">Hover Me!!</div>');
      el.innerText = 'Hover or Click Me!';
      $element.append(el);

    }

    init($scope);
  });

document.title = angularPopgun.name;
