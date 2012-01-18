var prezly = require('../prezly');

describe('Subable', function () {

    var subable;
    var extension;

    beforeEach(function () {
	spyOn(prezly, 'sub');
	subable = Object.create(prezly.Subable);
	extension = {one: false, two: false};
    });

    it('creates a subclass of itself', function () {
	var subbed = subable.sub(extension);
	expect(prezly.sub).toHaveBeenCalledWith(subable, extension);
    });

    it('preserves properties in __preserve_on_sub', function () {
	prezly.extend(subable, {
	    one: true,
	    two: true
	});
	subable.__preserve_on_sub = ['one', 'two']
	subable.sub(extension);
	expect(prezly.sub).toHaveBeenCalledWith('one two', subable, extension);
	expect(subable.one).toBe(true);
	expect(subable.two).toBe(true);
    });

});