var prezly = require('../prezly');

describe('Prezenter', function () {

    var prezenter;
    var view;

    beforeEach(function () {
	prezenter = Object.create(prezly.Prezenter);
	spyOn(prezenter, 'initialize');
	view = {};
    });

    it('prezents a view', function () {
	prezenter.prezent(view);
	expect(prezenter.initialize).toHaveBeenCalledWith(view);
    });

    it('preserves the prezent function on sub', function () {
	var override = jasmine.createSpy('prezent override')
	var p = prezly.Prezenter.sub({
	    prezent: override
	});
	expect(p.prezent).toBe(prezly.Prezenter.prezent);
	expect(p.prezent).not.toBe(override);
    });

});