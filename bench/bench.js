/*jslint node: true */
var testConstruction = false,
    testUsage = true,
    testCompleteRun = false;
function getJSClasses() {
    var classes, http, fs, count;
    classes = [
        {
            name: 'jsface',
            url: 'http://dl.dropbox.com/u/7677927/oop-benchmark/lib/jsface.js'
        }
    ];

    http = require('http');
    fs = require('fs');

    count = 0;

    classes.forEach(function (cl) {
        var file = fs.createWriteStream(cl.name + '.js');

        file.on('close', function () {
            count += 1;

            if (count >= classes.length) {
                runTests();

                classes.forEach(function (cl) {
                    fs.unlink(cl.name + '.js');
                });
            }
        });

        http.get(cl.url, function (response) {
            response.pipe(file);
        }).on('error', function (er) {
            console.log(er);
            process.exit(1);
        });
    });
}

getJSClasses();

function runTests() {
    var aKlass, jsface, Benchmark,
        JSFacePerson, JSFaceFrenchGuy, JSFaceParisLover,
        AklassPerson, AklassFrenchGuy, AklassParisLover,
        suiteConstruction, suite, suiteUsage,
        jsfaceLover, aklassLover;

    aKlass = require('../index').aKlass;
    jsface = require('./jsface');
    Benchmark = require('benchmark');

    JSFacePerson = jsface.Class({
        constructor: function (name) {
            this.name = name;
        },
        setAddress: function (country, city, street) {
            this.country = country;
            this.city = city;
            this.street = street;
        }
    });

    JSFaceFrenchGuy = jsface.Class(JSFacePerson, {
        constructor: function (name) {
            JSFaceFrenchGuy.$super.call(this, name);
        },
        setAddress: function (city, street) {
            JSFaceFrenchGuy.$superp.setAddress.call(this, 'France', city, street);
        }
    });

    JSFaceParisLover = jsface.Class(JSFaceFrenchGuy, {
        constructor: function (name) {
            JSFaceParisLover.$super.call(this, name);
        },
        setAddress: function (street) {
            JSFaceParisLover.$superp.setAddress.call(this, 'Paris', street);
        }
    });

    AklassPerson = aKlass.klass({
        initialize: function (name) {
            this.name = name;
        },

        setAddress: function (country, city, street) {
            this.country = country;
            this.city = city;
            this.street = street;
        }
    });

    AklassFrenchGuy = aKlass.extend(AklassPerson, {
        initialize: function (name) {
            AklassFrenchGuy.$super.call(this, name);
        },

        setAddress: function (city, street) {
            AklassFrenchGuy.$superp.setAddress.call(this, 'France', city, street);
        }
    });

    AklassParisLover = aKlass.extend(AklassFrenchGuy, {
        initialize: function (name) {
            AklassParisLover.$super.call(this, name);
        },

        setAddress: function (street) {
            AklassParisLover.$superp.setAddress.call(this, 'Paris', street);
        }
    });

    if (testConstruction) {
        suiteConstruction = new Benchmark.Suite();
        suiteConstruction
            .add('JS Face construction test', function () {
                var ob = new JSFaceParisLover("Mary");
            })
            .add('aKlass construction test', function () {
                var ob = new AklassParisLover("Mary");
            })
            // add listeners
            .on('cycle', function (event) {
                console.log(String(event.target));
            })
            .on('complete', function () {
                console.log('Fastest is ' + this.filter('fastest').pluck('name'));
            })
            .run();
    }

    if (testUsage) {
        suiteUsage = new Benchmark.Suite();
        jsfaceLover = new JSFaceParisLover("Mary");
        aklassLover = new AklassParisLover("Mary");
        suiteUsage
            .add('JS Face use method test', function () {
                jsfaceLover.setAddress("CH");
            })
            .add('aKlass use method test', function () {
                aklassLover.setAddress("CH");
            })
            .on('cycle', function (event) {
                console.log(String(event.target));
            })
            .on('complete', function () {
                console.log('Fastest is ' + this.filter('fastest').pluck('name'));
            })
            .run();
        jsfaceLover = null;
        aklassLover = null;
    }

    if (testCompleteRun) {
        suite = new Benchmark.Suite();
        suite
            .add('aKlass test', function () {
                var ob = new AklassParisLover("Mary");
                ob.setAddress("CH");
            })
            .add('JS Face test', function () {
                var ob = new JSFaceParisLover("Mary");
                ob.setAddress("CH");
            })
            // add listeners
            .on('cycle', function (event) {
                console.log(String(event.target));
            })
            .on('complete', function () {
                console.log('Fastest is ' + this.filter('fastest').pluck('name'));
            })
            .run();
    }
}
