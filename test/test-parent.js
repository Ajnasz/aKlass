/*jslint node: true */
var aKlass = require('../aklass-parent').aKlassp;
var klass = aKlass.klass;
var extend = aKlass.extend;
var assert = require('assert');


var mix = {
    jjj: 1
};
var Foo = klass({
    initialize: function () {
        this.a();
    },
    a: function () {
    },
    b: function (name) {
        this.name = name;
        return name;
    }
});

var Bar = extend(Foo, {
    mixins: [mix],
    statics: {
        foo: {
            a: 1
        }
    },
    initialize: function () {
        // Bar.$super.call(this);
        this.parent();
    },
    b: function (name) {
        return this.parent(name);
        // return Bar.$superp.c.call(this, name);
    }
});

var Baz = extend(Bar, {
    initialize: function () {
        this.parent();
        // Baz.$super.call(this);
    },
    b: function (name) {
        return this.parent(name);
        // return Baz.$superp.c.call(this, name);
    }
});

var foo = new Foo();
var bar = new Bar();
var baz = new Baz();

// Test if a function fo Foo instance is the same as Foo.prototype.a
assert.deepEqual(foo.a, Foo.prototype.a);

// test if Bar inherited the function from A
assert.deepEqual(bar.a, foo.a);

// test parent call
assert.equal(bar.b(1), 1);
assert.equal(bar.name, 1);

// test parent call
assert.equal(baz.b(2), 2);
assert.equal(bar.b(2), 2);

// test mixin
assert.deepEqual(bar.jjj, 1);

// test statics
assert.equal(typeof Bar.foo, 'object');
assert.equal(Bar.foo.a, 1);

// test inherited statics
assert.equal(typeof Baz.foo, 'object');
assert.equal(Baz.foo.a, 1);

assert(foo instanceof Foo);
assert(bar instanceof Bar);
assert(baz instanceof Baz);
