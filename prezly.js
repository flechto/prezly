
var prezly;
if (typeof exports !== 'undefined') {
    prezly = exports || (window.prezly = {});
}
else {
    prezly = window.prezly = {};
}


var make_array = prezly.makeArray = function (obj) {
    return Array.prototype.slice.call(obj, 0);
};

var noop = prezly.noop = function () {};

var curry = prezly.curry = function (fn) {
    var args = make_array(arguments).slice(1);
    return function () {
	return fn.apply(this, args.concat(make_array(arguments)));
    }
};

var push_stack = function (dest, src) {
    return src.reduce(function (d, s) {
	d.push(s);
	return d;
    }, dest);
};

var face = prezly.face = function () {
    var signature = make_array(arguments);
    return {
	extend: function () {
	    return face.apply(prezly, signature.concat(make_array(arguments)));
	},
	extract_implementation: function (obj) {
	    return signature.reduce(function (impl, method) {
		if (typeof obj[method] === 'function') {
		    impl[method] = function () {
			obj[method].apply(obj, make_array(arguments));
		    };
		}
		else {
		    impl[method] = prezly.noop;
		}
		return impl;
	    }, {});
	},
	implement: function (implementation) {
	    implementation = implementation || {};
	    return signature.reduce(function (impl, method) {
		impl[method] = (typeof implementation[method] === 'function') ? implementation[method] : noop;
		return impl;
	    }, {});
	},
	is_implemented_by: function (o) {
	    var keys = Object.keys(o);
	    return signature.every(function (method) {
		return keys.indexOf(method) > -1;
	    });
	},
	keys: function () {
	    return push_stack([], signature);
	}
    }
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

var Extendable = prezly.Extendable = {

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

var EventEmitterFace = prezly.EventEmitterFace = face('on', 'emit');

var EventEmitter = prezly.EventEmitter = EventEmitterFace.implement({

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

	handlers = events['all'] || (events['all'] = []);
	
	args.unshift(event);
	handlers.forEach(function (handler) {
	    handler.apply(this, args);
	});
    }

});


var Model = prezly.Model = {

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
	this.emit('change:' + attr, value, old);
	this.emit('change', attr, value, old);
    }

};

prezly.extend(Model, 
	      EventEmitter);

prezly.model = function (attributes) {
    var model = Object.create(Model);
    attributes.split(' ').forEach(function (attribute) {
	model[attribute] = function (val) {
	    if (typeof val === 'undefined') {
		return this.get(attribute);
	    }
	    return this.set(attribute, val);
	};
    });
    return model;
};

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
	return prezly.collection.fromArray(this.get().filter(callback, this));
    },

    first: function () {
	return this.get(0);
    },

    forEach: function (callback) {
	this.get().forEach(callback, this);
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

    invoke: function (method) {
	var args = make_array(arguments).slice(1);
	this.forEach(function (item) {
	    var fn = item[method];
	    if (typeof fn === 'function') {
		fn.apply(item, args);
	    }
	});
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
    }

};

prezly.extend(Collection,
	      EventEmitter,
	      Subable);

prezly.collection = function () {
    var collection = Object.create(Collection);
    make_array(arguments).forEach(function (item) {
	collection.append(item);
    });
    return collection;
};

prezly.collection.fromArray = function (a) {
    return prezly.collection.apply(this, a);
};


prezly.view = function () {
    return EventEmitterFace.extend.apply(EventEmitterFace, make_array(arguments));
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
	      Extendable,
	      EventEmitter);

prezly.widget = function (view, init, prezenter) {
    
    var base;

    if (typeof init === 'object') {
	base = init;
	init = base.init || prezly.noop;
    }

    var ctor = function () { };

    ctor.prototype = base || Widget;

    var creator = function () {

	var instance = new ctor();

	init.apply(instance, make_array(arguments).concat([instance]));

	if (typeof prezenter === 'function') {
	    prezenter(view.extract_implementation(instance));
	}
	return instance
    };

    return creator
};