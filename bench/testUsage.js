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
require(dirname + '/jquery.klass-1.0.js');


suiteUsage = new Benchmark.Suite();
jsfaceLover = new JSFaceParisLover("Mary");
aklassLover = new AklassParisLover("Mary");
aklasspLover = new AklasspParisLover("Mary");
jqklassLover = new JqKlassParisLover("Mary");

suiteUsage
    .add('JS Face use method test', function () {
        jsfaceLover.setAddress("CH");
    })
    .add('aKlass use method test', function () {
        aklassLover.setAddress("CH");
    })
    .add('aKlassp use method test', function () {
        aklasspLover.setAddress("CH");
    })
    .add('jqKlass use method test', function () {
        jqklassLover.setAddress("CH");
    })
    .on('cycle', function (event) {
        console.log(String(event.target));
    })
    .on('complete', function () {
        console.log('Fastest is ' + this.filter('fastest').pluck('name') + '\n');
    })
    .run();
jsfaceLover = null;
aklassLover = null;
