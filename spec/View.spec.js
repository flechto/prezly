var prezly = require('../prezly');

describe('prezly.view', function () {
    it('creates an object with the provided methods', function () {
	var view = prezly.view('method1 method2');
	expect(view.method1).toBe(prezly.noop);
	expect(view.method2).toBe(prezly.noop);
    });
    it('creates an object that extends EventEmitter', function () {
	var view = prezly.view('method1 method2');
	Object.keys(prezly.EventEmitter).forEach(function (key) {
	    expect(view[key]).toBe(prezly.EventEmitter[key]);
	});
    });
});

