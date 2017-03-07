#!/usr/bin/env node

// example:
// ls -1 | node ./bin/string-templ.js '${all}' 'X-${all}-Y'
// ls -1 | node ./bin/string-templ.js '${all}' 'X-${all}-Y' '{"all":"(\d*)]"}'
// ls -1 | node ./bin/string-templ.js -f '${1}.${garb}' -t '${1} - ${0}'
const VERSION = "0.0.1";

var program = require("commander");

program
    .version(VERSION)
    .usage('[options] text')
    .option('-f, --from <old-template-text>', 'from template')
    .option('-t, --to <new-template-text>', 'to template')
    .option('-m, --regex-map <json-format-regex-map>', 'a map for matching pattern with key')
    .option('-e, --throws <boolean>', 'verbosely throw exception', parseBoolean)
    .description(`Example: 
        string-templ -f '\${1} and \${2}' -t '\${2} scares \${1}' 'dog and bird and cat' //bird and cat scares dog
        string-templ -f '\${1} and \${2}' -t '\${2} scares \${1} (\${0} tales)' 'dog and cat' //cat scares dog (dog and cat tales)
        string-templ -f '\${1} and \${2}' -m '{"1":".*"}' -t '\${2} scares \${1}' 'dog and bird and cat' //cat scares dog and bird`);


program.parse(process.argv);

if (!program.from || !program.to) {
    program.help();
    process.exit(1);
}

var templateFrom = program.from;
var templateTo = program.to;
var params = program.regexMap ? JSON.parse(program.regexMap) : {};
Object.assign(params, { "throws": program.throws });
var transf = require("../src/index").reformat(params, templateFrom, templateTo);

// Process with args
var counter = program.args.length;
program.args.forEach(function(element, index) {
    console.log(transf(element));
    if (--counter === 0) { process.exit(0); }
});

// Process with pipeline
var byline = require("byline");
byline(process.stdin /*,{keepEmptyLines:true}*/ ) //
    .on("data", function(line) {
        // console.log(line+"");
        console.log(transf(line + ""));
    }).on("end", function() {
        // process.exit(0);
    });

// @Util
function parseBoolean(value) {
    return value.toLowerCase() === "true";
}
