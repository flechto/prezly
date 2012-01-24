var prezly = require('../prezly');

describe('Collection', function () {

    var collection;
    var handler;

    beforeEach(function () {
	collection = prezly.Collection.create();
	handler = jasmine.createSpy('handler');
    });

    it('is empty when created if no items are passed', function () {
	collection = prezly.Collection.create();
	expect(collection.empty()).toBe(true);
    });

    it('can be created from an array', function () {
	var collection_from_array = collection.fromArray([1, 2, 3]);
	expect(collection_from_array).not.toBe(collection);
	expect(collection_from_array.get()).toEqual([1, 2, 3]);
    });

    it('is not empty when it contains objects', function () {
	collection.append(1);
	expect(collection.empty()).toBe(false);
    });

    it('contains all items passed in when created', function () {
	collection = prezly.Collection.create(1, 2, 3);
	expect(collection.count()).toBe(3);
	expect(collection.get()).toEqual([1, 2, 3])
    });

    it('can append an item to the end', function () {
	collection.append(1);
	expect(collection.last()).toBe(1)
    });

    it('can append multiple items', function () {
	collection.append(1, 2, 3);
	expect(collection.count()).toBe(3);
	expect(collection.get()).toEqual([1, 2, 3]);
    });

    it('can retrieve the first item', function () {
	collection.append('first', 'last');
	expect(collection.first()).toBe('first');
    });

    it('can retrieve the last item', function () {
	collection.append('first');
	collection.append('last');
	expect(collection.last()).toBe('last');
    });

    it('can retrieve items by index', function () {
	collection.append(1, 2, 3);
	expect(collection.get(1)).toBe(2);
    });

    it('can insert an item at a specific index', function () {
	collection.append(1, 2, 3);
	collection.insert('inserted', 1);
	expect(collection.get(1)).toEqual('inserted');
    });

    it('can have a specific item removed', function () {
	collection.append(1, 2, 3);
	collection.removeItem(2);
	expect(collection.get()).toEqual([1, 3]);
    });

    it('can remove an item a specific index', function () {
	collection.append(4, 5, 6);
	collection.removeAt(1);
	expect(collection.get()).toEqual([4, 6])
    });

    it('emits an event when an item is added', function () {
	var obj1 = {obj: 1};
	var obj2 = {obj: 2};
	collection = prezly.Collection.create(1, 2, 3);
	collection.on('add', handler);
	collection.insert(obj1, 1);
	expect(handler).toHaveBeenCalledWith(obj1, 1)
	handler.reset();
	collection.append(obj2);
	expect(handler).toHaveBeenCalledWith(obj2, collection.count() - 1);
    });

    it('emits an event when an item is removed', function () {
	collection.append(1, 2, 3, 4, 5, 6);
	collection.on('remove', handler);
	collection.removeItem(3);
	expect(handler).toHaveBeenCalledWith(3, 2);
	handler.reset();
	collection.removeAt(1);
	expect(handler).toHaveBeenCalledWith(2, 1);
    });

    it('supports forEach functionality', function () {
    });

    it('supports map functionality', function () {
    });

    it('supports reduce', function () {
    });

    it('supports filter', function () {
    });

});