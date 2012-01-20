var prezly = require('../prezly');


describe('Widget', function () {

    it('is creatable', function () {
	spyOn(prezly.Widget, 'initialize');
	var widget = prezly.Widget.create();
	for (var p in prezly.Widget) 
	    expect(widget[p]).toBe(prezly.Widget[p]);
	expect(widget.initialize).toHaveBeenCalled();
    });

    it('is subable', function () {
	var widget = prezly.Widget.sub({
	    subbed: true
	});
	expect(widget.subbed).toBe(true);
    });

    it('emits events', function () {
	var handler = jasmine.createSpy('handler');
	var widget = prezly.Widget.create();
	widget.on('event', handler);
	widget.emit('event');
	expect(handler).toHaveBeenCalled();
    });

});