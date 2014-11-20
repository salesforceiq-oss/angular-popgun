# Welcome to the Shell App

Because I'm tired of typing it, going forward "Angular 1.x" will be referred to
as "A1.x" and 2.0 will be "A2.0".  You've been warned.

## What is the Shell App

It's a Typescript/A1.x based shell that provides the same basic
environment as the CRM web application, including UIQ, Routing, and familiar
build tools.  It also provides all the fun stuff you need to get up and running
with typescript (including build tools, basic type definitions for node,
angular, ES6, etc.).

The goal of the shell app is to provide a "playground" or wrapper that allows you to 
develop new components in isolation.  It's pretty cool.

### Shell App Structure

```
.
├── README.md             You better know what a README.md is
├── app                   The source code for the shell application (super simple angular app)
│   ├── app.scss          SCSS specific to the app shell (should be minimal)
│   ├── index.html        HTML that powers the app shell (should be minimal)
│   ├── index.ts          Boostraps the A1.x shell app (should be minimal)
│   └── tsconfig.json     Typescript project file for the app
├── assets
├── bin                   Build tools
│   ├── headless
│   └── iqb
├── build                 Build tasks
│   ├── feat
│   ├── start-server
│   └── update
├── docker                Tooling needed to deploy the shell app to DCOS
│   ├── Dockerfile
│   ├── README.md
│   └── package.json
├── docker-dev            Tooling needed to build the shell app in TeamCity
│   ├── Dockerfile
│   └── README.md
├── node_modules          node modules... 
├── package.json
├── release               Where all build artifacts end up (this is the WWW root for the local server)
│   ├── assets
│   └── index.html
├── src                   Your module's source code.  99% of your work should be done in here
│   ├── index.html
│   ├── index.scss
│   ├── index.ts
│   └── tsconfig.json
├── typings               Type definitions for non-typescript modules (angular, node, etc.)
│   ├── browser.d.ts
│   └── main.d.ts
└── typings.json          Configuration file that determines which type definitions get installed
```

## Getting Started

UI modules should export an angular module containing a directive.  In the case
of Modals/Dialogs you'll also probably want to export a service that makes the
modal easy to use.  My recommendation is to create that service somewhere in
`src/` and add it to the `angularModule` that gets exported from
`src/index.ts`, then you can inject it normal-style.

The routing for the shell application is handled in `app/index.ts`.  If you
change the name of the root module from `SampleModule` (and you should), then
you'll need to update the default view in `app/index.ts` to reflect the new
root directive.

## A few notes about Typescript

### Type Definitions

Typescript needs to understand where modules are defined and what their type is
to work properly.  To this effect, globals like `module` or `require` or
`angular` will throw compile errors unless you define them.  This is what the
`typings/` directory is for.  To install type definitions for a module that you
want to use, but didn't write, you can run:

```
typings install modulename --save --ambient
```

**The order of arguments here matters**.  If you put the `--save` flag before
the module name, it won't work.  sadface.  angry face.

### Classes 

Use classes when you know you'll be `new`ing an object and potentially want to
create a class hierarchy.  **Hierarchies should be kept as shallow as
possible**.  If you do something like `AbstractDataService ->
SpecificDataService -> SpecificDataServiceWithFeature ->
MoreSpecificDataServiceWithMoreFeatures` then I will find you and scold you.
Repeatedly.  Classes are also useful if you need to add intrinsic logic to your
objects (getters, setters, methods).

**Do your best to keep Display logic (eg: anything referenced by a template)
separate from model/business logic (eg: anything referenced by a
service/controller)**

Use interfaces when you want to provide different implementations of the same
contract (eg: a module facade) or when your "type" is so simple and isolated it
doesn't merit an entire class.  This is pretty subjective so use your best
judgement.

## Preparing for A2.0

The app shell is designed to follow an "A2.0-style" structure as much as
possible.  The A2.0 dependency injector provides a shotloaf of awesome new
features, including injector hierarchies, custom providers, etc.  We should
make it easy to move modules over to that structure.

