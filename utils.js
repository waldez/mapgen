'use strict';

function isIterable(obj) {
    // checks for null and undefined
    if (obj == null) {
        return false;
    }
    return typeof obj[Symbol.iterator] === 'function';
}

function assert(val, msg) {
    if (!val) {
        throw new Error(msg || 'Assertation failed with value: ' + JSON.stringify(val));
    }
}

/**
 * @param {Array.<string|Array>} values
 */
function defineEnum(values) {

    const result = {};
    const unifiedValues = [];
    for (let i = 0; i < values.length; ++i) {
        const value = values[i];
        let index = i;
        let name = value;
        if (Array.isArray(value)) {
            name = value[0];
            index = value[1];
        }
        result[index] = name;
        result[name] = index;
        unifiedValues.push([name, index]);
    }

    result[Symbol.iterator] = function* () { yield* unifiedValues; };

    return result;
}

module.exports = {
    defineEnum,
    assert,
    isIterable
};
