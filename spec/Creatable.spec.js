var prezly = require('../prezly');

describe('Creatable', function () {

    var creatable;
    var options;
    var initialize;

    beforeEach(function () {
	creatable = Object.create(prezly.Creatable)
	options = { initialize: jasmine.createSpy('options.initialize') };
	creatable.initialize = jasmine.createSpy('initialize');
    });

    it('creates a new instance of itself', function () {
	var obj = creatable.create();
	expect(obj).not.toBe(creatable);
	for (var p in creatable) 
	    expect(obj[p]).toBe(creatable[p]);
    });

    it('sets the options in the new instance', function () {
	var obj = creatable.create(options);
	expect(creatable.options).toBeUndefined();
	expect(obj.options).toBe(options);
    });

    it('calls initialize method if available', function () {
	creatable.create();
	expect(creatable.initialize).toHaveBeenCalled();
    });

    it('passes all arguments on to initialize', function () {
	creatable.create(1, 2, 3);
	expect(creatable.initialize).toHaveBeenCalledWith(1, 2, 3);
    });

    it('sets the last argument as options', function () {
	var obj = creatable.create(1, 2, 3, options);
	expect(obj.options).toBe(options);
    });

});
