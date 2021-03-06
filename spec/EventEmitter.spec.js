var prezly = require('../prezly');

describe('EventEmitter', function () {

    var event_emitter;
    var handler_1, handler2;

    beforeEach(function () {
	event_emitter = Object.create(prezly.EventEmitter)
	handler_1 = jasmine.createSpy('handler_1');
	handler_2 = jasmine.createSpy('handler_2');

    });

    it('can have handlers bound to events', function () {
	event_emitter.on('event', handler_1);
	event_emitter.emit('event');
	expect(handler_1).toHaveBeenCalled();
    });

    it('can have multiple handlers', function () {
	event_emitter.on('event', handler_1);
	event_emitter.on('event', handler_2);
	event_emitter.emit('event');
	expect(handler_1).toHaveBeenCalled();
	expect(handler_2).toHaveBeenCalled();
    });

    it('can have multiple events and only runs handlers bound to event', function () {
	event_emitter.on('event_1', handler_1);
	event_emitter.on('event_2', handler_2);
	event_emitter.emit('event_1');
	expect(handler_1).toHaveBeenCalled();
	expect(handler_2).not.toHaveBeenCalled();
	event_emitter.emit('event_2');
	expect(handler_1.callCount).toEqual(1);
	expect(handler_2).toHaveBeenCalled();
    });

    it('passes the arguments on to the handler', function () {
	event_emitter.on('event_1', handler_1);
	event_emitter.emit('event_1', 1, 2, 3);
	expect(handler_1).toHaveBeenCalledWith(1, 2, 3);
    });

    it('runs the handler in the context of itself', function () {
	event_emitter.on('event_1', handler_1);
	event_emitter.emit('event_1');
	expect(handler_1.mostRecentCall.object).toBe(event_emitter);
    });

    it('triggers an all event after any event', function () {

	event_emitter.on('all', handler_1);

	event_emitter.emit('event', 1, 3);

	expect(handler_1).toHaveBeenCalledWith('event', 1, 3);

    });

});