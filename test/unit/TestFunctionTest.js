const { expect } = require('chai');
const { TestFunction } = require('../../lib/index');

describe('TestFunction', function () {

    it('check TestFunction return values', function () {
        expect(TestFunction(5)).to.equal('TestFunction value is 5');
    });
});
