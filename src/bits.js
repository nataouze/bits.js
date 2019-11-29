var BigInteger = require('big-integer');

BigInteger.maxValue = function (nbBits) {
    return BigInteger(1).shiftLeft(nbBits).minus(1);
}

function validateLayout(layout) {
    if (layout.length == 0) {
        throw new Error("Empty layout");
    }
    for (var i = 0; i < layout.length; i++) {
        var field = layout[i];
        if (isNaN(field.bits) || field.bits <= 0) {
            // throw new Error(`Invalid bits value in layout field '${field.name}': ${field.bits}`);
            throw new Error("Invalid bits value in layout field '" + field.name + "': " + "field.bits");
        }
    }
}

function validateObject(layout, object) {
    validateLayout(layout);
    var keys = Object.keys(object);
    if (layout.length != keys.length) {
        // throw new Error(`Different number of fields in object (${keys.length}) and layout (${layout.length})`);
        throw new Error("Different number of fields in object (" + keys.length + ") and layout ("+ layout.length +")");
    }

    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (object[key].isNegative() && !object[key].isZero()) {
            // throw new Error(`Value for '${key}' is negative`);
            throw new Error("Value for '" + key + "' is negative");
        }
    }

    for (var i = 0; i < layout.length; i++) {
        var field = layout[i];
        if (!object.hasOwnProperty(field.name)) {
            // throw new Error(`Field '${field.name}' not found in object`);
            throw new Error("Field '" + field.name + "' not found in object");
        }
        var value = object[field.name];
        var maxValue = BigInteger.maxValue(field.bits);
        if (value.greater(maxValue)) {
            // throw new Error(`Invalid value for field '${field.name}': ${value.toString()} > ${maxValue.toString()}`);
            throw new Error("Invalid value for field '" + field.name + "': " + value.toString() + " > " + maxValue.toString());
        }
    }
}

function validateBigint(layout, bigint) {
    validateLayout(layout);
    var totalBits = layout.reduce( function (acc, curr) { return acc + curr.bits;}, 0);
    var maxValue = BigInteger.maxValue(totalBits);
    if (bigint.greater(maxValue)) {
        // throw new Error(`Packed value is too big for layout (max: ${maxValue.toString()} actual: ${this.bigint.toString()})`);
        throw new Error("Packed value is too big for layout (max: " + maxValue.toString() + " actual: " + bigint.toString() + ")");
    }
}

function encode(layout, object) {
    validateObject(layout, object);
    var bigint = BigInteger();
    var currentBit = 0;
    for (var i = 0; i < layout.length; i++) {
        var field = layout[i];
        var value = object[field.name];
        value = value.shiftLeft(currentBit);
        bigint = bigint.or(value);
        currentBit += field.bits;
    }
    return bigint;
}

function decode(layout, bigint) {
    validateBigint(layout, bigint);
    var object = {}, currentBit = 0;
    for (var i = 0; i < layout.length; i++) {
        var field = layout[i];
        var mask = BigInteger.maxValue(field.bits).shiftLeft(currentBit);
        var value = bigint.and(mask).shiftRight(currentBit);
        object[field.name] = value;
        currentBit += field.bits;
    }

    return object;
}

module.exports = {
    encode: encode,
    decode: decode
}
