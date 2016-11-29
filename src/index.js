/*eslint-env es6*/
var curry = require("curry");
var stringTemplate = require("./string-templating");
var curriedFunc = {};
Object.keys(stringTemplate).forEach(function(element, index) {
    curriedFunc[element] = curry(stringTemplate[element]);
});
var parse = curry(stringTemplate.parse);
stringTemplate = curry(stringTemplate);
Object.assign(stringTemplate, curriedFunc);
module.exports = Object.assign(stringTemplate, { parse: parse });
