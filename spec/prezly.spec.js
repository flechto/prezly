
var prezly = require('../prezly');

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

});
