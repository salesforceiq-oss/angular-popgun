///<reference path="../typings/browser.d.ts" />
declare var require: NodeRequire;

// This that LucidWeb normally provides
// These should all be listed as peerDependencies of the app
window['jQuery'] = require('jquery');
require('angular');
require('sugar');
require('uiq');

/* I've thought about this line for awhile.
 *
 * requiring the stuff from `src/` using the `var/require` method is nice
 * because you don't end up 'double-compiling'.  using the `import/require`
 * method causes all the source to get recompiled as a part of the app... which
 * is "technically" correct but not really what I'm looking for here (as in,
 * .app-src/src contains the same thing as .src)
 *
 * also this page is an app shell that bootstraps a similar environment to
 * LucidWeb, which is going to use the `var/require`, so it's not bad to use it
 * here too.  and really you shouldn't be adding much (if any) logic here, so
 * ultimately it doesn't matter.
 */
var appLogic = require('../.src');

// Set up the shell app w/angular, uiq, and a router
var router = require('web-core-router');
var routerOptions = {
  RouterCnst: router.makeRouterCnst()
};

/* even though shell-apps should really only have 1 view, having the url <=>
 * model binding is pretty nice (if say, you're working on import and want an
 * easy way to jump to step N)
 */
routerOptions.RouterCnst.STATES = {
  MAIN: {
    name: 'main',
    queryParams: [],
    lazyQueryParams: [],
    template: '<sample-module></sample-module>',
    modelBindings: {},
    default: true
  }
};

// Bootstrap the shell-app module and configure the router
module.exports = angular.module('shell-app', ['RouterCore', 'uiq', appLogic.name])
  .config(router.defaultRuleConfig(routerOptions.RouterCnst))
  .config(router.stateConfig(routerOptions))
  .run(router.run(routerOptions));

window['q$'] = window['jQuery'];
document.title = appLogic.name;
