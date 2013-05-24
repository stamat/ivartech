/**
 *	@file		IVARTECH JavaScript Library - main class
 *	@author		Nikola Stamatovic Stamat <stamat@ivartech.com>
 *	@copyright	IVARTECH http://ivartech.com
 *	@version	20130313  
 *	
 *	@namespace	ivar
 */

if (ivar === undefined) var ivar = {};
if ($i === undefined) var $i = ivar;

ivar.DEBUG = true;
ivar.LOADED = false;
ivar._private = {};
ivar._private.libpath = '';
ivar._private.imported = {};
ivar._private.loading = {
	scripts: {},
	length: 0
};
ivar._private.on_ready_fn_stack = [];
ivar._private.libname = 'ivar';

ivar._global = this;

ivar._private.output; //define debug output function, print your output somewhere else...


ivar.regex = {};
ivar.regex.regex = /^\/(.*)\/([igmy]{0,4})$/;
ivar.regex.email = /^[a-z0-9\._\-]+@[a-z\.\-]+\.[a-z]{2,4}$/;
ivar.regex.function_name = /function\s+([a-zA-Z0-9_\$]+?)\s*\(/;


Math.randomArbitrary = function(min, max) {
  return Math.random() * (max - min) + min;
};

Math.rand = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};


/*
	NUMBER prototypes
*/

Number.prototype.roundFloat = function(decimals) {
	if (decimals === undefined)
		decimals = 2;
	var dec = Math.pow(10, decimals);
	return Math.round(this*dec)/dec;
};

/*
	ARRAY prototypes
*/

Array.prototype.find = function(value, field) {
	if (this.length > 0)
		for (var i = 0; i < this.length; i++) {
			var elem = this[i];
			if ((field !== undefined) && ((typeof elem === 'object') || (elem.hasOwnProperty('slice') && elem.hasOwnProperty('length'))))
				elem = this[i][field];
			if (elem === value)
				return i;
		}
	return -1;
};

Array.prototype.getFirst = function() {
	return this[0];
};

Array.prototype.getLast = function() {
	return this[this.length-1];
};

Array.prototype.each = function(fn, reversed) {
	var count = 0;
	var step = 1;
	if (reversed) {
		step = -1;
		count = this.length - 1;
	}

	for (var i = 0; i < this.length; i++) {
		fn(count, this[count]);
		count = count + step;
	}
};

String.prototype.each = Array.prototype.each;

//TODO: test == ===
Array.prototype.equal = function(arr) {
	var self = this;
	if (self === arr)
		return true;
	if (self.length !== arr.length)
		return false;
	self.each(function(i){
		if (self[i] !== arr[i])
			return false;
	});
	return true;
};

//TODO: remove segment of an array
Array.prototype.remove = function(id) {
	return this.splice(id, 1);
};

//TODO: insert array into array
Array.prototype.insert = function(id, value) {
	return this.splice(id, 0, value);
};

Array.prototype.shuffle = function() {
	var res = [];
	while(this.length !== 0) {
		var id = Math.floor(Math.random() * this.length);
		res.push(this[id]);
		this.splice(id, 1);
	}
    return res;
};

Array.prototype.map = function(field) {
	var mapped = {};
	for (var i = 0; i< this.length; i++) {
		var value = this[i];
		if (ivar.isSet(field))
			value = this[i][field]
		if (ivar.isFunction(value))
			value = value.parseName();
		if (ivar.isDate(value))
			value = value.getTime();
		if (ivar.isNumber(value))
			value = value.toString();
		if (ivar.isObject(value))
			value = 'obj_'+ivar.crc32(JSON.stringify(value));
			
		if (ivar.isString(value))
			mapped[value] = i;
	}
	return mapped;
};

