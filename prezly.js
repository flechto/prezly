
prezly = exports;

prezly.makeArray = function (obj) {
    return Array.prototype.slice.call(obj, 0);
};

prezly.extend = function (dest, src) {
    var preserve;
    var args = Array.prototype.slice.call(arguments, 1);
    if (typeof dest === 'string') {
	preserve = dest.split(' ');
	dest = args.shift();
    }
    else if (dest === true) {
	dest = args.shift();
	preserve = Object.keys(dest);
    }
    args.forEach(function (arg) {
	Object.keys(arg).forEach(function (key) {
	    if (preserve === undefined || preserve.indexOf(key) === -1) {
		dest[key] = arg[key]
	    }
	});
    });
    return dest;
};

prezly.Extendable = {

    extend: function () {
	var args = Array.prototype.slice.call(arguments, 0);
	args.unshift(this);
	if (this.__preserve_on_extend) {
	    args.unshift(this.__preserve_on_extend.join(' '));
	}
	return prezly.extend.apply(prezly, args);
    }

};


prezly.sub = function (proto) {
    var preserve;
    var sub;
    var args = Array.prototype.slice.call(arguments, 1);
    if (typeof proto === 'string') {
	preserve = proto;
	proto = args.shift();
    }
    else if (proto === true) {
	proto = args.shift();
	preserve = Object.keys(proto).join(' ');
    }
    sub = Object.create(proto);
    args.unshift(sub);
    if (preserve) {
	args.unshift(preserve);
    }
    prezly.extend.apply(prezly, args);
    return sub;
};

var Subable = prezly.Subable = {

    sub: function () {
	var args = Array.prototype.slice.call(arguments, 0);
	args.unshift(this);
	if (this.__preserve_on_sub) {
	    args.unshift(this.__preserve_on_sub.join(' '));
	}
	return prezly.sub.apply(prezly, args);
    }

};

/*
var Creatable = prezly.Creatable = {

    create: function (options) {
	var obj = Object.create(this);
	var args = Array.prototype.slice.call(arguments, 0);
	options = args[args.length - 1];
	obj.options = options;
	obj.initialize && obj.initialize.apply(obj, args);
	return obj;
    }

};

*/

prezly.noop = function () {};

var EventEmitter = prezly.EventEmitter = {

    on: function (event, handler) {
	var events = this._events || (this._events = {});
	var handlers = events[event] || (events[event] = []);
	handlers.push(handler);
    },

    emit: function (event) {
	var events = this._events || (this._events = {});
	var handlers = events[event] || (events[event] = []);
	var args = Array.prototype.slice.call(arguments, 1);
	handlers.forEach(function (handler) {
	    handler.apply(this, args);
	}, this);
    }

};


var Model = prezly.Model = {

    initialize: function (attributes) {
	if (attributes) {
	    Object.keys(attributes).forEach(function (attr) {
		this.set(attr, attributes[attr]);
	    }, this);
	}
    },

    attributes: function () {
	var attributes = this._attributes || (this._attributes = {});
	return Object.keys(attributes);
    },

    get: function (attr) {
	var attributes = this._attributes || (this._attributes = {});
	return attributes[attr]
    },

    set: function (attr, value) {
	var attributes = this._attributes || (this._attributes = {});
	var old = attributes[attr];
	attributes[attr] = value;
	this.emit('change', attr, value, old);
    }

};

prezly.extend(Model, 
	      EventEmitter,
	      Subable);


var Collection = prezly.Collection = {

    append: function (item) {
	if (arguments.length > 1) {
	    prezly.makeArray(arguments).forEach(function (i) {
		this.append(i);
	    }, this);
	}
	else {
	    this.insert(item, this.count());
	}
	return this;
    },

    count: function () {
	var items = this._items || (this._items = []);
	return this._items.length;
    },

    empty: function () {
	return this.count() === 0;
    },

    filter: function (callback) {
	return this.fromArray(this.get().filter(callback, this));
    },

    first: function () {
	return this.get(0);
    },

    forEach: function (callback) {
	this.get().forEach(callback, this);
    },

    fromArray: function (a) {
	var collection = Object.create(Collection);
	a.forEach(function (o) {
	    this.append(o);
	}, collection);
	return collection;
    },

    get: function (index) {
	if (typeof index === 'number') {
	    return this._items[index];
	}
	return this._items;
    },

    initialize: function () {
	this._items = [];
	prezly.makeArray(arguments).forEach(function (item) {
	    this._items.push(item);
	}, this);
    },

    insert: function (item, index) {
	if (index === this.count()) {
	    this._items.push(item);
	}
	else {
	    this._items = this._items.reduce(function (items, next_item, i) {
		if (i === index) {
		    items.push(item);
		}
		items.push(next_item);
		return items;
	    }, []);	
	}
	this.emit('add', item, index);
	return this;
    },

    last: function () {
	return this._items[this.count() - 1];
    },

    removeAt: function (index) {
	var removed;
	this._items = this._items.reduce(function (items, next_item, i) {
	    if (i !== index) {
		items.push(next_item);
	    }
	    else {
		removed = next_item;
	    }
	    return items;
	}, []);
	if (removed) {
	    this.emit('remove', removed, index);
	}
    },

    removeItem: function (item) {
	this.removeAt(this.get().indexOf(item));
    },

    type: function (type) {
	for (var p in type) {
	    // V8 doesn't support let?
	    (function (prop, o) {
		if (prop === 'create') return;
		o[prop] = function () {
		    var args = prezly.makeArray(arguments);
		    this.forEach(function (item) {
			item[prop].apply(item, args);
		    });
		};
	    })(p, this);
	}
	return this;
    }

};

prezly.extend(Collection,
	      EventEmitter,
	      Subable);



var View = prezly.View = {

    initialize: function () {
	this.signature = prezly.makeArray(arguments);
    },

    implement: function (impl) {
	impl = impl || {};
	return this.signature && this.signature.reduce(function (widget, method) {
	    widget[method] = (typeof impl[method] === 'function') ? impl[method] : prezly.noop;
	    return widget;
	}, Object.create(Widget));
    }

};

prezly.Prezenter = {

    initialize: function () {
    },

    prezent: function (view) {
	this.initialize(view);
    },

    __preserve_on_sub: ['prezent']
};

prezly.extend(prezly.Prezenter, prezly.Subable);


var Widget = prezly.Widget = {

    initialize: function () {
    }

};

prezly.extend(Widget,
	      Subable,
	      EventEmitter);