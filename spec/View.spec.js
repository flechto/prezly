var prezly = require('../prezly');


describe('prezly.view', function () {

    beforeEach(function () {
	this.addMatchers({
	    toContainEach: function (a) {
		if (typeof this.actual.indexOf !== 'function') {
		    this.message = function () {
			return 'Expected actual to be an array but was ' + this.actual;
		    }
		    return false
		}
		for (var i = 0; i < a.length; ++i) {
		    if (this.actual.indexOf(a[i]) < 0) {
			this.message = function () {
			    return 'Expected ' + this.actual + ' to contain all items in ' + a;
			};
			return false;
		    }
		}
		return true;
	    }
	});
    });

    it('creates an face extending  fEventEmitter', function () {
	var view = prezly.view('hello');
	expect(view.keys()).toContainEach(prezly.EventEmitterFace.keys());
	expect(view.keys()).toContain('hello');
    });

});

