
prezly = exports;

prezly.extend = function (dest, src) {
    var args = Array.prototype.slice.call(arguments, 1);
    args.forEach(function (arg) {
	Object.keys(arg).forEach(function (key) {
	    dest[key] = arg[key]
	});
    });
    return dest;
};

prezly.sub = function (proto) {
    var sub = Object.create(proto);
    var args = Array.prototype.slice.call(arguments, 1);
    args.unshift(sub);
    prezly.extend.apply(prezly, args);
    return sub;
};


prezly.EventEmitter = {

    on: function (event, handler) {
	var events = this._events || (this._events = {});
	var handlers = events[event] || (events[event] = []);
	handlers.push(handler);
    },

    emit: function (event) {
	var events = this._events || (this._events = {});
	var handlers = events[event] || (events[event] = []);
	handlers.forEach(function (handler) {
	    handler();
	});
    }

};