/*jslint node: true, nomen: true */
var testClassCreation = false,
    testConstruction = false,
    testUsage = false,
    testCompleteRun = false,
    testExtending = true;

function runTests() {
    "use strict";
    var aKlass, aKlassp, jsface, Benchmark,
        dirname;

    dirname = __dirname;

    Benchmark = require('benchmark');

    if (testClassCreation) {
        require(dirname + '/classCreate.js');
    }

    require(dirname + '/initclasses.js');

    if (testExtending) {
        require(dirname + '/testExtending');
    }

    if (testConstruction) {
        require(dirname + '/testConstruction');
    }


    if (testUsage) {
        require(dirname + '/testUsage');
    }

    if (testCompleteRun) {
        require(dirname + '/testCompleteRun');
    }
}

function getJSClasses(callback) {
    "use strict";
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
                callback();

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

getJSClasses(runTests);
