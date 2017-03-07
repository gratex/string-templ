var assert = require("./lib/assert.js"); //extended node/assert library

describe("Verify API interface function", function() {
    var extractor = require("../src/index");

    var template = "${username}/${password}@${server}",
        sampleString = "hungton/12456@localhost",
        expectedValue = { username: 'hungton', password: '12456', server: 'localhost' };

    it("Should return extracted Object with valid input and throwable is TRUE", function() {
        assert.sameJSON(extractor({ throws: true }, template, sampleString), expectedValue);
    });

    it("Should return extracted Object with valid input and throwable is FALSE", function() {
        assert.sameJSON(extractor({ throws: false }, template, sampleString), expectedValue);
    });

    it("Should return ERROR with INVALID input template and throwable is TRUE", function() {
        var template = "${username}/${password}@{server}"; //missing ${server}
        assert.throws(
            function() {
                extractor({ throws: true }, template, sampleString);
            }
        );
    });

    it("Should return ERROR with INVALID input template and throwable is TRUE", function() {
        var sampleString = "hungton12456@localhost"; //missing / charater
        assert.throws(
            function() {
                extractor({ throws: true }, template, sampleString);
            }
        );
    });

    it("Should return ERROR with detailed information about input string and template", function() {
        var sampleString = "hungton12456@localhost"; //missing / charater
        var template = "${username}/${password}@{server}"; //missing ${server}
        assert.throws(
            function() {
                extractor({ throws: true }, template, sampleString);
            },
            function(err) {
                var errMsg = err.message;
                if (errMsg.includes(sampleString) && errMsg.includes(template)) {
                    return true;
                }
            }
        );
    });

    it("Should return NULL with INVALID input template and throwable is FALSE", function() {
        var template = "${username}/${password}@{server}"; //missing ${server}
        var expectedValue = null;
        assert.sameJSON(extractor({ throws: false }, template, sampleString), expectedValue);
    });

    it("Should return NULL with INVALID input template and throwable is FALSE", function() {
        var sampleString = "hungton12456@localhost"; //missing / charater
        var expectedValue = null;
        assert.sameJSON(extractor({ throws: false }, template, sampleString), expectedValue);
    });



    it("Should work OK as curry function with this format: f(arg1, arg2, arg3)", function() {
        assert.sameJSON(extractor({ throws: true }, template, sampleString), expectedValue);
    });
    it("Should work OK as curry function with this format: f(arg1, arg2)(arg3)", function() {
        assert.sameJSON(extractor({ throws: true }, template)(sampleString), expectedValue);
    });
    it("Should work OK as curry function with this format: f(arg1)(arg2, arg3)", function() {
        assert.sameJSON(extractor({ throws: true })(template, sampleString), expectedValue);
    });

    it("Should work OK as curry function with this format: f(arg1)(arg2)(arg3)", function() {
        assert.sameJSON(extractor({ throws: true })(template)(sampleString), expectedValue);
    });

    it("Should work OK as curry 'parse' function with this format: f.parse(arg1, arg2, arg3)", function() {
        assert.sameJSON(extractor.parse({ throws: true }, template, sampleString), expectedValue);
    });
    it("Should work OK as curry 'parse' function with this format: f.parse(arg1, arg2)(arg3)", function() {
        assert.sameJSON(extractor.parse({ throws: true }, template)(sampleString), expectedValue);
    });
    it("Should work OK as curry 'parse' function with this format: f.parse(arg1)(arg2, arg3)", function() {
        assert.sameJSON(extractor.parse({ throws: true })(template, sampleString), expectedValue);
    });
    it("Should work OK as curry 'parse' function with this format: f.parse(arg1)(arg2)(arg3)", function() {
        assert.sameJSON(extractor.parse({ throws: true })(template)(sampleString), expectedValue);
    });

    it("extractor has now reformat function", function() {
        var actual = typeof extractor.reformat;
        assert.equal(actual, "function");
    });

    it("Reformat function should also be currified", function() {
        var oldTempl = "${a}--${b}",
            newTempl = "${b}/${a}/${b}",
            inputString = "you--me";

        var reformatWithOption = extractor.reformat({});

        var actual, expected = "me/you/me";
        actual = reformatWithOption(oldTempl, newTempl, inputString);
        assert.sameJSON(actual, expected, "Should work with predefine option");

        var reformatWithOptOldTemplate = reformatWithOption(oldTempl);
        actual = reformatWithOptOldTemplate(newTempl, inputString);
        assert.sameJSON(actual, expected, "Should work with predefine option, oldTemplate");

        var reformatWithOptOldTemplateNewTemplate = reformatWithOptOldTemplate(newTempl);
        actual = reformatWithOptOldTemplateNewTemplate(inputString);
        assert.sameJSON(actual, expected, "Should work with predefine option, oldTemplate, newTemplate #1");

        var reformatWithOptOldTemplateNewTemplate2 = reformatWithOption(oldTempl, newTempl);
        actual = reformatWithOptOldTemplateNewTemplate2(inputString);
        assert.sameJSON(actual, expected, "Should work with predefine option, oldTemplate, newTemplate #2");

        var curry3 = extractor.reformat({}, oldTempl, newTempl);
        actual = curry3(inputString);
        assert.sameJSON(actual, expected, "Should work with predefine option, oldTemplate, newTemplate #2");


    });


});
