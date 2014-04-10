var run = Ember.run,
    Application = Ember.Application,
    Controller = Ember.Controller,
    View = Ember.View,
    Store = DS.Store,
    Namespace = Ember.Namespace,
    Object = Ember.Object;

var app, container;

/**
  These tests ensure that Ember Data works with Ember.js' application
  initialization and dependency injection APIs.
*/

module("integration/application - Injecting a Custom Store", {
  setup: function() {
    run(function() {
      app = Application.create({
        ApplicationStore: Store.extend({ isCustom: true }),
        FooController: Controller.extend(),
        ApplicationView: View.extend(),
        BazController: {},
        ApplicationController: View.extend()
      });
    });

    container = app.__container__;
  },

  teardown: function() {
    run(app, app.destroy);
    Ember.BOOTED = false;
  }
});

test("If a Store property exists on an Ember.Application, it should be instantiated.", function() {
  ok(container.lookup('store:main').get('isCustom'), "the custom store was instantiated");
});

test("If a store is instantiated, it should be made available to each controller.", function() {
  var fooController = container.lookup('controller:foo');
  ok(fooController.get('store.isCustom'), "the custom store was injected");
});

test("registering App.Store is deprecated but functional", function(){
  run(app, 'destroy');

  expectDeprecation(function(){
    run(function() {
      app = Application.create({
        Store: DS.Store.extend({ isCustomButDeprecated: true }),
        FooController: Controller.extend(),
      });
    });
  }, 'Specifying a custom Store for Ember Data on your global namespace as `App.Store` ' +
     'has been deprecated. Please use `App.ApplicationStore` instead.');

  container = app.__container__;
  ok(container.lookup('store:main').get('isCustomButDeprecated'), "the custom store was instantiated");

  var fooController = container.lookup('controller:foo');
  ok(fooController.get('store.isCustomButDeprecated'), "the custom store was injected");
});

module("integration/application - Injecting the Default Store", {
  setup: function() {
    run(function() {
      app = Application.create({
        FooController: Controller.extend(),
        ApplicationView: View.extend(),
        BazController: {},
        ApplicationController: View.extend()
      });
    });

    container = app.__container__;
  },

  teardown: function() {
    app.destroy();
    Ember.BOOTED = false;
  }
});

test("If a Store property exists on an Ember.Application, it should be instantiated.", function() {
  ok(container.lookup('store:main') instanceof DS.Store, "the store was instantiated");
});

test("If a store is instantiated, it should be made available to each controller.", function() {
  var fooController = container.lookup('controller:foo');
  ok(fooController.get('store') instanceof DS.Store, "the store was injected");
});

test("the DS namespace should be accessible", function() {
  ok(Namespace.byName('DS') instanceof Namespace, "the DS namespace is accessible");
});
