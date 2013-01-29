/*jslint node: true */
var suiteExtending, Benchmark,
    aKlass, aKlassp, jsface,
    dirname,
    extendObj;

dirname = __dirname;

Benchmark = require('benchmark');

extendObj = {
    foo: function () {
        return 1;
    },
    bar: 2
};

aKlass = require(dirname + '/../index').aKlass;
aKlassp = require(dirname + '/../aklass-parent').aKlass;
jsface = require(dirname + '/jsface');
require(dirname + '/jquery.klass-1.0.js');


suiteExtending = new Benchmark.Suite();
suiteExtending
    .add('JS Face extension test', function () {
        var ob = jsface.Class(JSFaceParisLover, extendObj);
    })
    .add('aKlass extension test', function () {
        var ob = AklassParisLover.extend(extendObj);
    })
    .add('aKlassp extension test', function () {
        var ob = AklasspParisLover.extend(extendObj);
    })
    .add('jqKlass extension test', function () {
        var ob = JqKlassParisLover.extend(extendObj);
    })
    .on('cycle', function (event) {
        console.log(String(event.target));
    })
    .on('complete', function () {
        console.log('Fastest is ' + this.filter('fastest').pluck('name') + '\n');
    })
    .run();
