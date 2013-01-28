/*jslint node: true */
var aKlass = require('../index').aKlass;
var klass = aKlass.klass;
var extend = aKlass.extend;
var assert = require('assert');


var mix = {
    jjj: 1
};
var Foo = klass({
    name: null,
    initialize: function (lorem) {
        this.lorem = lorem || 0;
    },
    setName: function (name) {
        this.name = name;
        return name;
    }
});

var Bar = Foo.extend({
    mixins: [mix],
    statics: {
        foo: {
            a: 1
        }
    },
    initialize: function (lorem) {
        Bar.$super.call(this, lorem);
    },
    setName: function (name) {
        return Bar.$superp.setName.call(this, name);
    }
});

assert.equal(typeof Bar.prototype.lorem, 'undefined');

var Baz = Bar.extend({
    initialize: function (lorem) {
        Baz.$super.call(this, lorem);
    },
    setName: function (name) {
        return Baz.$superp.setName.call(this, name);
    }
});

assert.equal(typeof Baz.prototype.lorem, 'undefined');

var foo = new Foo(1);

var bar = new Bar(2);
var baz = new Baz(3);

assert.deepEqual(foo.lorem, 1);
assert.deepEqual(bar.lorem, 2);
assert.deepEqual(baz.lorem, 3);

console.log('Test if name property inherited');
assert.deepEqual(Foo.prototype.name, null);
assert.deepEqual(Bar.prototype.name, null);
assert.deepEqual(Baz.prototype.name, null);

console.log('Test if the setName function of Foo instance is the same as Foo.prototype.setName');
assert.deepEqual(foo.setName, Foo.prototype.setName);

console.log('test if prototype prop not changed');
foo.setName(1);
assert.deepEqual(Foo.prototype.name, null);

console.log('test parent call');
assert.equal(bar.setName(1), 1);
assert.equal(bar.name, 1);

console.log('Test if prototype is still not changed');
assert.deepEqual(Foo.prototype.name, null);
assert.deepEqual(Bar.prototype.name, null);

console.log('test parent call');
assert.equal(baz.setName(2), 2);

console.log('Test if prototype is still not changed');
assert.deepEqual(Foo.prototype.name, null);
assert.deepEqual(Bar.prototype.name, null);
assert.deepEqual(Baz.prototype.name, null);

console.log('check constructor property');
assert.deepEqual(foo.constructor, Foo);
assert.deepEqual(bar.constructor, Bar);
assert.deepEqual(baz.constructor, Baz);

console.log('test mixin');
assert.deepEqual(bar.jjj, 1);

console.log('test statics');
assert.equal(typeof Bar.foo, 'object');
assert.equal(Bar.foo.a, 1);

console.log('test inherited statics');
assert.equal(typeof Baz.foo, 'object');
assert.equal(Baz.foo.a, 1);

console.log('Test instance of');

// test if foo is instance of Foo
assert(foo instanceof Foo);
// test if bar is instance of Bar
assert(bar instanceof Bar);
// test if baz is instance of Baz
assert(baz instanceof Baz);

// Test if bar is instance of it's parent
assert(bar instanceof Foo);

// Test if bar is instance of it's parents
assert(baz instanceof Foo);
assert(baz instanceof Bar);
console.log('tests finished\n');
