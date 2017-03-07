// @Export
function parse(option, template, mstring) {
    var keys = [];
    var placeholderPattern = '.*?';
    var escapedTemplate = escapeRegExp(template) + "$";
    var findKeyRegex = /\\\$\\\{([^\\\s\\\:\\\}]*)(?:\\\:([^\\\s\\\:\\\}]+))?\\\}/g;

    // Generate new regex and keep the keys from template
    var newRegexFrmTpl = new RegExp(escapedTemplate.replace(findKeyRegex, function(match, key) {
        keys.push(key);
        var foo = (option[key]) || placeholderPattern;
        return `(${foo})`;
    }), 'g');

    // console.log(newRegexFrmTpl);

    newRegexFrmTpl.lastIndex = 0; // Reset the index before do 'exec' 

    var extractedValues = newRegexFrmTpl.exec(mstring);
    if (!extractedValues || extractedValues.length === 0) {

        if (option && option.throws) {
            throw Error(`Your input string "${mstring}" does not match with the template "${template}"`);
        } else {
            return null;
        }
    }
    //Map the extractedValues to template keys and the return object
    return extractedValues.reduce(mapValuesAndKey(keys), {});
}

// @Export
function reformat(option, oldTempl, newTempl, inputString) {
    if (typeof option === "string") {
        throw new Error("option should not be string");
    }
    var map = parse(option, oldTempl, inputString);
    return substitute(newTempl, addFullMatchValue(map, inputString));
}

// @Util
// Add input string to parsed map of key-values for full match.
function addFullMatchValue(map, str) {
    var fullMatchPattern = '0';
    map && (map[fullMatchPattern] = str);
    return map;
}

// @Util
// Simplified version of Dojo/string.substitute
// TODO: This version just subport 1 level of get property from object
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


// @Util
function mapValuesAndKey(keys) {
    return function(prev, curr, index) {
        if (index === 0) return {};
        prev[keys[index - 1]] = curr;
        return prev;
    };
}

// @Util
function escapeRegExp(str) {
    return str.replace(/[\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

module.exports = Object.assign(parse, { parse: parse, reformat: reformat });
