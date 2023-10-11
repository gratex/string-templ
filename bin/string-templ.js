#!/usr/bin/env node

// example:
// ls -1 | node ./src/cli.js '${all}' 'X-${all}-Y'
// ls -1 | node ./src/cli.js '${all}' 'X-${all}-Y' '{"all":"(\d*)]"}'
const VERSION = "1.0.0";

var program = require("commander");

program
  .version(VERSION)
  .usage('[options] text')
  .option('-f, --from <old-template-text>', 'from template')
  .option('-t, --to <new-template-text>', 'to template')
  .option('-m, --regex-map <json-format-regex-map>', 'a map for matching pattern with key')
  .option('-e, --throws <boolean>', 'verbosely throw exception', parseBoolean)
  .option('-o, --original <boolean>', 'return original line if no match (needs -e true)', parseBoolean)
  .description(`Example: 
        string-templ -f '\${1} and \${2}' -t '\${2} scares \${1}' 'dog and bird and cat' //bird and cat scares dog
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
var couter = program.args.length;
program.args.forEach(function(element, index) {
  try {
    console.log(transf(element));
  } catch (ex) {
    if (program.original) {
      console.log(element);
    } else {
      throw ex;
    }
  }
  if (--couter === 0) { process.exit(0); }
});

// Process with pipeline
var byline = require("byline");
byline(process.stdin /*,{keepEmptyLines:true}*/ ) //
  .on("data", function(line) {
    try {
      console.log(transf(line + ""));
    } catch (ex) {
      if (program.original) {
        console.log(line + "");
      } else {
        throw ex;
      }
    }
  }).on("end", function() {
    // process.exit(0);
  });

// @Util
function parseBoolean(value) {
  return value.toLowerCase() === "true";
}