let assert = require('chai').assert;
var bits = require('../src');

Object.prototype.equivalent = function (other) {
    const thisProps = Object.getOwnPropertyNames(this);
    const otherProps = Object.getOwnPropertyNames(other);

    const length = Object.keys(this).length;
    if (length !== otherProps.length) return false;

    for (let i = 0; i < length; i++) {
        const propName = thisProps[i];
        if (!this[propName].equals(other[propName])) return false;
    }
    return true;
}

function assertEncodeDecodeEquivalence(layout, object) {
    const encoded = bits.encode(layout, object);
    assert(bits.decode(layout, encoded).equivalent(object));
}

function assertDecodeEncodeEquality(layout, bigint) {
    const decoded = bits.decode(layout, bigint);
    assert(bits.encode(layout, decoded).equals(bigint));
}

module.exports = {
    assertEncodeDecodeEquivalence: assertEncodeDecodeEquivalence,
    assertDecodeEncodeEquality: assertDecodeEncodeEquality
}
