var prezly = require('../prezly');

describe('View', function () {

    var view;
    var method_2;

    beforeEach(function () {
	view = Object.create(prezly.View);
	view.signature = ['method_1', 'method_2'];
	method_2 = jasmine.createSpy('method_2');
    });

    it('implements noop methods for all keys in its signature if no implementation is provied', function () {
	var widget = view.implement();
	expect(Object.keys(widget)).toContain('method_1', 'method_2');
	expect(widget.method_1).toBe(prezly.noop);
	expect(widget.method_2).toBe(prezly.noop);
    });

    it('implements provided methods if implementation is provided', function () {
	var widget = view.implement({
	    method_2: method_2
	});
	expect(widget.method_2).toBe(method_2);
	expect(widget.method_1).toBe(prezly.noop);
    });

    it('only implements methods', function () {
	var widget = view.implement({
	    method_2: 42
	});
	expect(widget.method_2).toBe(prezly.noop);
    });

});