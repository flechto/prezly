var prezly = require('../prezly');

describe('Prezenter', function () {

    var prezenter;
    var view;

    beforeEach(function () {
	prezenter = Object.create(prezly.Prezenter);
	view = {};
    });

    it('prezents a view', function () {
	prezenter.prezent(view);
    });

});