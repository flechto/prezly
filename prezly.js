
prezly = exports;

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

prezly.noop = function () {};

prezly.EventEmitter = {

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


prezly.Model = {

    attributes: function () {
	return this._attributes && Object.keys(this._attributes);
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

prezly.extend(prezly.Model, prezly.EventEmitter);

prezly.View = {

    implement: function (impl) {
	impl = impl || {};
	return this.signature && this.signature.reduce(function (widget, method) {
	    widget[method] = (typeof impl[method] === 'function') ? impl[method] : prezly.noop;
	    return widget;
	}, {});
    }

};


prezly.Prezenter = {

    initialize: function () {
    },

    prezent: function (view) {
	this.initialize(view);
    }

};