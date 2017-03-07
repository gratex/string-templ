var assert = require("./lib/assert.js");
var extractor = require("../src/string-templating");

describe("Verify reformat function", function() {

    it("Should be able to reformat string #1", function() {
        var r = extractor.reformat({}, "${a}/${b}", "${b}-${a}", "test/me");
        assert.equal(r, "me-test");
    });

    it("Should be able to reformat string #2 with full match", function() {
        var r = extractor.reformat({}, "${1} and ${2}", "${2} scares ${1} (${0} tales)", "dog and cat");
        assert.equal(r, "cat scares dog (dog and cat tales)");
    });

    it.skip("motivation - ES6 replace version", function() {
        // explains the motivaton
        // this is how you would write it in pure ES
        assert.equal(
            "1505-any-text/1519-other-test/15151-something-else/def.js".replace(
                /^(.*?)-(.*)\/(.*?)-(.*)\/(.*?)-(.*)\/def.js$/, //easy to write, diffictlt to read
                "$1/$3/$5/def.js"
            ), "1505/1519/15151/def.js");
        // can we make library that solves this problems ?
    });
    it.skip("motivation - ES6 replace version 1", function() {
        // we could use named variables instead of grups
        // this makes it more readable
        var n1 = "(.*?)";
        var n2 = "(.*?)";
        var n3 = "(.*?)"; //FIXME: ugly scoped variables
        assert.equal(
            "1505-any-text/1519-other-test/15151-something-else/def.js".replace(
                new RegExp(`^${n1}-(.*)\/(.*?)-(.*)\/(.*?)-(.*)\/def.js$`),
                "$1/$3/$5/def.js" // FIXME: In JS we can not name the captured group (https://goo.gl/34E4Ll)
            ), "1505/1519/15151/def.js");
    });
    it.skip("motivation - ES6 replace version (how good can we make it?)", function() {
        // can we make ES6 replace version 1 even better ?
        // new RegExp(substitute("${n1}-${garbage}/${n2}-${garbage}/${n3}-${garbage}/def.js"));
        // // (.*)
        // 
        // 
        // var substitute = function(t, o) {

        // }
        // new RegExp(substitute("${n1}-${garbage}/${n2}-${garbage}/${n3}-${garbage}/def.js", {
        //     n1: "(.*?)",
        //     n2: "(.*?)",
        //     n3: "(.*)"
        // }));
        // 
        // TODO: I dont know what to do here, please remind me ;(
    });

    it.skip("motivation - pure ES6, ugly, bad perforance hack to create look-alike subtitution method)", function() {

        // This ugly because we violately read more here https://goo.gl/eyXzI4
        // For experiment only
        /* jshint ignore:start */
        var substitute = (t, m) => {
            with(m) {
                return eval(`\`${t}\``);
            }
        };

        assert.equal(substitute("${n1}-${garbage}/${n2}-${garbage}/${n3}-${garbage}/def.js", {
            n1: "1234",
            n2: "5678",
            n3: "90",
            garbage: "garbage-text"
        }), "1234-garbage-text/5678-garbage-text/90-garbage-text/def.js");
        /* jshint ignore:end */
    });

    it.skip("motivation - pure ES6, ugly, bad perforance hack to create look-alike subtitution method #2)", function() {
        // This is ugly because we can 'What if object prooerty is named with malicious "code". You will execute it. Injection, unsecure'
        // For experiment only
        /* jshint ignore:start */
        var substitute = (t, o) => (eval("({" + Object.keys(o).join(',') + "}=o)"),
            eval("`" + t + "`"));
        assert.equal(substitute("${n1}-${garbage}/${n2}-${garbage}/${n3}-${garbage}/def.js", {
            n1: "1234",
            n2: "5678",
            n3: "90",
            garbage: "garbage-text"
        }), "1234-garbage-text/5678-garbage-text/90-garbage-text/def.js");
        /* jshint ignore:end */

    });

    it("non-greedy is standard behavior", function() {
        assert.equal(
            extractor.reformat({},
                "${n1}-${garbage}/${n2}-${garbage}/${n3}-${garbage}/def.js", //orig
                "${n1}/${n2}/${n3}/def.js", // new
                "1505-any-text/1519-other-test/15151-something-else/def.js" //input
            ), "1505/1519/15151/def.js"); //expected

    });
    it("greedy - uo can customize regexp for each named parameter", function() {
        // easiest version

        assert.equal(
            extractor.reformat({
                    n1: ".*",
                    n2: ".*",
                    n3: ".*",
                    //throws:false
                },
                "${n1}-${garbage}/${n2}-${garbage}/${n3}-${garbage}/def.js", //orig
                "${n1}/${n2}/${n3}/def.js", // new
                "1505-any-text/1519-other-test/15151-something-else/def.js" //input
            ), "1505-any/1519-other/15151-something/def.js"); //expected
    });
    it("non-greedy - uo can customize regexp for each named parameter", function() {
        // easiest version

        assert.equal(
            extractor.reformat({
                    n1: ".*",
                    // n2: "(.*?)",
                    // n3: "(.*?)",
                    //throws:false
                },
                "${n1}-${garbage}/${n2}-${garbage}/${n3}-${garbage}/def.js", //orig
                "${n1}/${n2}/${n3}/def.js", // new
                "1505-any-text/1519-other-test/15151-something-else/def.js" //input
            ), "1505-any/1519/15151/def.js"); //expected
    });

    it("Should be error if the template is not valids and throws true", function() {
        var sampleLine = "---rw-rw-r--   1 htonthanh htonthanh  3179 Nov 25 10:23 init";
        assert.throws(function() {
            extractor.reformat({ throws: true }, "${permis} -${garbage}", "${permis}", sampleLine);
        });
    });

    it("Should not be error if the template is not valids and throws false", function() {
        var sampleLine = "";
        assert.equal(
            extractor.reformat({},
                "${permis} -${garbage}", "${permis}",
                "---rw-rw-r--   1 htonthanh htonthanh  3179 Nov 25 10:23 init"),
            "");
    });

    it("why it not work", function() {
        function substitute(template, map) {
            if (!map) {
                return "";
            }
            return template.replace(/\$\{([^\s\:\}]*)(?:\:([^\s\:\}]+))?\}/g,
                function(match, key) {
                    if (key === '') {
                        return '$';
                    }
                    return map[key];
                });
        }

        //console.log(substitute("${some test}---", { "some test": 102 }));

        assert.equal(extractor.reformat({ throws: true },
                "${right} ${id} ${some-number}",
                "${right}",
                "drwxrwxr-x 180 htonthanh htonthanh 20480 Nov 25 10:35 node_modules"),
            "drwxrwxr-x");
    });

});
