const assert = require('assert');
const path = require('path');
const r = require('../src/r');
const sourceFilePath = path.resolve(__dirname, 'test.R');

describe('R wrapper', () => {
    it('should correctly add two numbers', () => {
        let params = [2, 3];
        let output = r(sourceFilePath, 'add', params)
        assert.equal(output, 5);
    });

    it('should correctly reverse an array', () => {
        let params = [['a', 'b', 'c']];
        let output = r(sourceFilePath, 'reverse', params)
        assert.deepEqual(output, ['c', 'b', 'a']);
    });

    it('should correctly throw an exception', () => {
        assert.throws(() => {
            r(sourceFilePath, 'throwException')
        })
    });
});