Array.prototype.sortObjectsBy = function(field, desc, type) {
	var func = null;
	
	if(this.length == 0)
		return [];
	
	if(!ivar.isSet(type))
		type = ivar.whatis(this[0][field]);
	
	if(!ivar.isSet(desc))
		desc = false;
	
	if(ivar.isNumber(this[0][field])) {
		func = function(a, b) {
			return !desc?a[field]-b[field]:b[field]-a[field];
		};
	} else if(type === 'string') {
		func = function(a, b) {
			var fieldA = a[field].toLowerCase();
			var fieldB = b[field].toLowerCase();
			if (fieldA < fieldB)
				return !desc?-1:1; 
			if (fieldA > fieldB)
				return !desc?1:-1;
			return 0;
		};
	} else if(type === 'date') {
		func = function(a, b) {
			var fieldA = a[field].getTime();
			var fieldB = b[field].getTime();
			return !desc?fieldA-fieldB:fieldB-fieldA;
		};
	}
	
	return this.sort(func);
};

/*
	STRING prototypes
*/

if (!String.prototype.hasOwnProperty('startsWith'))
String.prototype.startsWith = function(str, pos) {
	var prefix = this.substring(pos, str.length);
	return prefix === str;
};

if (!String.prototype.hasOwnProperty('endsWith'))
String.prototype.endsWith = function(str, pos) {
	if (!pos)
		pos = this.length;
	var sufix = this.substring(pos - str.length, pos);
	return sufix === str;
};

if (!String.prototype.hasOwnProperty('trim'))
String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g,'');
};

if (!String.prototype.hasOwnProperty('trimLeft'))
String.prototype.trimLeft = function() {
	return this.replace(/^\s+/,'');
};

if (!String.prototype.hasOwnProperty('trimRight'))
String.prototype.trimRight = function() {
	return this.replace(/\s+$/,'');
};

String.prototype.removePrefix = function(str) {
	return this.substring(str.length, this.length);
};

String.prototype.removeSufix = function(str) {
	return this.substring(0, this.length - str.length);
};

String.prototype.removeFirst = function() {
	return this.substring(1, this.length);
};

String.prototype.removeLast = function() {
	return this.substring(0, this.length-1);
};

String.prototype.getFirst = Array.prototype.getFirst;

String.prototype.getLast = Array.prototype.getLast;

String.prototype.insert = function(what, where, end) {
	if (typeof where === 'string')
		where = this.indexOf(where);
	end = end || where;
	var res = [];
	res.push(this.substring(0, where));
	res.push(what);
	res.push(this.substring(end, this.length));
	return res.join('');
};

String.prototype.hasUpperCase = function() {
	return this !== this.toLowerCase() ? true : false;
};

String.prototype.hasLowerCase = function() {
	return this.toUpperCase() !== this ? true : false;
};

String.prototype.template = function(obj, opened, closed) {
	opened = opened || '{{';
	closed = closed || '}}';	
	var str = this;
	var id = str.indexOf(opened);
	
	while (id > -1){
		var end = str.indexOf(closed, id);
		var propertyName = str.substring(id+opened.length, end);
		
		var repl = obj[propertyName] || '';
		
		str = str.insert(repl, id, end+closed.length);
		
		id = str.indexOf(opened, id+repl.length);
	}
	
	return str;
}

String.prototype.swap = function(what, with_this, only_first) {
	if (only_first)
			return this.replace(what, with_this);
	var re = new RegExp(what+'+','g');
	return this.replace(re, with_this);
};

String.prototype.toRegExp = function() {
	var val = this;
	if(!ivar.regex.regex.test(val))
		val = '/'+val+'/';
	var pts = ivar.regex.regex.exec(val);
	try {
		return new RegExp(pts[1], pts[2]);
	} catch (e) {
		return false;
	}
};

Function.prototype.parseName = function() {
	return ivar.regex.function_name.exec(this.toString())[1];
};

Function.prototype.method = function(func, func_name) {
	if (func_name === undefined)
		func_name = func.parseName();
	this.prototype[func_name] = func;
};

//TODO: What about inheriting the constructors??? test test test
Function.prototype.inherit = function(classes) {
	var i = 0;
	var _classes = [];
	while (arguments.hasOwnProperty(i)) {
		_classes.push(arguments[i]);
		var inst = arguments[i];
		if (typeof inst === 'function')
			inst = new inst();
		
		for (var j in inst)
			this.prototype[j] = inst[j];
		i++;
	}
	
	if (_classes.length === 1)
		_classes = _classes[0];
	this.prototype['__super__'] = _classes;
};

