var BigInteger = require('big-integer');
var bits = require('./src');

const layout = [
    { name: "x", bits: 31 },
    { name: "y", bits: 56 },
    { name: "z", bits: 32 }
];

const object = {
    x: BigInteger(123456789),
    y: BigInteger.maxValue(56),
    z: BigInteger()
};
const encoded = bits.encode(layout, object);
console.log(`0x${encoded.toString(16)}`);

const bigint = BigInteger('FFF00FFFFFF00FFFFFFFFFF', 16);
const decoded = bits.decode(layout, bigint);
console.log(JSON.stringify(decoded));
