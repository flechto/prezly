var prezly = require('../prezly');

describe('Model', function () {

    var model;
    var change_handler;

    beforeEach(function () {
	model = Object.create(prezly.Model);
	change_handler = jasmine.createSpy('change_handler');
    });

    it('can have attributes set', function () {
	model.set('attr_1', true);
	model.set('attr_2', false);
	expect(model.attributes()).toContain('attr_1');
	expect(model.attributes()).toContain('attr_2');
	expect(model.get('attr_1')).toBe(true);
	expect(model.get('attr_2')).toBe(false);
    });

    it('can get a list of all attributes', function () {
 	model.set('attr_1', true);
	model.set('attr_2', false);
	expect(model.attributes()).toContain('attr_1');
	expect(model.attributes()).toContain('attr_2');
   });

    it('can get the value of an attribute', function () {
	model.set('attr_1', true);
	model.set('attr_2', false);
	expect(model.attributes()).toContain('attr_1');
	expect(model.attributes()).toContain('attr_2');
	expect(model.get('attr_1')).toBe(true);
    });

    it('emits a change event when an attribute changes', function () {
	model.on('change', change_handler);
	model.set('attr_1', true);
	expect(change_handler).toHaveBeenCalledWith('attr_1', true, undefined);
	change_handler.reset();
	model.set('attr_1', 1);
	expect(change_handler).toHaveBeenCalledWith('attr_1', 1, true);
    });

});