ivar.eachArg = function(args, fn) {
	var i = 0;
	while (args.hasOwnProperty(i)) {
		if (fn !== undefined)
			fn(i, args[i]);
		i++;
	}
	return i-1;
};

ivar._private.def_buildFnList = function(str) {
	var args = str.split(',');
	var argSets = [];
	var temp = [];
	var pref = '*';
	for(var i = 0; i < args.length; i++) {
		var notMandatory = args[i].startsWith(pref);
		if (notMandatory) {
			if (argSets.length === 0)
				argSets.push(temp.join());
			args[i] = args[i].removePrefix(pref);
			
		}
		
		temp.push(args[i]);
		
		if (notMandatory)
			argSets.push(temp.join());
	}
	if(argSets.length === 0)
		argSets.push(temp.join());
		
	return argSets;
};

ivar.def = function(functions, parent) {
	var fn = {};
	if (typeof functions === 'function') {
		fn = functions;
	} else {
		for(var i in functions) {
			if(i.indexOf('*') > -1) {
				var argSets = ivar._private.def_buildFnList(i);
		
				for(var j = 0; j < argSets.length; j++) {
					fn[argSets[j]] = functions[i];
				}
			} else {
				fn[i] = functions[i];
			}
		}
	}
	
	return function() {
		var types = [];
		var args = [];
		ivar.eachArg(arguments, function(i, elem) {
			args.push(elem);
			types.push(whatis(elem));
		});
		var key = types.join();
		if (fn.hasOwnProperty(key)) {
			return fn[key].apply(parent, args);
		} else {
			if (typeof fn === 'function')
				return fn.apply(parent, args);
			if (fn.hasOwnProperty('default'))
				return fn['default'].apply(parent, args);		
		}
	};
};

ivar.findScriptPath = function(script_name) {
	var script_elems = document.getElementsByTagName('script');
	for (var i = 0; i < script_elems.length; i++) {
		if (script_elems[i].src.endsWith(script_name)) {
			var href = window.location.href;
			href = href.substring(0, href.lastIndexOf('/'));
			var url = script_elems[i].src.removeSufix(script_name);
			return url.substring(href.length+1, url.length);
		}
	}
	return '';
};

ivar._private.onReady = function() {
	if (!ivar.LOADED) {
		ivar._private.on_ready_fn_stack.each(function(i, obj) {
			ivar._private.on_ready_fn_stack[i]();
		});
		ivar.LOADED = true;
	}
};

ivar.injectScript = function(script_name, uri, callback, prepare, async) {
	
	if (ivar.isSet(prepare))
		prepare(script_name, uri);
	
	var script_elem = document.createElement('script');
	script_elem.type = 'text/javascript';
	script_elem.title = script_name;
	script_elem.src = uri;
	if(!ivar.isSet(async))
		async = false;
	script_elem.async = async;
	script_elem.defer = false;
	
	if (ivar.isSet(callback))
		script_elem.onload = function() {
				callback(script_name, uri);
		};
	
	document.getElementsByTagName('head')[0].appendChild(script_elem);
};

ivar.isGlobal = function(var_name, root) {
	if (!ivar.isSet(root))
		root = ivar._global;
	return root.hasOwnProperty(var_name); 
};

ivar.isPrivate = function(var_name) {
	return var_name.startsWith('_'); 
};

ivar.isConstant = function(var_name) {
	return !var_name.hasLowerCase();
};

ivar.referenceInNamespace = function(object, target) {
	if(!ivar.isSet(target))
		target = ivar._global;
	for(var i in object) {
		if (!ivar.isGlobal(i, target) && !ivar.isPrivate(i) && !ivar.isConstant(i))
			ivar._global[i] = ivar[i];
	}
};

ivar._private.requireCallback = function(script_name, uri) {
	ivar._private.loading.length--;
	delete ivar._private.loading.scripts[script_name];
	ivar._private.imported[script_name] = uri;
	ivar.referenceInNamespace(ivar);
	if (ivar._private.loading.length == 0)
		ivar._private.onReady();
};

ivar._private.requirePrepare = function(script_name, uri) {
	ivar._private.loading.scripts[script_name] = uri;
	ivar._private.loading.length++;
};

