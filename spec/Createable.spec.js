var prezly = require('../prezly');

describe('Creatable', function () {

    var creatable;
    var options;

    beforeEach(function () {
	creatable = Object.create(prezly.Creatable)
	options = { initialize: jasmine.createSpy('options.initialize') };
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
	var initialize = jasmine.createSpy('initialize');
	creatable.initialize = initialize;
	creatable.create();
	expect(initialize).toHaveBeenCalled();
    });

});
