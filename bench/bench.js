/*jslint node: true */
var testConstruction = true,
    testUsage = true,
    testCompleteRun = true,
    testExtending = true;

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
        var file = fs.createWriteStream(__dirname + '/' + cl.name + '.js');

        file.on('close', function () {
            count += 1;

            if (count >= classes.length) {
                runTests();

                classes.forEach(function (cl) {
                    fs.unlink(__dirname + '/' + cl.name + '.js');
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
    var aKlass, aKlassp, jsface, Benchmark,
        JSFacePerson, JSFaceFrenchGuy, JSFaceParisLover,
        AklassPerson, AklassFrenchGuy, AklassParisLover,
        AklasspPerson, AklasspFrenchGuy, AklasspParisLover,
        AklasspcPerson, AklasspcFrenchGuy, AklasspcParisLover,
        suiteConstruction, suite, suiteUsage, suiteExtending,
        jsfaceLover, aklasspcLover, aklassLover, aklasspLover,
        extendObj;

    aKlass = require(__dirname + '/../index').aKlass;
    aKlassp = require(__dirname + '/../aklass-parent').aKlassp;
    aKlasspc = require(__dirname + '/../aklass-proto-chain').aKlass;
    jsface = require(__dirname + '/jsface');
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

    AklassFrenchGuy = AklassPerson.extend({
        initialize: function (name) {
            AklassFrenchGuy.$super.call(this, name);
        },

        setAddress: function (city, street) {
            AklassFrenchGuy.$superp.setAddress.call(this, 'France', city, street);
        }
    });

    AklassParisLover = AklassFrenchGuy.extend({
        initialize: function (name) {
            AklassParisLover.$super.call(this, name);
        },

        setAddress: function (street) {
            AklassParisLover.$superp.setAddress.call(this, 'Paris', street);
        }
    });

    AklasspcPerson = aKlasspc.klass({
        initialize: function (name) {
            this.name = name;
        },

        setAddress: function (country, city, street) {
            this.country = country;
            this.city = city;
            this.street = street;
        }
    });

    AklasspcFrenchGuy = AklasspcPerson.extend({
        initialize: function (name) {
            AklassFrenchGuy.$super.call(this, name);
        },

        setAddress: function (city, street) {
            AklassFrenchGuy.$superp.setAddress.call(this, 'France', city, street);
        }
    });

    AklasspcParisLover = AklasspcFrenchGuy.extend({
        initialize: function (name) {
            AklassParisLover.$super.call(this, name);
        },

        setAddress: function (street) {
            AklassParisLover.$superp.setAddress.call(this, 'Paris', street);
        }
    });

    AklasspPerson = aKlassp.klass({
        initialize: function (name) {
            this.name = name;
        },

        setAddress: function (country, city, street) {
            this.country = country;
            this.city = city;
            this.street = street;
        }
    });

    AklasspFrenchGuy = AklasspPerson.extend({
        initialize: function (name) {
            // AklasspFrenchGuy.$super.call(this, name);
            this.parent(name);
        },

        setAddress: function (city, street) {
            // AklasspFrenchGuy.$superp.setAddress.call(this, 'France', city, street);
            this.parent('France', city, street);
        }
    });

    AklasspParisLover = AklasspFrenchGuy.extend({
        initialize: function (name) {
            // AklasspParisLover.$super.call(this, name);
            this.parent(name);
        },

        setAddress: function (street) {
            // AklasspParisLover.$superp.setAddress.call(this, 'Paris', street);
            this.parent('Paris', street);
        }
    });

    if (testExtending) {
        suiteExtending = new Benchmark.Suite();
        extendObj = {
            foo: function () {
                return 1;
            },
            bar: 2
        };
        suiteExtending
            .add('JS Face extension test', function () {
                var ob = jsface.Class(JSFaceParisLover, extendObj);
            })
            .add('aKlass extension test', function () {
                var ob = AklassParisLover.extend(extendObj);
            })
            .add('aKlass proto chain extension test', function () {
                var ob = AklasspcParisLover.extend(extendObj);
            })
            .add('aKlassp extension test', function () {
                var ob = AklasspParisLover.extend("Mary");
            })
            .on('cycle', function (event) {
                console.log(String(event.target));
            })
            .on('complete', function () {
                console.log('Fastest is ' + this.filter('fastest').pluck('name') + '\n');
            })
            .run();
    }

    if (testConstruction) {
        suiteConstruction = new Benchmark.Suite();
        suiteConstruction
            .add('JS Face construction test', function () {
                var ob = new JSFaceParisLover("Mary");
            })
            .add('aKlass construction test', function () {
                var ob = new AklassParisLover("Mary");
            })
            .add('aKlass proto chain construction test', function () {
                var ob = new AklasspcParisLover("Mary");
            })
            .add('aKlassp construction test', function () {
                var ob = new AklasspParisLover("Mary");
            })
            .on('cycle', function (event) {
                console.log(String(event.target));
            })
            .on('complete', function () {
                console.log('Fastest is ' + this.filter('fastest').pluck('name') + '\n');
            })
            .run();
    }

    if (testUsage) {
        suiteUsage = new Benchmark.Suite();
        jsfaceLover = new JSFaceParisLover("Mary");
        aklassLover = new AklassParisLover("Mary");
        aklasspcLover = new AklasspcParisLover("Mary");
        aklasspLover = new AklasspParisLover("Mary");
        suiteUsage
            .add('JS Face use method test', function () {
                jsfaceLover.setAddress("CH");
            })
            .add('aKlass use method test', function () {
                aklassLover.setAddress("CH");
            })
            .add('aKlass proto chain use method test', function () {
                aklasspcLover.setAddress("CH");
            })
            .add('aKlassp use method test', function () {
                aklasspLover.setAddress("CH");
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
    }

    if (testCompleteRun) {
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
            .add('aKlass proto chain test', function () {
                var ob = new AklasspcParisLover("Mary");
                ob.setAddress("CH");
            })
            .add('aKlassp test', function () {
                var ob = new AklasspParisLover("Mary");
                ob.setAddress("CH");
            })
            .on('cycle', function (event) {
                console.log(String(event.target));
            })
            .on('complete', function () {
                console.log('Fastest is ' + this.filter('fastest').pluck('name') + '\n');
            })
            .run();
    }
}