ivar.namespaceToUri = function(script_name, url) {
	var np = script_name.split('.');
	if (np.getLast() === '*') {
		np.pop();
		np.push('_all');
	} else if (np.getLast() === 'js') {
		np.pop();
	}
	
	if (!ivar.isSet(url))
		url = '';
		
	script_name = np.join('.');
	return  url + np.join('/')+'.js';
};

//TODO: test it;
ivar.require = function(script_name, async) {
	var uri = '';
	if (script_name.indexOf('/') > -1) {
		uri = script_name;
		var lastSlash = uri.lastIndexOf('/');
		script_name = uri.substring(lastSlash+1, uri.length);
	} else {
		
		uri = ivar.namespaceToUri(script_name, ivar._private.libpath);
	}
	
	if (!ivar._private.loading.scripts.hasOwnProperty(script_name) 
	 && !ivar._private.imported.hasOwnProperty(script_name)) {
		ivar.injectScript(script_name, uri, 
			ivar._private.requireCallback, 
				ivar._private.requirePrepare, async);
	}
};

/**
 *	Checks if the variable is set or exists
 *
 *	@param	{any}	val		Any variable or property
 *	@return	{boolean}
 */
ivar.isSet = function(val) {
	return (val !== undefined) && (val !== null);
};

/**
 *	Checks if the variable is empty. Array with the length of 0, 
 *	empty string or empty object.
 *
 *	@param	{array|object|string}	obj		Any variable or property
 *	@return	{boolean}
 */
ivar.isEmpty = function(obj) {
	if (ivar.isSet(obj)) {
		if (obj.length && obj.length > 0)
			return false;

		for (var key in obj) {
			if (hasOwnProperty.call(obj, key))
				return false;
		}
	}
	return true;
};

/**
 *	System out print regular information shortcut. Prints to console or alert
 *	if console is unavailable.
 *
 *	@param	{any}	e		Message in a form of a string or any other object that can be presented in console
 */
ivar.print = function(e) {
	var args = [];
	args.push('log');
	ivar.eachArg(arguments, function(i, elem){
		args.push(elem);
	});
	
	ivar.systemMessage.apply(null, args);
};

/**
 *	System out print warning information shortcut. Prints to console or alert
 *	if console is unavailable.
 *
 *	@param	{any}	e		Message in a form of a string or any other object that can be presented in console
 */
ivar.warning = function warning(e) {
	var args = [];
	args.push('warn');
	ivar.eachArg(arguments, function(i, elem){
		args.push(elem);
	});
	ivar.systemMessage.apply(null, args);
};

/**
 *	System out print error information shortcut. Prints to console or alert
 *	if console is unavailable.
 *
 *	@param	{any}	e		Message in a form of a string or any other object that can be presented in console
 */
ivar.error = function error(e) {
	if (!ivar.isSet(arguments[0]) || (arguments[0] === '') || (arguments[0] === ' '))
		arguments[0] = '[ERROR]: in function "' + arguments.callee.caller.parseName() + '"';
	var args = [];
	args.push('error');
	ivar.eachArg(arguments, function(i, elem){
		args.push(elem);
	});
	ivar.systemMessage.apply(null, args);
};

ivar.setDebugOutput = function(fn) {
	ivar._private.output = fn;
};

ivar._private.consolePrint = function(obj) {
	if (obj.msgs.length === 0) {
		console[obj.type](obj.title);
	} else {
		if ((obj.type === 'log') || (obj.type === 'warn'))
			console.groupCollapsed(obj.title);
		else
			console.group(obj.title);
		
		obj.msgs.each(function(i, elem) {
			console[obj.type](elem);
		});
		
		console.groupEnd();	
	}
};

ivar._private.alertPrint = function(obj) {
	if (obj.msgs.length === 0) {
		alert('[' + obj.type + '] ' + obj.title);
	} else {
		var resMsg = ['[' + obj.type + '] ' +obj.title, '------'];
		//resMsg.concat(obj.msgs); doesnt work for some reason
		alert(resMsg.join('\n')+'\n'+obj.msgs.join('\n'));
	}
};

