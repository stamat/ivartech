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
	if(self === arr)
		return true;
	if(self.length !== arr.length)
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
	if(!pos)
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

String.prototype.insert = function(what, where) {
	if (typeof where === 'string')
		where = this.indexOf(where);
	var res = [];
	res.push(this.substring(0, where));
	res.push(what);
	res.push(this.substring(where, this.length));
	return res.join('');
};

String.prototype.swap = function(what, with_this, only_first) {
	if (only_first)
		return this.replace(what, with_this);
	var re = new RegExp(what+'+','g');
	return this.replace(re, with_this);
};

String.prototype.hasUpperCase = function() {
	return this !== this.toLowerCase() ? true : false;
};

String.prototype.hasLowerCase = function() {
	return this.toUpperCase() !== this ? true : false;
};

Function.prototype.parseName = function() {
	return /function\s+([a-zA-Z0-9_\$]+?)\s*\(/g.exec(this.toString())[1];
};

Function.prototype.method = function(func, func_name) {
	if(func_name === undefined)
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
		if(typeof inst === 'function')
			inst = new inst();
		
		for (var j in inst)
			this.prototype[j] = inst[j];
		i++;
	}
	
	if (_classes.length === 1)
		_classes = _classes[0];
	this.prototype['__super__'] = _classes;
};

ivar.def = function(functions, parent) {
	return function() {
		var types = [];
		var args = [];
		ivar.eachArg(arguments, function(i, elem) {
			args.push(elem);
			types.push(whatis(elem));
		});
		var key = types.join();
		if(functions.hasOwnProperty(key)) {
			return functions[key].apply(parent, args);
		} else {
			if (typeof functions === 'function')
				return functions.apply(parent, args);
			if (functions.hasOwnProperty('default'))
				return functions['default'].apply(parent, args);		
		}
	};
};

ivar.eachArg = function(args, fn) {
	var i = 0;
	while (args.hasOwnProperty(i)) {
		if(fn !== undefined)
			fn(i, args[i]);
		i++;
	}
	return i-1;
};

ivar.findScriptPath = function(script_name) {
	var script_elems = document.getElementsByTagName('script');
	for (var i = 0; i < script_elems.length; i++) {
		if (script_elems[i].src.endsWith(script_name)) {
			var href = window.location.href;
			href = href.substring(0, href.lastIndexOf('/'));
			var url = script_elems[i].src.removeSufix('main.js');
			return url.substring(href.length, url.length).removeFirst();
		}
	}
	return '';
};

ivar._private.onReady = function() {
	if(!ivar.LOADED) {
		ivar._private.on_ready_fn_stack.each(function(i, obj){
			ivar._private.on_ready_fn_stack[i]();
		});
		ivar.LOADED = true;
	}
};

ivar.injectScript = function(script_name, uri, callback, prepare) {
	
	if(ivar.isSet(prepare))
		prepare(script_name, uri);
	
	var script_elem = document.createElement('script');
	script_elem.type = 'text/javascript';
	script_elem.title = script_name;
	script_elem.src = uri;
	script_elem.async = false;
	script_elem.defer = false;
	
	if(ivar.isSet(callback))
		script_elem.onload = function() {
				callback(script_name, uri);
		};
	
	document.getElementsByTagName('head')[0].appendChild(script_elem);
};

