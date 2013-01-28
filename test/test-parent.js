/*jslint node: true */
var aKlass = require('../aklass-parent').aKlassp;
var klass = aKlass.klass;
var extend = aKlass.extend;
var assert = require('assert');


var mix = {
    jjj: 1
};
var Foo = klass({
    name: null,
    initialize: function () {
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
    initialize: function () {
        this.parent();
    },
    setName: function (name) {
        return this.parent(name);
    }
});

var Baz = Bar.extend({
    initialize: function () {
        this.parent();
    },
    setName: function (name) {
        return this.parent(name);
    }
});

var foo = new Foo();
var bar = new Bar();
var baz = new Baz();

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

assert(foo instanceof Foo);
assert(bar instanceof Bar);
assert(baz instanceof Baz);
console.log('Test finsihed\n');
