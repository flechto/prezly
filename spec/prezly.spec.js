
var prezly = require('../prezly');

describe('Basic Usage', function () {

    it('implements the model/view/presenter pattern', function () {
	
	// create a model with the attributes 'name' and 'age'
	var PersonModel = prezly.model('name age');

	// create an interface for the view to display the name and age of a person
	var PersonView = prezly.view('name', 'age');

	// create a prezenter to update the view when the model changes
	var prezentPerson = function (view) {
	    
	    // get or create an instance of the person model
	    var person = Object.create(PersonModel);

	    // handle the change event to update the view
	    person.on('change', function (attribute, new_value, old_value) {
		switch (attribute) {
		case 'name':
		    view.name(new_value);
		    break;
		case 'age':
		    view.age(new_value);
		    break;
		};
	    });

	    // update the models attributes - this should make the model emit the change event
	    person.name('Elvis Presley');
	    person.age(42);
	}

	// create an empty implementation of the view
	var personViewInstance = PersonView.implement({});

	// spy on the view
	spyOn(personViewInstance, 'name');
	spyOn(personViewInstance, 'age');

	// present the view
	prezentPerson(personViewInstance);

	// test the prezenter output
	expect(personViewInstance.name).toHaveBeenCalledWith('Elvis Presley');
	expect(personViewInstance.age).toHaveBeenCalledWith(42);


/*
	var personWidget = prezly.widget(PersonView, prezentPerson, function (element, widget) {
	    widget.name = function (name) {
		//$('.name', element).text(name);
	    };
	    wiget.age = function (age) {
		//$('.age', element).text(age)
	    };
	});

	spyOn(personWidget.view, 'age');
	spyOn(personWidget.view, 'name');
	var pw = personWidget('#TheKing');
	expect(pw.name).toHaveBeenCalledWith('Elvis Presley');
	expect(pw.age).toHaveBeenCalledWith(42);

*/
    });

});

describe('prezly.extend', function () {

    it('extends the first object with the second', function () {
	var obj1 = { prop1: 'prop1' };
	var obj2 = { prop2: 'prop2' };
	prezly.extend(obj1, obj2);
	expect(obj1.prop1).toEqual('prop1');
	expect(obj1.prop2).toBeDefined();
	expect(obj1.prop2).toEqual('prop2');
    });

    it('returns the extended object', function () {
	var obj1 = { prop1: 'prop1' };
	var obj2 = { prop2: 'prop2' };
	var obj3 = prezly.extend(obj1, obj2);
	expect(obj3).toBe(obj1);
    });

    it('extends with all objects passed in', function () {
	var obj1 = { prop1: 'prop1' };
	var obj2 = { prop2: 'prop2' };
	var obj3 =  { prop3: 'prop3' };
	prezly.extend(obj1, obj2, obj3);
	expect(obj1.prop2).toBeDefined();
	expect(obj1.prop3).toBeDefined();
    });

    it('preservers the properties in the first argument if it is a string', function () {
	var obj1 = {
	    prop1: 'prop1',
	    prop2: 'prop2',
	    prop3: 'prop3'
	};
	var extended = prezly.extend('prop1 prop2', obj1, {
	    prop1: 'prop1_extended',
	    prop2: 'prop2_extended',
	    prop3: 'prop3_extended'
	})
	expect(extended).toBe(obj1);
	expect(extended.prop1).toEqual('prop1');
	expect(extended.prop2).toEqual('prop2');
	expect(extended.prop3).toEqual('prop3_extended');
    });

    it('preservers all the properties if the first argument true', function () {
	var obj1 = {
	    prop1: 'prop1',
	    prop2: 'prop2',
	    prop3: 'prop3'
	};
	var extended = prezly.extend(true, obj1, {
	    prop1: 'prop1_extended',
	    prop2: 'prop2_extended',
	    prop3: 'prop3_extended'
	})
	expect(extended).toBe(obj1);
	expect(extended.prop1).toEqual('prop1');
	expect(extended.prop2).toEqual('prop2');
	expect(extended.prop3).toEqual('prop3');
    });

});


describe('prezly.sub', function () {

    it('returns a new object with origional as prototype', function () {
	var proto = { is_proto: true };
	var sub = prezly.sub(proto);
	expect(sub).not.toBe(proto);
	expect(sub).toEqual(proto);
	expect(sub.is_proto).toBe(proto.is_proto);
    });

    it('extends the new object with the extensions', function () {
	var proto = { is_proto: true };
	var extension1 = { is_extended_once: true };
	var extension2 = { is_extended_twice: true };
	var sub = prezly.sub(proto, extension1, extension2);
	expect(sub.is_extended_once).toBe(true);
	expect(sub.is_extended_twice).toBe(true);
    });

    it('preservers the properties in the first argument if it is a string', function () {
	var obj1 = {
	    prop1: 'prop1',
	    prop2: 'prop2',
	    prop3: 'prop3'
	};
	var extended = prezly.sub('prop1 prop2', obj1, {
	    prop1: 'prop1_extended',
	    prop2: 'prop2_extended',
	    prop3: 'prop3_extended'
	})
	expect(extended.prop1).toEqual('prop1');
	expect(extended.prop2).toEqual('prop2');
	expect(extended.prop3).toEqual('prop3_extended');
    });

    it('preservers all the properties if the first argument true', function () {
	var obj1 = {
	    prop1: 'prop1',
	    prop2: 'prop2',
	    prop3: 'prop3'
	};
	var extended = prezly.sub(true, obj1, {
	    prop1: 'prop1_extended',
	    prop2: 'prop2_extended',
	    prop3: 'prop3_extended'
	})
	expect(extended.prop1).toEqual('prop1');
	expect(extended.prop2).toEqual('prop2');
	expect(extended.prop3).toEqual('prop3');
    });

});

describe('makeArray', function () {

    it('converts arguments object to a true array', function () {
	var a = (function () {
	    return prezly.makeArray(arguments);
	})(1, 2, 3);
	expect(a).toEqual([1, 2, 3]);
    });

});

describe('curry', function () {
    it('returns a function that will call the provide function with the provied arguments and '+
       'any additional arguments passed to the curried function', function () {
	   var original = jasmine.createSpy('original');
	   var curried = prezly.curry(original, 'arg1');
	   curried('arg2', 'arg3');
	   expect(original).toHaveBeenCalledWith('arg1', 'arg2', 'arg3');
       });
    it('returns the results of the original function when called', function () {
	var add = function (x, y) { return x + y; };
	var add5 = prezly.curry(add, 5);
	expect(add5(2)).toBe(7);
    });
});