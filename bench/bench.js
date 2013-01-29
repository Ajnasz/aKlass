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
    var classes, http, https, fs, count;
    classes = [
        {
            name: 'jsface',
            url: 'http://dl.dropbox.com/u/7677927/oop-benchmark/lib/jsface.js'
        },
        {
            name: 'jqueryClass',
            secure: true,
            url: 'https://raw.github.com/rosamez/jQuery.klass/master/jquery.klass.js',
            postprocess: function (data) {
                var str = data.toString('utf8').split('\n'),
                    len = str.length,
                    i = 0;
                while (i < len) {
                    if (str[i].indexOf('MooTools.BOM =') > -1) {
                        while (str[i].indexOf('}())') === -1) {
                            str[i] = '// ' + str[i];
                            i += 1;
                        }
                        str[i] = '// ' + str[i];
                    }
                    i += 1;
                }
                return str.join('\n');
            }
        }
    ];

    http = require('http');
    https = require('https');
    fs = require('fs');

    count = 0;

    function onFileDownloaded() {
        count += 1;
        if (count >= classes.length) {
            callback();

            classes.forEach(function (cl) {
                fs.unlink(__dirname + '/' + cl.name + '.js');
            });
        }
    }

    classes.forEach(function (cl) {
        var file = fs.createWriteStream(__dirname + '/' + cl.name + '.js'), get;

        file.on('close', function () {

            if (cl.postprocess) {
                fs.readFile(__dirname + '/' + cl.name + '.js', function (err, data) {
                    var processed = cl.postprocess(data);
                    fs.writeFile(__dirname + '/' + cl.name + '.js', processed);
                    onFileDownloaded();
                });
            } else {
                onFileDownloaded();
            }
        });

        if (cl.secure) {
            get = https.get;
        } else {
            get = http.get;
        }
        get(cl.url, function (response) {
            response.pipe(file);
        }).on('error', function (er) {
            console.log(er);
            process.exit(1);
        });
    });
}

getJSClasses(runTests);
