const assert = require('assert');
const path = require('path');
const r = require('../src/async/r');
const sourceFilePath = path.resolve(__dirname, 'test.R');

describe('Async R wrapper', () => {
    it('should correctly add two numbers', async () => {
        let params = [2, 3];
        let output = await r(sourceFilePath, 'add', params)
        return assert.equal(output, 5);
    });

    it('should correctly reverse an array', async () => {
        let params = [['a', 'b', 'c']];
        let output = await r(sourceFilePath, 'reverse', params)
        return assert.deepEqual(output, ['c', 'b', 'a']);
    });

    it('should correctly throw an exception', () => {
        return assert.rejects(_ => r(sourceFilePath, 'throwException'));
    });
});