ivar.isGlobal = function(var_name, root) {
	if(!ivar.isSet(root))
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

ivar._private.injectScriptCallback = function(script_name, uri) {
	ivar._private.loading.length--;
	delete ivar._private.loading.scripts[script_name];
	ivar._private.imported[script_name] = uri;
	ivar.referenceInNamespace(ivar);
	if(ivar._private.loading.length == 0)
		ivar._private.onReady();
};

ivar._private.injectScriptPrepare = function(script_name, uri) {
	ivar._private.loading.scripts[script_name] = uri;
	ivar._private.loading.length++;
};

ivar.require = function(script_name) {
	var np = script_name.split('.');
	if (np.getLast() == '*') {
		np.pop();
		np.push('_all');
	}
		
	script_name = np.join('.');
	var uri = ivar._private.libpath + np.join('/')+'.js';
	if (!ivar._private.loading.scripts.hasOwnProperty(script_name) 
	 && !ivar._private.imported.hasOwnProperty(script_name)) {
		ivar.injectScript(script_name, uri, 
			ivar._private.injectScriptCallback, 
				ivar._private.injectScriptPrepare);
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
		if((obj.type === 'log') || (obj.type === 'warn'))
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

	if(multi) {
		ivar.eachArg(arguments, function(i, elem){
			if (i > 1)
				obj.msgs.push(elem);
		});
	}
		
	if(consoleExists && ivar.DEBUG)
		ivar._private.consolePrint(obj);
	if(ivar.isSet(ivar._private.output))
		ivar._private.output(obj);
	if(!consoleExists && ivar.DEBUG)
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
	var type = ivar.whatis(val);
	if(isNaN(val))
		return false;
	return (type === 'int') || (type === 'float');
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

ivar.isFunction = function(val) {
	return ivar.is(val, 'function');
};

ivar.isDate = function(val) {
	return ivar.is(val,'date');
};

ivar.isBool = function(val) {
	return ivar.is(val, 'boolean');
};

ivar.whatis = function(val) {

	if(val === undefined)
		return 'undefined';
	if(val === null)
		return 'null';
		
	var type = typeof val;
	
	if(type === 'object') {
		if(val.hasOwnProperty('length') && val.hasOwnProperty('push'))
			return 'array';
		if(val.hasOwnProperty('getDate') && val.hasOwnProperty('toLocaleTimeString'))
			return 'date';
		if(val.hasOwnProperty('toExponential'))
			type = 'number';
		if(val.hasOwnProperty('substring') && val.hasOwnProperty('length'))
			return 'string';
	}
	
	if(type === 'number') {
		if(val.toString().indexOf('.') > 0)
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
	if (!isSet(saltSize))
		saltSize = 100;
	var i = 97;
	if (Math.rand(0, 1) == 0)
		i = 65;
	var num = Date.now() * saltSize + Math.rand(0, saltSize);
	return String.fromCharCode(Math.rand(i, i + 25)) + num.toString(16);
};

ivar.setUniqueObject = function(obj, collection) {
	if(!ivar.isSet(obj))
		obj = {};
	if(!ivar.isSet(collection))
		collection = ivar._global;
	var uid = ivar.uid();
	while(collection[uid])
		uid = ivar.uid();
	obj.__uid__ = uid;
	
	collection[uid] = obj;
	return obj;
};

//XXX: move to another file
ivar.mapArray = function(arr, field) {
	var mapped = [];
	for(var i = 0; i< arr.length; i++) {
		var value = arr[i];
		if(isSet(field))
			value = arr[i][field]
		if (isFunction(value))
			value = value.parseName();
		if (isDate(value))
			value = value.now();
		if (isString(value) || isNumber(value))
			if(isSet(field))
				mapped[value] = arr[i];
			else
				mapped[value] = i;
	}
	return mapped;
};

//XXX: move to another file
ivar.sortObjectsBy = function(arr, field, desc, type) {
	var func;
	
	if(arr.length == 0)
		return [];
	
	if(!ivar.isSet(type))
		type = typeof arr[0][field];
	
	if(!ivar.isSet(desc))
		desc = false;
	
	if(ivar.isNumber(type)) {
		if(!desc) {
			func = function(a, b) {
				return a[field]-b[field];
			};
		} else {
			func = function(a, b) {
				return b[field]-a[field];
			};
		}
	} else if(ivar.isString(type)) {
		if(!desc) {
			func = function(a, b) {
				var fieldA = a[field].toLowerCase();
				var fieldB = b[field].toLowerCase();
				if (fieldA < fieldB)
					return -1; 
				if (fieldA > fieldB)
					return 1;
				return 0;
			};
		} else {
			func = function(a, b) {
				var fieldA = a[field].toLowerCase();
				var fieldB = b[field].toLowerCase();
				if (fieldA < fieldB)
					return 1; 
				if (fieldA > fieldB)
					return -1;
				return 0;
			};
		}
	} else if(ivar.isDate(type)) {
		if(!desc) {
			func = function(a, b) {
				var fieldA = new Date(a[field]);
				var fieldB = new Date(b[field]);
				return fieldA-fieldB;
			};
		} else {
			func = function(a, b) {
				var fieldA = new Date(a[field]);
				var fieldB = new Date(b[field]);
				return fieldB-fieldA;
			};
		}
	}
	
	return arr.sort(func);
};

ivar.namespace = function(str, root) {
	var chunks = str.split('.');
	if(!ivar.isSet(root))
		root = ivar._global;
	var current = root;
	chunks.each(function(i, elem){
		if(!current.hasOwnProperty(elem))
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
