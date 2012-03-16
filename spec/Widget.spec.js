var prezly = require('../prezly');


describe('Widget', function () {
    
    var view;
    var prezenter = function (v) {
	v.name('Elvis Presley');
    };

    beforeEach(function () {
	view = prezly.view('name');
    });

    describe('creation', function () {
	
	it('can implement view in the constuctor', function () {

	    var name_implementation = jasmine.createSpy('name_implementation');

	    var widget = prezly.widget(view, function (instance) {
		instance.name = name_implementation;
	    }, prezenter);
	    
	    var instance = widget();

	    expect(name_implementation).toHaveBeenCalledWith('Elvis Presley');
	    expect(name_implementation.mostRecentCall.object).toBe(instance);

	});

    });

    xit('is subable', function () {
	var widget = prezly.Widget.sub({
	    subbed: true
	});
	expect(widget.subbed).toBe(true);
    });

    xit('emits events', function () {
	var handler = jasmine.createSpy('handler');
	var widget = Object.create(prezly.Widget);
	widget.on('event', handler);
	widget.emit('event');
	expect(handler).toHaveBeenCalled();
    });

});