
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
	      Creatable);

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

prezly.extend(View, Creatable);


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
	      Creatable,
	      Subable,
	      EventEmitter);