/**
 *	System out print. Prints to console or alert
 *	if console is unavailable.
 *
 *	@param	{string}	fn		Function name of console object: log, warn, error...
 *	@param	{any}		msg		Message in a form of a string or any other object that can be presented in console. Or if other arguments are present it is used as a label of set of console outputs
 *	@param 	{any}		[obj1,[obj2,...]]	
 */
ivar.systemMessage = function(fn, msg) {
	var multi = ivar.isSet(arguments[2]);
	var consoleExists = ivar.isSet(ivar._global.console) && ivar.isSet(ivar._global.console[fn]);
	var obj = {
		type: fn,
		title: arguments[1],
		msgs: []
	};

	if (multi) {
		ivar.eachArg(arguments, function(i, elem){
			if (i > 1)
				obj.msgs.push(elem);
		});
	}
		
	if (consoleExists && ivar.DEBUG)
		ivar._private.consolePrint(obj);
	if (ivar.isSet(ivar._private.output))
		ivar._private.output(obj);
	else
		if (!consoleExists && ivar.DEBUG)
			ivar._private.alertPrint(obj);
};

ivar.is = function(obj, type) {
	if (type === 'number')
		return isNumber(obj);
	if (whatis(obj) === type)
		return true;
	if (type === 'empty')
		return ivar.isEmpty(obj);
	if (type === 'set')
		return ivar.isSet(obj);
	return false;
};

ivar.isArray = function(val) {
	return ivar.is(val, 'array');
};

ivar.isNumber = function(val) {
	if (isNaN(val))
		return false;
	return typeof val === 'number';
};

ivar.isInt = function(val) {
	return ivar.is(val, 'int');
};

ivar.isFloat = function(val) {
	return ivar.is(val, 'float');
};

ivar.isString = function(val) {
	return ivar.is(val,'string');
};

ivar.isObject = function(val) {
	return ivar.is(val, 'object');
};

ivar.isCustomObject = function(val) {
	return ivar.getClass() === 'object';
};

ivar.isFunction = function(val) {
	return ivar.is(val, 'function');
};

ivar.isDate = function(val) {
	return ivar.is(val,'date');
};

ivar.isBool = function(val) {
	return ivar.is(val, 'boolean');
};

ivar.isRegExp = function(val) {
	return ivar.is(val, 'regexp');
};

ivar.isNull = function(val) {
	return val === null;
};

ivar.isUndefined = function(val) {
	return val === undefined;
};


//Thanks to perfectionkills.com <http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/>
ivar.getClass = function(val) {
	return Object.prototype.toString.call(val)
		.match(/^\[object\s(.*)\]$/)[1];
};

ivar.getClassName = function(val) {
	return val.constructor.parseName();
}

ivar.whatis = function(val) {

	if (val === undefined)
		return 'undefined';
	if (val === null)
		return 'null';
		
	var type = typeof val;
	
	if (type === 'object')
		type = ivar.getClass(val).toLowerCase();
	
	if (type === 'number') {
		if (val.toString().indexOf('.') > 0)
			return 'float';
		else
			return 'int';
	}
	
	return type;
};

/**
 *	Parses string value into correct javascript data type
 *	@copyleft 2011 by Mozilla Developer Network
 *
 *	@param 	{string}	sValue
 *	@return {null|boolean|number|date}
 */
ivar.parseText = function(sValue) {
	var rIsNull = /^\s*$/, rIsBool = /^(?:true|false)$/i;
	if (rIsNull.test(sValue)) { return null; }
	if (rIsBool.test(sValue)) { return sValue.toLowerCase() === "true"; }
	if (isFinite(sValue)) { return parseFloat(sValue); }
	if (isFinite(Date.parse(sValue))) { return new Date(sValue); }
	return sValue;
};


/**
 *	Compares two objects
 *	
 *	@todo Should be tested more. Should be recursive for children objects. Two 'for' loops, very slow... Dont know if it can be faster... -.-
 *
 *	@param	{object}	obj1	Any object with properties
 *	@param	{object}	obj2	Any object with properties
 *	@return	{boolean}			True if equal
 */
//TODO: recursive check for child objects
ivar.equal = function(obj1, obj2) {
	if (obj1 === obj2)
		return true;
	for (var i in obj1) {
		if (obj1[i] !== obj2[i])
			return false;
	}
	for (var i in obj2) {
		if (obj2[i] !== obj1[i])
			return false;
	}
	return true;
};

