var prezly = require('../prezly');

describe('Extendable', function () {
    
    var extendable;
    var extension1;
    var extension2;

    beforeEach(function () {
	spyOn(prezly, 'extend');
	extendable = Object.create(prezly.Extendable);
	extension1 = { one: true };
	extension2 = { two: true };

    });

    it('exends itself', function () {
	extendable.extend(extension1, extension2);
	expect(prezly.extend).toHaveBeenCalledWith(extendable, extension1, extension2);
    });

    it('preserves properties defined in __preserve_on_extend', function () {
	extendable.one = false;
	extendable.two = false;
	extendable.__preserve_on_extend = ['one', 'two'];
	extendable.extend(extension1, extension2);
	expect(prezly.extend).toHaveBeenCalledWith('one two', extendable, extension1, extension2);
	expect(extendable.one).toBe(false);
	expect(extendable.two).toBe(false);
    });

});