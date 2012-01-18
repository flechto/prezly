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

});