var assert = require("./lib/assert.js");

describe("Verify extraction function", function() {

    var extractor = require("../src/string-templating").parse;

    var template = "${username}/${password}@${server}",
        sampleString = "hungton/12456@localhost",
        expectedValue = { username: 'hungton', password: '12456', server: 'localhost' };

    it("Should return extracted object as expected #1", function() {
        template = "${fruit} is cheaper than ${animal}";
        sampleString = "Lemon is cheaper than Dog";
        expectedValue = { fruit: 'Lemon', animal: 'Dog' };
        assert.sameJSON(extractor({}, template, sampleString), expectedValue);
    });

    it("Should return extracted object as expected #2", function() {
        template = "${fruit}////@@@${animal}";
        sampleString = "Lemon////@@@Dog";
        expectedValue = { fruit: 'Lemon', animal: 'Dog' };
        assert.sameJSON(extractor({}, template, sampleString), expectedValue);
    });

    it("Should return extracted object as expected #3", function() {
        template = "!@#$%^&*12345${fruit}.${animal}!@$!@$";
        sampleString = "!@#$%^&*12345Lemon.Dog!@$!@$";
        expectedValue = { fruit: 'Lemon', animal: 'Dog' };
        assert.sameJSON(extractor({}, template, sampleString), expectedValue);
    });

    it("Should return extracted object as expected #4", function() {
        template = "${fruit}.${animal}";
        sampleString = "Lemon.Dog";
        expectedValue = { fruit: 'Lemon', animal: 'Dog' };
        assert.sameJSON(extractor({}, template, sampleString), expectedValue);
    });

    it("Should be able to extract using regex matching pattern", function() {
        var number = "\\d*";
        assert.sameJSON(
            extractor({ "1": number, "2": number, "3": number },
                "${1}${sometext}/${2}${sometext}/${3}${sometext}/def.js",
                "1505-any-text/1519-other-test/15151-something-else/def.js"), { "1": '1505', "2": '1519', "3": '15151', "sometext": "-something-else" });
    });

    it("Should get the whole string into object property", function() {
        var sampleLine = "-rw-rw-r--   1 htonthanh htonthanh  3179 Nov 25 10:23 init";
        assert.sameJSON(extractor({}, "${1}", sampleLine), { "1": "-rw-rw-r--   1 htonthanh htonthanh  3179 Nov 25 10:23 init" });
    });
});
