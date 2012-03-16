var prezly = require('../prezly');


describe('widgets', function () {
    
    var view;
    var prezenter = function (v) {
	v.name('Elvis Presley');
    };
    var name_implementation;

    beforeEach(function () {
	view = prezly.view('name');
	name_implementation = jasmine.createSpy('name_implementation');
    });

    describe('creation', function () {
	
	it('can implement view in the constuctor', function () {

	    var widget = prezly.widget(view, function (instance) {
		instance.name = name_implementation;
	    }, prezenter);
	    
	    var instance = widget();

	    expect(name_implementation).toHaveBeenCalledWith('Elvis Presley');
	    expect(name_implementation.mostRecentCall.object).toBe(instance);

	});

	it('uses the provided implementation', function () {

	    var not_presented = function () {};
	    var widget = prezly.widget(view, {
		name: name_implementation,
		not_presented:  not_presented
	    }, prezenter);

	    var instance = widget();

	    expect(name_implementation).toHaveBeenCalledWith('Elvis Presley');
	    expect(name_implementation.mostRecentCall.object).toBe(instance);
	    expect(instance.not_presented).toBe(not_presented);
	});

    });

});