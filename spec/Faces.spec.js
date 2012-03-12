var prezly = require('../prezly')

describe('Faces', function () {

    var face;
    
    beforeEach(function () {
	face = prezly.face('meth1', 'meth2');
    });

    describe('interface creation', function () {

	it('creates an interface with the provided members', function () {
	    expect(face.keys()).toContain('meth1', 'meth2');
	});

	it('can create an new interface with the newly provide methods', function () {
	    var new_face = face.extend('extension');
	    expect(new_face.keys()).toContain('meth1', 'meth2', 'extension');
	});

    });

    describe('interface implementation', function () {

	it('implements the provided methods', function () {
	    var meth1 = jasmine.createSpy();
	    var impl = face.implement({
		meth1: meth1
	    });
	    expect(impl.meth2).toBe(prezly.noop);
	});

	it('implements noop if no method is provided', function () {
	    var meth1 = jasmine.createSpy();
	    var impl = face.implement({
		meth1: meth1
	    });
	    expect(impl.meth2).toBe(prezly.noop);
	});

    });

    describe('implementation testing', function () {

	it('can be queried for keys', function () {
	    expect(face.keys()).toContain('meth1', 'meth2');
	});

	it('can test if an object implements itself', function () {
	    var object_that_implements = {
		meth1: function () {},
		meth2: function () {},
		another_method: function () {}
	    };
	    var object_that_doesnt_implement = {
		meth2: function () {
		},
		yet_another_method: function () {}
	    };
	    expect(face.is_implemented_by(object_that_implements)).toBe(true);
	    expect(face.is_implemented_by(object_that_doesnt_implement)).toBe(false);
	});

    });

});