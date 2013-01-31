/*jslint node: true, nomen: true */
var testClassCreation = true,
    testConstruction = true,
    testUsage = true,
    testCompleteRun = true,
    testExtending = true;

var spawn = require('child_process').spawn;
function runTests() {
    "use strict";
    var dirname, tests;

    dirname = __dirname;

    tests = [];

    if (testClassCreation) {
        tests.push(dirname + '/classCreate.js');
    }

    if (testExtending) {
        tests.push(dirname + '/testExtending');
    }

    if (testConstruction) {
        tests.push(dirname + '/testConstruction');
    }

    if (testUsage) {
        tests.push(dirname + '/testUsage');
    }

    if (testCompleteRun) {
        tests.push(dirname + '/testCompleteRun');
    }

    function startTest() {
        if (tests.length > 0) {
            var test = tests.shift(), nodeProcess, log;

            log = require('util').print;

            nodeProcess = spawn('node', [test]);
            log(test + '\n');

            nodeProcess.stdout.on('data', function (data) {
                log(data.toString('utf8'));
            });

            nodeProcess.stderr.on('data', function (data) {
                log(data.toString('utf8'));
            });

            nodeProcess.on('exit', startTest);
        }
    }

    startTest();
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
                // fs.unlink(__dirname + '/' + cl.name + '.js');
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
