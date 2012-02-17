var prezly = require('../prezly');


describe('Widget', function () {


    it('is subable', function () {
	var widget = prezly.Widget.sub({
	    subbed: true
	});
	expect(widget.subbed).toBe(true);
    });

    it('emits events', function () {
	var handler = jasmine.createSpy('handler');
	var widget = Object.create(prezly.Widget);
	widget.on('event', handler);
	widget.emit('event');
	expect(handler).toHaveBeenCalled();
    });

});