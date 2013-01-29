/*jslint node: true */
var suiteClassCreate, Benchmark,
    aKlass, aKlassp, jsface,
    dirname,
    extendObj;

if (!global.jQuery) {
    global.jQuery = {};
}
dirname = __dirname;

Benchmark = require('benchmark');
aKlass = require(dirname + '/../index').aKlass;
aKlassp = require(dirname + '/../aklass-parent').aKlass;
jsface = require(dirname + '/jsface');
require(dirname + '/jquery.klass-1.0.js');


extendObj = {
    foo: function () {
        return 1;
    },
    bar: 2
};

suiteClassCreate = new Benchmark.Suite();
suiteClassCreate
    .add('JS Face class creation test', function () {
        var ob = jsface.Class(extendObj);
    })
    .add('aKlass class creation test', function () {
        var ob = aKlass.klass(extendObj);
    })
    .add('aKlassp creation test', function () {
        var ob = aKlassp.klass(extendObj);
    })
    .add('jqKlass creation test', function () {
        var ob = global.jQuery.klass(extendObj);
    })
    .on('cycle', function (event) {
        console.log(String(event.target));
    })
    .on('complete', function () {
        console.log('Fastest is ' + this.filter('fastest').pluck('name') + '\n');
    })
    .run();