### The A1.x Way

Our traditional A1.x approach is to create a module folder, which contains an
index file, usually a directive definition, a controller, maybe some services,
and some templates:

```
TopNav
├── CustomizeNavDialogCtrl.js
├── TopNav-spec-helper.js
├── TopNavCnst.js
├── TopNavCustomizeSrvc.js
├── TopNavCustomizeSrvc.spec.js
├── TopNavDrtv.js
├── TopNavDrtv.spec.js
├── TopNavListFiltersDrtv.js
├── TopNavSearchBarDrtv.js
├── TopNavSearchBarDrtv.spec.js
├── TopNavSrvc.js
├── TopNavSrvc.spec.js
└── index.js
```

This works really well in A1.x, but in A2.0, controllers, factories, services,
constants...  they aren't things anymore.  Everything is a class, and you
create providers that create instances of classes.

There's an amazing(ly long) write-up about the A2.0 injector at
https://angular.io/docs/ts/latest/guide/dependency-injection.html

### The A2.0 Way

*Disclaimer: this structure is still open for discussion and is subject to
change*

```
src                                   the TopNav module should be it's own repo based on the shell app
├── interfaces                        public contracts that consuming modules need to implement or know about
|   └── ITopNav.ts
├── lib                               lib contains business logic. nothing UI-related should live here
|   ├── constants.ts
|   └── top-nav-customize
|       ├── TopNavCustomize.spec.ts   test: sidecar files next to what they're testing
|       └── TopNavCustomize.ts        the data model / business logic for TopNavCustomization
└── ui                                ALL UI Components live here
    ├── top-nav
    |   ├── index.ts                  This is the only file that has anything to do with angular.
    |   ├── TopNav.spec.ts            Tests the TopNav.ts file without bootstraping an angular-app
    |   └── TopNav.ts                 The 'controller'; should have nothing angular-specific in it
    ├── top-nav-list-filters
    |   ├── index.ts
    |   ├── TopNavListFilters.spec.ts
    |   └── TopNavListFilters.ts
    └── top-nav-search-bar
        ├── index.ts
        ├── TopNavSearchBar.spec.ts
        └── TopNavSearchBar.ts
```

This basic structure tries to make as much of the code as possible
framework-agnostic.  The entirety of a module's business logic (models,
contracts, validators, etc.) should live in the `lib/` folder.
It should be possible to get 100% unit test coverage of this folder without
involving angular.

**Rule of Thumb:** when deciding if something belongs in `lib/`, think to yourself "if I decided
to write a CLI tool that did the same thing as the GUI, would I be able to do that using only the
objects in lib?".  If the answer is no, then you should probably think about refactoring.  *If
you're building a UI component (like popgun, grid, or something like that, then this rule probably
doesn't apply).*

The UI folder contains components.  Those components have associated controllers.  You can usually
test the entirety of the controller logic without involving angular.  Additionally, no logic should
be performed in views.  This means (nearly) never accessing model values directly.  If you're
tempted to do something like `ng-if="$scope.viewModel.prop === 'Something'"`, or god forbid
`ng-style="{'z-index': 1040 + (index && 1 || 0) + index*10}"`, then stop immediately and do this
instead: `ng-if="ctrl.currentPropIs('Something')"`.  This makes the views much simpler and the
logic easier to test.


## Testing

I have a pretty strong opinion regarding testing.  This shell app greatly reflects my opinions.
Take it or leave it, but I think it's a pretty good idea.  If you don't like it, pull requests are
welcome.

Tests are written using tape as the testing framework.  I picked this over Jasmine/Karma or
Mocha/Chai for a number of reasons:

 * There's no magic (no global things that are defined in a magical land far far away)
 * Really, there's no magic (beforeEach, afterEach, describe, it, etc. do not exist)
 * REALLY, there's **no** magic (it's just a module you `require`)
 * It outputs in the TAP format, which has been around since the 80s and has a wide community
 * If you do need to run tests against a DOM, you can use jsdom, phantom, or you can just
   browserify up the tests and run them in the browser.  Tape has no opinion here.
 * It's just so insanely tiny and fast
 * I looked at the documentation like twice and was good to go. There's almost nothing to learn
 * There's no configuration file either because there's nothing magical that needs it

