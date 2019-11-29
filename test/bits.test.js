let expect = require('chai').expect;
let BigInteger = require('big-integer')
var bits = require('../src')
var assertEncodeDecodeEquivalence = require('./helpers').assertEncodeDecodeEquivalence;
var assertDecodeEncodeEquality = require('./helpers').assertDecodeEncodeEquality;

describe('bits', function () {

    describe('encoding & decoding behaviour', function () {

        describe('Encode and decode with compatible object and layout', function () {
            it('should work with a single-field 1-bit layout', function () {
                const layout = [
                    { name: "x", bits: 1 }
                ];
                assertEncodeDecodeEquivalence(layout, { x: BigInteger() });
                assertEncodeDecodeEquivalence(layout, { x: BigInteger(1) });
            });

            it('should work for a single-field 256-bits layout', function () {
                const layout = [
                    { name: "x", bits: 256 }
                ];
                assertEncodeDecodeEquivalence(layout, { x: BigInteger() });
                assertEncodeDecodeEquivalence(layout, { x: BigInteger(1) });
                assertEncodeDecodeEquivalence(layout, { x: BigInteger(123456789) });
                assertEncodeDecodeEquivalence(layout, { x: BigInteger.maxValue(256) });
            });

            it('should work for a single-field > 256-bits layout', function () {
                const layout = [
                    { name: "x", bits: 1029 }
                ];
                assertEncodeDecodeEquivalence(layout, { x: BigInteger() });
                assertEncodeDecodeEquivalence(layout, { x: BigInteger(1) });
                assertEncodeDecodeEquivalence(layout, { x: BigInteger(123456789) });
                assertEncodeDecodeEquivalence(layout, { x: BigInteger.maxValue(256) });
                assertEncodeDecodeEquivalence(layout, { x: BigInteger.maxValue(1029) });
            });

            it('should work with a multiple-fields < 256-bits layout', function () {
                const layout = [
                    { name: "x", bits: 126 },
                    { name: "y", bits: 65 },
                    { name: "z", bits: 63 }
                ];
                assertEncodeDecodeEquivalence(layout, {
                    x: BigInteger(123456789),
                    y: BigInteger(),
                    z: BigInteger.maxValue(63)
                });
                assertEncodeDecodeEquivalence(layout, {
                    y: BigInteger(),
                    z: BigInteger.maxValue(63),
                    x: BigInteger(123456789)
                });
            });

            it('should work with a multiple-fields 256-bits layout', function () {
                const layout = [
                    { name: "x", bits: 128 },
                    { name: "y", bits: 65 },
                    { name: "z", bits: 63 }
                ];
                assertEncodeDecodeEquivalence(layout, {
                    x: BigInteger(123456789),
                    y: BigInteger(),
                    z: BigInteger.maxValue(63)
                });
            });

            it('should work with a multiple-fields > 256-bits layout', function () {
                const layout = [
                    { name: "x", bits: 128 },
                    { name: "y", bits: 543 },
                    { name: "z", bits: 63 }
                ];
                assertEncodeDecodeEquivalence(layout, {
                    x: BigInteger(123456789),
                    y: BigInteger(987654321),
                    z: BigInteger.maxValue(60)
                });
            });

        });

        describe('Decode and encode with compatible bigint and layout', function () {
            it('should work with a single-field 1-bit layout', function () {
                const layout = [
                    { name: "x", bits: 1 }
                ];
                assertDecodeEncodeEquality(layout, BigInteger());
                assertDecodeEncodeEquality(layout, BigInteger(1));
            });

            it('should work for a single-field 256-bits layout', function () {
                const layout = [
                    { name: "x", bits: 256 }
                ];
                assertDecodeEncodeEquality(layout, BigInteger());
                assertDecodeEncodeEquality(layout, BigInteger(1));
                assertDecodeEncodeEquality(layout, BigInteger(123456789));
                assertDecodeEncodeEquality(layout, BigInteger.maxValue(256));
            });

            it('should work for a single-field > 256-bits layout', function () {
                const layout = [
                    { name: "x", bits: 764 }
                ];
                assertDecodeEncodeEquality(layout, BigInteger());
                assertDecodeEncodeEquality(layout, BigInteger(1));
                assertDecodeEncodeEquality(layout, BigInteger(123456789));
                assertDecodeEncodeEquality(layout, BigInteger.maxValue(764));
            });

            it('should work with a multiple-fields < 256-bits layout', function () {
                const layout = [
                    { name: "x", bits: 10 },
                    { name: "y", bits: 1 },
                    { name: "z", bits: 10 }
                ];
                assertDecodeEncodeEquality(layout, BigInteger());
                assertDecodeEncodeEquality(layout, BigInteger(1));
                assertDecodeEncodeEquality(layout, BigInteger(123456));
                assertDecodeEncodeEquality(layout, BigInteger.maxValue(21));
            });

            it('should work with a multiple-fields 256-bits layout', function () {
                const layout = [
                    { name: "x", bits: 128 },
                    { name: "y", bits: 64 },
                    { name: "z", bits: 64 }
                ];
                assertDecodeEncodeEquality(layout, BigInteger());
                assertDecodeEncodeEquality(layout, BigInteger(1));
                assertDecodeEncodeEquality(layout, BigInteger(123456789));
                assertDecodeEncodeEquality(layout, BigInteger.maxValue(256));
            });

            it('should work with a multiple-fields > 256-bits layout', function () {
                const layout = [
                    { name: "x", bits: 128 },
                    { name: "y", bits: 234 },
                    { name: "z", bits: 531 }
                ];
                assertDecodeEncodeEquality(layout, BigInteger());
                assertDecodeEncodeEquality(layout, BigInteger(1));
                assertDecodeEncodeEquality(layout, BigInteger(123456789));
                assertDecodeEncodeEquality(layout, BigInteger.maxValue(893));
            });
        });
    });

    describe('failure cases', function () {
        describe('invalid layout', function () {
            it('should throw when the layout is empty', function () {
                const layout = [];
                expect(() => bits.encode(layout, {})).to.throw();
                expect(() => bits.decode(layout, BigInteger())).to.throw();
            });

            it('should throw when the layout has invalid bits', function () {
                const layout = [
                    { name: "x", bits: 0 }, // 0 NOK
                    { name: "y", bits: 16 },
                ];
                expect(() => bits.encode(layout, { x: BigInteger(), y: BigInteger() })).to.throw();
                expect(() => bits.decode(layout, BigInteger())).to.throw();
            });
        });

        describe('invalid object', function () {
            it('should throw when values are not of type BigInteger', function () {
                const layout = [
                    { name: "x", bits: 32 }
                ];
                expect(() => bits.encode(layout, { x: 0 })).to.throw();
                expect(() => bits.encode(layout, { x: "asd" })).to.throw();
                expect(() => bits.encode(layout, { x: [] })).to.throw();
                expect(() => bits.encode(layout, { x: {} })).to.throw();
                expect(() => bits.encode(layout, { x: undefined })).to.throw();
                // ...
            });

            it('should throw if the layout is incompatible', function () {
                const object = {
                    x: BigInteger(0),
                    y: BigInteger(125),
                    z: BigInteger('FFFFFAAAAAE3456', 16)
                };
                expect(() => bits.encode([
                    { name: "x", bits: 128 },
                    { name: "z", bits: 64 }
                ], object)).to.throw();
                expect(() => bits.encode([
                    { name: "a", bits: 128 },
                    { name: "x", bits: 128 },
                    { name: "y", bits: 16 },
                    { name: "z", bits: 48 }
                ], object)).to.throw();
                expect(() => bits.encode([
                    { name: "x", bits: 128 },
                    { name: "yy", bits: 64 },
                    { name: "z", bits: 64 }
                ], object)).to.throw();
            });

            it('should throw if values overflow', function () {
                const object = {
                    x: BigInteger(0),
                    y: BigInteger(125),
                    z: BigInteger('FFFFFAAAAAE3456', 16)
                };
                expect(() => bits.encode([
                    { name: "x", bits: 128 },
                    { name: "y", bits: 120 },
                    { name: "z", bits: 8 }
                ], object)).to.throw();
            });
        });

        describe('invalid bigint', function () {
            it('should throw if value overflows the total layout', function () {
                const layout = [
                    { name: "x", bits: 30 },
                    { name: "x", bits: 69 }
                ];
                expect(() => bits.decode(layout, BigInteger(1).shiftLeft(99))).to.throw();
            });
        });
    });
});
