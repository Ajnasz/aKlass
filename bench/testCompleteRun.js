/*jslint node: true */
var suiteClassCreate, Benchmark,
    aKlass, aKlassp, jsface,
    suiteConstruction, suite, suiteUsage, suiteExtending, suiteClassCreate,
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
require(dirname + '/jqueryClass.js');

require(dirname + '/initclasses.js');

suite = new Benchmark.Suite();
suite
    .add('JS Face test', function () {
        var ob = new JSFaceParisLover("Mary");
        ob.setAddress("CH");
    })
    .add('aKlass test', function () {
        var ob = new AklassParisLover("Mary");
        ob.setAddress("CH");
    })
    .add('aKlassp test', function () {
        var ob = new AklasspParisLover("Mary");
        ob.setAddress("CH");
    })
    .add('jqKlass test', function () {
        var ob = new JqKlassParisLover("Mary");
        ob.setAddress("CH");
    })
    .on('cycle', function (event) {
        console.log(String(event.target));
    })
    .on('complete', function () {
        console.log('Fastest is ' + this.filter('fastest').pluck('name') + '\n');
    })
    .run();