You should test enough things to feel comfortable that the system works, and if you start
spending a lot of time discussing the testing frameworks/strategies/whatever then it 
distracts you from building the thing you're trying to test.

### But How Do I Debug???

`node-inspector` is the bee's knees.  `npm install -g node-inspector` and then `node-debug
.src/SomeModule.js` to debug it.

Note that you have to run `node-debug` on the compiled JS file, **but** `node-debug` 
understands sourcemaps, so you'll actually be debugging TS.  :yey:

### Spies

I don't like 'em.  I think they're a code smell.

### Mocks 

No opinions here.

### Unit Tests

Unit tests should do what they say on the box.  They should test a single unit of the application.
If your unit test has a lot of requires/imports, you're probably not writing a unit test.

Generally, unit tests will test everything in `lib/` and (ideally) all of the angular controllers
in the `ui/` folder.  If the code is structured properly, then it should be possible to isolate 
the logic and test it without using angular, browserify, or any other heavy dependencies.

**The Wrong Way**: put it all in one file
```typescript
angular.module('MyModule', [])
  .directive('sampleModule', function() {
    return {
      restrict: 'E',
      scope: {},
      controller: function($q, $http) {
        this.isHardToTest() {
          /*
           * this is hard to test because you have to bootstrap angular just to access this method,
           * and because of the HTML require, you also have to browserify everything... which is lame
           * you clearly don't need angular to test that this returns 4
           */
          return 2 + 2;
        }
      },
      controllerAs: 'ctrl',
      template: require('./index.html')
    }
  });
```

**The Right Way**: split it up
```typescript
import SampleModuleCtrl from './SampleModule';

angular.module('MyModule', [])
  .directive('sampleModule', function() {
    return {
      restrict: 'E',
      scope: {},
      controller: SampleModuleCtrl,
      controllerAs: 'ctrl',
      template: require('./index.html')
    }
  });
```

```typescript
export class SampleModuleCtrl {
  constructor($q, $http) {
    // for testing purposes, you can provide your own implementations
    // of $q and $http without involving angular. 
  }

  public isNoLongerHardToTest() {
    // super easy to test because you have 0 dependencies on angular here
    return 2 + 2;
  }
}
```

### Integration Tests

**Disclaimer**: there is 0 tooling in place to do this right now.  But there will be.  And this is
how it'll work.

Integration tests can make sure that when all of the individual units are put together (or
*integrated*... get it?), the entire system works as expected.  You should have far fewer
integration tests than unit tests.  They will also run less frequently (only on build, not during
normal development) and take longer than unit tests.

Integration tests should live somewhere in the `app/` folder, as they'll likely require things like
a DOM, angular, UIQ, and other peer dependencies.  Since the shell app also provides a similar
environment to the webapp, it's an ideal place to make sure all the pieces fit together.

### Functional Tests

We call them smoke tests.  They're generally run by CI/CD.

## Other Tooling

### iqb deploy

The deploy script will build a webapp docker container that serves assets 
from release/.  Generally, you *shouldn't* run this locally, but instead
should set up CI/CD in TeamCity.

This script requires either docker-machine, the docker for mac beta, or a linux machine
to work properly.

### iqb update

Can be used to fetch updated project tooling from the upstream repository.
This update will overwrite any changes to:

 * `bin/iqb`
 * `build/deploy`
 * `build/start-server`
 * `build/update`
 * `docker-dev/Dockerfile`
 * `docker-dev/README.md`
 * `docker/Dockerfile`
 * `docker/package.json`
 * `docker/README.md`

You should not make changes to any of these files.
