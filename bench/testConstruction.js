var suiteConstruction, Benchmark,
    aKlass, aKlassp, jsface,
    dirname;

dirname = __dirname;
if (!global.jQuery) {
    global.jQuery = {};
}

Benchmark = require('benchmark');
aKlass = require(dirname + '/../index').aKlass;
aKlassp = require(dirname + '/../aklass-parent').aKlass;
jsface = require(dirname + '/jsface');
require(dirname + '/jquery.klass-1.0.js');

suiteConstruction = new Benchmark.Suite();
suiteConstruction
    .add('JS Face construction test', function () {
        var ob = new JSFaceParisLover("Mary");
    })
    .add('aKlass construction test', function () {
        var ob = new AklassParisLover("Mary");
    })
    .add('aKlassp construction test', function () {
        var ob = new AklasspParisLover("Mary");
    })
    .add('jqKlass construction test', function () {
        var ob = new JqKlassParisLover("Mary");
    })
    .on('cycle', function (event) {
        console.log(String(event.target));
    })
    .on('complete', function () {
        console.log('Fastest is ' + this.filter('fastest').pluck('name') + '\n');
    })
    .run();

