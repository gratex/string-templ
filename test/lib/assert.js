// this is sample how you can extend standard assert library 
// this is inspired by d3/test/assert.js

var assert = require("assert");

assert = module.exports = Object.create(assert);

assert.sameJSON = function(actual, expected, message) {
	if (JSON.stringify(actual) !== JSON.stringify(expected)) {
		assert.fail(actual, expected, message, "===");
	}
};