/**
 *	Extends properties of a second object into first, overwriting all of it's properties if 
 *	they have same properties. Used for loading options.
 *	
 *	@param	{object}	extended	First object to be extended
 *	@param	{object}	extender	Second object extending the first one
 *	@param	{number[0|1]|boolean}	[clone]		First or the second object
 *	@return	{object}				Returns cloned object
 */
ivar.extend = function(extended, extender, clone, if_not_exists) {
	if (ivar.isSet(clone))
		if ((clone <= 0) || !clone)
			extended = ivar.clone(extended);
		else if ((clone >= 1) || clone)
			extender = ivar.clone(extender);
			
	for (var i in extender) {
		if (!(ivar.isSet(extended[i]) && if_not_exists))
			extended[i] = extender[i];
	}
	
	if (ivar.isSet(clone))
		if ((clone <= 0) || !clone)
			return extended;
		else if ((clone >= 1) || clone)
			return extender;
};

//TODO: recursive, for loop descends into feilds
ivar.clone = function(obj) {
	return JSON.parse(JSON.stringify(obj));
};

/**
 *	"Short" for loop. Should force me to separate inner loops into functions.
 *	
 *	@param	{number}	times	Number of times to spin the function
 *	@param	{function}	fn		Function to be spun for the given number of times
 *	@param	{number}	[step=1]	Direction of loop depending on positive or negative value, increases or decreases count by given step
 */
ivar.loop = function(times, fn, step) {
	var count = 0;
	if (!step)
		step = 1;
	else
		if (step < 0)
			count = times - 1;

	for (var i = 0; i < times; i++) {
		fn(count);
		count = count + step;
	}
};

ivar.find = function(obj, val) {
	for (var i in obj) {
		if (obj[i] == val)
			return i;
	}
	return null;
};

ivar.uid = function(saltSize) {
	if (!ivar.isSet(saltSize))
		saltSize = 100;
	var i = 97;
	if (Math.rand(0, 1) == 0)
		i = 65;
	var num = Date.now() * saltSize + Math.rand(0, saltSize);
	return String.fromCharCode(Math.rand(i, i + 25)) + num.toString(16);
};

ivar.setUniqueObject = function(obj, collection) {
	if (!ivar.isSet(obj))
		obj = {};
	if (!ivar.isSet(collection))
		collection = ivar._global;
	var uid = ivar.uid();
	while (collection[uid])
		uid = ivar.uid();
	obj.__uid__ = uid;
	
	collection[uid] = obj;
	return obj;
};

/*   
=============================================================================== 
Crc32 is a JavaScript function for computing the CRC32 of a string 
............................................................................... 
 
Version: 1.2 - 2006/11 - http://noteslog.com/category/javascript/ 
 
------------------------------------------------------------------------------- 
Copyright (c) 2006 Andrea Ercolino 
http://www.opensource.org/licenses/mit-license.php 
=============================================================================== 
*/ 
ivar._private.crc32_table = "00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D";     
 
/* Number */ 
ivar.crc32 = function( /* String */ str, /* Number */ crc ) { 
    if( crc == window.undefined ) crc = 0; 
    var n = 0; //a number between 0 and 255 
    var x = 0; //an hex number 

    crc = crc ^ (-1); 
    for( var i = 0, iTop = str.length; i < iTop; i++ ) { 
        n = ( crc ^ str.charCodeAt( i ) ) & 0xFF; 
        x = "0x" + ivar._private.crc32_table.substr( n * 9, 8 ); 
        crc = ( crc >>> 8 ) ^ x; 
    } 
    return crc ^ (-1); 
};

ivar.namespace = function(str, root) {
	var chunks = str.split('.');
	if (!ivar.isSet(root))
		root = ivar._global;
	var current = root;
	chunks.each(function(i, elem){
		if (!current.hasOwnProperty(elem))
			current[elem] = {};
		current = current[elem];
	});
	return current;
};


ivar.ready = function(fn) {
	ivar._private.on_ready_fn_stack.push(fn);
};

ivar._private.libpath = ivar.findScriptPath('main.js');
ivar.referenceInNamespace(ivar);
