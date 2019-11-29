# bits.js:

Conveniently encode and decode arbitrary-length binary data in BigIntegers.
This can be useful to compress data for storage optimisation. For example, storing data is expensive on Ethereum and one may want to tightly data in 256 bits chunks.

Examples:
- Store data related to a network request, on 128 bits
```js
var layout = [
    {name: "reqid", bits: 32}, // 0-31
    {name: "ipv4",  bits: 32}, // 32-63
    {name: "ipv6",  bits: 64}  // 64-127
]

const object = {
    reqid: BigInt(/* value */),
    ipv4:  BigInt(/* value */),
    ipv6:  BigInt(/* value */)
}
```


## Usage

### Install
```
npm install bits
```

### Define a Layout
```js
var bits = require('bits');
var BigInteger = require('big-integer'); // to enable platforms not supporting native BigInt

var layout = [
    { name: "x", bits: 514 },
    { name: "y", bits: 56 },
    { name: "z", bits: 32 }
];
```

### Encode an object into a BigInteger
```js
var packed = bits.encode(layout, {
    x: BigInteger(123456789),
    y: bits.maxValue(56),
    z: BigInteger()
});
console.log(`0x${packed.toString(16)}`);
// 0x7fffffffffffff875bcd15
```

### Decode a BigInteger into an object
```js
const unpacked = bits.decode(layout,  BigInteger('FFF00FFFFFF00FFFFFFFFFF', 16));
console.log(JSON.stringify(unpacked));
// {"object":{"x":"2147483647","y":"71496843107631615","z":"31"}}
```


## API

### - ```bits.encode(layout, object)```
  - returns the encoded BigInteger
  - throws if `layout` is invalid or if `object` is not compatible with `layout`

### - ```bits.decode(layout, bigint)```
  - returns the decoded object
  - throws if `layout` is invalid or if `bigint` is not compatible with `layout`

### - ```BigInteger.maxValue(nbBits)```
  - returns the max integer value which can be encoded on `nbBits`
