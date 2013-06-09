/**
 *  @file		IVARTECH JavaScript Library - main class
 *	@author		Nikola Stamatovic Stamat <stamat@ivartech.com>
 *	@copyright	IVARTECH http://ivartech.com
 *	@version	20130313  
 *	
 *	@namespace	ivar
 */

if (ivar === undefined) var ivar = {};
if ($i === undefined) var $i = ivar;

ivar.DEBUG = false;
ivar.LOADED = false;
ivar._private = {};
ivar._global = this;

ivar._private.output = undefined; //define debug output function, print your output somewhere else...

ivar.regex = {};
ivar.regex.regex = /^\/(.*)\/(?:(?:i?g?m?)|(?:i?m?g?)|(?:g?i?m?)|(?:g?m?i?)|(?:m?g?i?)|(?:m?i?g?))$/;
ivar.regex.email = /^[a-z0-9\._\-]+@[a-z\.\-]+\.[a-z]{2,4}$/;

//FUCK THIS SHIT!
ivar.regex.uri = /^(?:([a-z\-\+\.]+):)?(?:\/\/)?(?:([^?#@:]*)(?::([^?#@:]*))?@)?([^?#\s\/]*)(?::([0-9]{1,5}))?(?:[^?#\s]*)(?:\?([^#\s"]*))?(?:#([^\s"]*))?$/;
ivar.regex.time = /^(([0-1][0-9])|(2[0-3])):([0-5][0-9]):([0-5][0-9])$/;

ivar.regex.function_name = /function\s+([a-zA-Z0-9_\$]+?)\s*\(/;

//i tried...   http://username:password@some.fine.example.com:8042/over/there/index.dtb?type=animal&name=narwhal#nose
ivar.regex.getURIs = /(?:(?:https?|ftp):\/\/)(?:([^?#@:]*)(?::([^?#@:]*))?@)?((?:www\.|ftp\.)?([a-z0-9\-\.]+)\.(com|net|org|info|co|us|it|ca|cc|[a-z]{2,4})(:[0-9]{1,5})?((\/[^\/#\?\s]*)*)*)(\?([^#\s]*))?(#([^\s]*))?/ig;

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
	var regex = ivar.isRegExp(value);
	
	if (this.length > 0)
		for (var i = 0; i < this.length; i++) {
			var elem = this[i];
			if (field && (typeof elem === 'object' || ivar.isArray(elem)))
				elem = this[i][field];
			if (regex) {
				if(value.test(elem))
					return i;
			} else {
				if (elem === value)
					return i;
			}
		}
	return -1;
};

Array.prototype.findAll = function(value, field) {
	var regex = ivar.isRegExp(value);
	var result = [];
	if (this.length > 0)
		for (var i = 0; i < this.length; i++) {
			var elem = this[i];
			if (field && (typeof elem === 'object' || ivar.isArray(elem)))
				elem = this[i][field];
			if (regex) {
				if(value.test(elem))
					result.push(i);
			} else {
				if (elem === value)
					result.push(i);
			}
		}
	return result;
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

//TODO: test == ===, Conditions for Object, recursion for array value
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

Array.prototype.rm = function(id) {
	return this.splice(id, 1);
};

Array.prototype.remove = function(value) {
	if (ivar.isString(value) && ivar.regex.regex.test(value))
		return ivar.patternRemove(this, value);

	if(ivar.isRegExp(value))
		return ivar.patternRemove(this, value);
		
	var id = this.find(value);
	if (id > -1)
		return this.rm(id);
	return false;
};

ivar.patternRemove = function(obj, re) {
	if (ivar.isString(re))
		re = re.toRegExp();
	if (ivar.isArray(obj)) {
		for(var i = 0; i < obj.length; i++) {
			if(re.test(obj[i]))
				obj.rm(i);
		}
	} else if (typeof obj === 'object') {
		for(var i in obj) {
			if(re.test(i)) {
				delete obj[i];
			}
		}
	}
	return obj;
};

ivar.getAdditionalProperties = function(obj, properties, patternProperties) {
	var arr = ivar.getProperties(value);
	
	if(properties && ivar.isArray(properties))
	for(var i = 0; i < properties.length; i++) {
		arr.remove(properties[i]);
	}
	
	if(properties && ivar.isArray(patternProperties))
	for(var i = 0; i < patternProperties.length; i++) {
		arr.remove(patternProperties[i]);
	}
	
	return arr;
};

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

Array.prototype.toObject = function() {
	var res = {};
	for(var i = 0; i < this.length; i++) {
		res[i] = this[i];
	}
	return res;
};

ivar.toMapKey = function(value) {
	if (ivar.isNumber(value))
		value = value.toString();
	else if (ivar.isBool(value))
		value = 'bool_'+value;
	else if (ivar.isFunction(value))
		value = 'fn_'+value.parseName();
	else if (ivar.isDate(value))
		value = 'date_'+value.getTime();
	else if (ivar.isObject(value))
		value = 'obj_'+ivar.crc32(JSON.stringify(value));
	else if (ivar.isArray(value))
		value = 'arr_'+value.toString();
	
	return value;
};

//NOTE: Members of the array must be unique!
Array.prototype.map = function(field) {
	var mapped = {};
	for (var i = 0; i< this.length; i++) {
		var value = this[i];
		if (ivar.isSet(field)) value = this[i][field];
		
		value = ivar.toMapKey(value);
			
		!mapped.hasOwnProperty(value) ? mapped[value] = [i] : mapped[value].push(i);
	}
	return mapped;
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
	var pts = [];
	if(!ivar.regex.regex.test(val))
		pts[1] = val;
	else
		pts = ivar.regex.regex.exec(val);
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

ivar.request = function(opt, callback) {
	var defs = {
		method: 'GET',
		async: true
	};
	
	if(ivar.isSet(opt))
		ivar.extend(defs, opt);
	
    var request = new XMLHttpRequest(); 
    request.onload = function(e) {
    	var resp = request.responseText;
		if (request.status != 200) resp = undefined;		
		if(callback) callback(resp);
	}
    request.open(defs.method, defs.uri, defs.async);
    request.send(defs.messages);
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

ivar.getProperties = function(obj, re) {
	if (!re && !ivar.isString(re)) {
		var props = [];
		for(var i in obj) {
			props.push(i);
		}
		return props;
	} else {
		if(ivar.whatis(re) !== 'regexp')
			re = re.toRegExp();
		var props = [];
		for(var i in obj) {
			if(re.test(i)) {
				props.push(i);
			}
		}
		return props;
	}
};

ivar.countProperties = function(obj, fn) {
	var count = 0;
	for(var i in obj) {
		count++;
		if(fn) fn(count, i);
	}
	return count;
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
ivar.echo = function(e) {
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
ivar.warn = function warning(e) {
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
	if (ivar.whatis(obj) === type)
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
		
	var type = typeof val;
	if (type === 'object')
		type = ivar.getClass(val).toLowerCase();
		
	return type === 'number';
};

ivar.isInt = function(val) {
	return ivar.is(val, 'integer');
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

ivar.isRegExp = function(val) {
	return ivar.is(val, 'regexp');
};

ivar.isNull = function(val) {
	return val === null;
};

ivar.isUndefined = function(val) {
	return val === undefined;
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
			return 'integer';
	}
	
	return type;
};

/************ BORROWED CODE - START *************/

//Thanks to perfectionkills.com <http://perfectionkills.com/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/>
ivar.getClass = function(val) {
	return Object.prototype.toString.call(val)
		.match(/^\[object\s(.*)\]$/)[1];
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

/************ BORROWED CODE - END *************/


/*
 * jules.js
 * JULES - (another) JavaScript Schema Validator
 * Ezekiel 25:17
 *
 * @author Nikola Stamatovic Stamat < stamat@ivartech.com >
 * @copyright IVARTECH < http://ivartech.com >
 * @licence MIT
 * @since May 2013
 */
 
 
//TODO: hyper schema
//TODO: extends

var jules = {};
jules.aggregate_errors = false;
jules.dont_label = true;
jules.errors = [];
jules.error_messages = {};
//jules.error_messages['type'] = '{{schema_id}} Invalid type. Type of data should be {{key_val}}';
jules.refs = {};
jules.current_scope = null;

jules.onEachField = undefined;
jules.onEachFieldResult = undefined;
jules.onEachSchema = undefined;
jules.onEachSchemaResult = undefined;
jules.onStart = undefined;
jules.onFinish = undefined;

jules.validate = function(value, schema, nickcallback) {
	if(jules.onStart) jules.onStart(value, schema);
	jules.errors = [];
	if(ivar.isString(schema))
		schema = jules.getSchemaByReference(schema);
	jules.initScope(schema);
	var res = jules._validate(value, schema);
	if(nickcallback) nickcallback(value, schema, res); //This is how you remind me... Or is it Someday? Go suck somewhere else...
	if(jules.onFinish) jules.onFinish(value, schema, res);
	return res;
};

jules.initScope = function(schema) {
	//ivar.echo('=================');
	if(!schema.id && !jules.dont_label)
		schema.id = 'schema:'+ivar.crc32(JSON.stringify(schema));
	
	if(schema.id && !ivar.isSet(jules.refs[schema.id]))
		jules.refs[schema.id] = schema;
	
	jules.current_scope = schema;
		
	return schema;
};

jules._validate = function(value, schema, aggregate_errors) {
	if(jules.onEachSchema) jules.onEachSchema(value, schema);
	aggregate_errors = ivar.isSet(aggregate_errors)?aggregate_errors:jules.aggregate_errors;
	
	var result = true;
	
	var errors = [];
	
	for(var i in schema) {
		if(jules.current_scope.id !== schema.id && jules.refs.hasOwnProperty(schema.id)) {
			jules.current_scope = jules.refs[schema.id];
		}
		if(jules.onEachField) jules.onEachField(value, i, schema, valid);
		
		var type = ivar.whatis(value);
		if(type === 'integer' || type === 'float')
			type = 'number';
		var valid = true;
		if(jules.validator[i]) {
			valid = jules.validator[i](value, i, schema);
		} else if (jules.validator[type] && jules.validator[type][i]) {
			valid = jules.validator[type][i](value, i, schema);
		} else {
			if(jules.onEachFieldResult) jules.onEachFieldResult(value, i, schema, valid);
			continue;
		}
		//ivar.echo(schema.id+' - '+i+': '+valid);
		if(jules.onEachFieldResult) jules.onEachFieldResult(value, i, schema, valid);
		if(!valid) {
			errors.push(jules.generateErrorMessage(value, i, schema));
			if(!aggregate_errors) {
				result = false;
				break;
			}
		}
	}
	
	if(aggregate_errors && errors.length > 0) {
		jules.errors = jules.errors.concat(errors);
		result = false;
	}
	if(jules.onEachSchemaResult) jules.onEachSchemaResult(value, schema, result, errors);
	return result;
};

jules.generateErrorMessage = function(value, i, schema) {
	var key_val = schema[i];
	var val = value;
	if(ivar.isObject(value))
		value = JSON.stringify(value);
	var sch = key_val.toString();
	if(ivar.isObject(key_val))
		sch = JSON.stringify(key_val);
	var message = jules.error_messages[i]?jules.error_messages[i].template({keyword: i, value: val, schema_id: schema.id, key_val: sch}):'['+schema.id+ ']: Invalid '+i;
	return message;
}

ivar.namespace('jules.validator');

// ====== [Validators]: Any Type ====== //

jules.validator._min = function(value, min) {
	if(!min.exclusive)
		min.exclusive = false;
	return min.exclusive?min.value<value:min.value<=value;
};

jules.validator._max = function(value, max) {
	if(!max.exclusive)
		max.exclusive = false;
	return max.exclusive?max.value>value:max.value>=value;
};

jules.validator._range = function(value, i, schema, exclusive) {
	if(!ivar.isSet(value) || ivar.isBool(value)) return true;
	
	var mm = schema[i];
	var fn = '_'+i.substring(0, 3);
	var type = ivar.whatis(value);
	if(type === 'float')
		type = 'number';
	
	if(type === 'object') {
		value = ivar.countProperties(value); 
	} else if (value.hasOwnProperty('length')) {
		value = value.length;
	}
	
	if(ivar.isNumber(mm))
		mm = jules.buildRangeObj(mm, exclusive);
		
	if (ivar.isObject(mm)) {
		if(mm.hasOwnProperty('type') && type !== mm.type)
			return true;
		mm = [mm];
	}
	
	var other_types = null;
	
	if (ivar.isArray(mm)) {
		for(var i = 0; i < mm.length; i++) {
			if(mm[i].hasOwnProperty('type')) {
				if(type === mm[i].type)
					return jules.validator[fn](value, mm[i]);
			} else {
				if(!other_types) other_types = mm[i];
			}
		}
	}
	
	if(other_types)
		return jules.validator[fn](value, other_types);
		
	return true;
};

jules.validator.min = jules.validator._range;
jules.validator.max = jules.validator._range;

//+contition
jules.validator._if = function(value, if_obj) {
	var not = ivar.isSet(if_obj['not'])? if_obj['not']: false;
	var cond_res = jules._validate(value, if_obj['condition']);
	var bool = not? !cond_res: cond_res;
	if(bool) {
		return jules._validate(value, if_obj['then']);
	} else {
		if(ivar.isSet(if_obj['else']))
			return jules._validate(value, if_obj['else']);
	}
	return true;
};

jules.validator['if'] = function(value, i, schema) {
	var if_obj = schema[i];
	if (ivar.isArray(if_obj)) {
		for (var i = 0; i < if_obj.length; i++) {
			if(!jules.validator._if(value, if_obj[i]))
				return false;
		}
	} else {
		return jules.validator._if(value, if_obj);
	}
	return true;
};

//@see jules.validator.requiredProperties
jules.validator.required = function(value, i, schema) {
	var bool = schema[i];
	if(ivar.isArray(bool))
		return jules.validator.object.requiredProperties(value, i, schema);
	return bool ? value !== undefined : true;
};

jules.validator._enum = function(value, i, schema, not) {
	if(ivar.isArray(schema[i]))
		schema[i] = schema[i].map();
		
	value = ivar.toMapKey(value);
	var res = schema[i].hasOwnProperty(value);
	return not? !res: res;
}; 

jules.validator.only = jules.validator._enum;

jules.validator.enum = jules.validator._enum;
 
jules.validator.forbidden = function(value, i, schema) {
	return jules.validator._enum(value, i, schema, true);
};

jules.validator.type = function(value, i, schema) {
	var type = schema[i];
	if(type === 'any' || type === '*' || type === '')
		return true;
		
	if(ivar.isArray(type)) {
		for(var i = 0; i < type.length; i++) {
			if(ivar.is(value, type[i]))
				return true;
		}
		return false;
	} else {
		return ivar.is(value, type);
	}
};

jules.validator.allow = jules.validator.type;

jules.validator.disallow = function(value, i, schema) {
	var type = schema[i];
	if(ivar.isArray(type)) {
		for(var i = 0; i < type.length; i++) {
			if(ivar.is(value, type[i]))
				return false;
		}
		return true;
	} else {
		return !ivar.is(value, type);
	}
};

jules.validator._allOf = function(value, schema_arr) {
	for(var i = 0; i < schema_arr.length; i++) {
		if(!jules._validate(value, schema_arr[i]))
			return false;
	}
	return true;
};

jules.validator.allOf = function(value, i, schema) {
	var key_val = schema[i];
	if(!ivar.isArray(value)) {
		return jules.validator._allOf(value, key_val);
	} else {
		for(var i = 0; i < value.length; i++) {
			if(!jules.validator._allOf(value[i], key_val))
				return false;
		}
		return true;
	}
};

jules.validator._anyOf = function(value, schema_arr) {
	for(var i = 0; i < schema_arr.length; i++) {
		if(jules._validate(value, schema_arr[i]))
			return true;
	}
	return false;
};

jules.validator.anyOf = function(value, i, schema) {
	var key_val = schema[i];
	if(!ivar.isArray(value)) {
		return jules.validator._anyOf(value, key_val);
	} else {
		for(var i = 0; i < value.length; i++) {
			if(!jules.validator._anyOf(value[i], key_val))
				return false;
		}
		return true;
	}
};

jules.validator._oneOf = function(value, schema_arr) {
	var passed = 0;
	for(var i = 0; i < schema_arr.length; i++) {
		if(jules._validate(value, schema_arr[i], false))
			passed += 1;
	}
	return passed === 1;
}

jules.validator.oneOf = function(value, i, schema) {
	var key_val = schema[i];
	if(!ivar.isArray(value)) {
		return jules.validator._oneOf(value, key_val);
	} else {
		for(var i = 0; i < value.length; i++) {
			if(!jules.validator._oneOf(value[i], key_val))
				return false;
		}
		return true;
	}
};

jules.validator._not = function(value, schema_arr) {
	for(var i = 0; i < schema_arr.length; i++) {
		if(jules._validate(value, schema_arr[i], false))
			return false;
	}
	return true;
}

jules.validator.not = function(value, i, schema) {
	var key_val = schema[i];
	if(ivar.isObject(key_val))
		key_val = [key_val];
	if(!ivar.isArray(value)) {
		return jules.validator._not(value, key_val);
	} else {
		for(var i = 0; i < value.length; i++) {
			if(!jules.validator._not(value[i], key_val))
				return false;
		}
		return true;
	}
};

//TODO: REFERENCE RESOLVE!!! Needs refactoring in order to work
//XXX: has _validate, current, refs, getSchema
jules.getScope = function(ref, stack) {
	if(!stack.hasOwnProperty(ref)) {
		jules.getSchema(ref, function(ref_schema) {
			if(!ivar.isSet(ref_schema.id))
				ref_schema.id = ref;  //TODO: check why I wrote these lines
			else
				ref = ref_schema.id;
			jules.initScope(ref_schema);
		});
	}
	return stack[ref];
};

jules.getFragment = function(ref, scope) {
	if(ref.startsWith('/')) ref = ref.removeFirst();
	var props = ref.split('/');
	var schema = scope;
	for(var i = 0; i < props.length; i++) {
		props[i] = decodeURIComponent(props[i]);
		if(schema.hasOwnProperty(props[i])) {
			schema = schema[props[i]];
		} else {
			return undefined;
		}
	}
	
	if(!schema.id)
		schema.id = ref;
		
	return schema;
};

jules.getSchemaByReference = function(ref) {
	//TODO: $ref: '#', referencing itself
	var schema = null;
	var parts = ref.split('#');
	if(ivar.isSet(parts[0]) && parts[0].length > 0) {
		schema = jules.getScope(parts[0], jules.refs);
	}
	
	if(ivar.isSet(parts[1]) && parts[1].length > 0) {
		schema = jules.getFragment(parts[1], jules.current_scope);
	}
	
	//TODO:
	if(parts[0].length === 0 && parts[1].length === 0)
		schema = jules.current_scope;
		
	return schema;
};

jules.validator.$ref = function(value, i, schema) {
	return jules._validate(value, jules.getSchemaByReference(schema[i]));
};

jules.validator['extends'] = function (value, i, schema) {
	//TODO: jules.validator.extended
	return true;
};

jules.validateSchema = function(schema, metaschema) {
	if(!metaschema && schema.hasOwnProperty('$schema'))
		metaschema = jules.getSchemaByReference(schema.$schema);
	if(metaschema && ivar.isString(metaschema))
		metaschema = jules.getSchemaByReference(metaschema);
		
	return jules._validate(schema, metaschema);
};

ivar.namespace('jules.validator.object');

// ====== [Validators]: Object ====== //

//XXX: has _validate
jules.validator.object.dependencies = function(value, i, schema) {
	var dep = schema[i];
	for(var i in dep) {
		//TODO: if (ivar.regex.regex.test(i)) {
		if(ivar.isArray(dep[i])) {
			if(value.hasOwnProperty(i))
				for(var j = 0; j < dep[i].length; j++) {
					if(!value.hasOwnProperty(dep[i][j]))
						return false;
				}
		} else {
			if(value.hasOwnProperty(i))
				if(!jules._validate(value, dep[i]))
						return false;
		}
	}
	return true;
};

jules.validator.object.requiredProperties = function(value, i, schema) {
	var arr = schema[i];
	for(var i = 0; i < arr.length; i++) {
		if(!value.hasOwnProperty(arr[i]))
			return false;
	}
	return true;
};

//XXX: has _validate
jules._property = function(value, prop, schema, bool) {
	if(value.hasOwnProperty(prop)) {
		if(!jules._validate(value[prop], schema[prop]))
			return false;
	} else {
		if(!bool)
			return false;
	}
	
	return true;
};

//XXX: has _validate
jules._patternProperty = function(value, prop, schema, bool) {
	var found = ivar.getProperties(value, prop);
	for(var j = 0; j < found.length; j++) {
		if (!jules._validate(value[found[j]], schema[prop]))
			return false;
	}
	if (!bool && found.length === 0) return false;
		
	return true;
};

jules.validator.object.patternProperties = function(value, i, schema) {
	var prop = schema[i];
	for(var i in prop) {
		if (!jules._patternProperty(value, i, prop))
			return false;
	}
	return true;
};

jules.validator.object.properties = function(value, i, schema, bool) {
	var prop = schema[i];
	if(!ivar.isSet(bool))
		bool = true;
	for(var i in prop) {
		if (ivar.regex.regex.test(i)) {
			if (!jules._patternProperty(value, i, prop, bool))
				return false;
		} else {
			if (!jules._property(value, i, prop, bool))
				return false;
		}
	}
	return true;
};

jules.validator.object.additionalProperties = function(value, i, schema) {
	var prop = schema[i];
	if (ivar.isObject(prop)) {
		return jules._validateAdditionalProperties(value, i, schema);
	} else {
		if (prop === false) {
			return !jules._getAdditionalProperties(value, i, schema).length > 0;
		}
	}
	return true;
};

jules._validateAdditionalProperties = function(value, i, schema) {
	var arr = jules._getAdditionalProperties(value, i, schema);
	var additional_schema = schema[i];
	for(var i = 0; i < arr.length; i++) {
		if(value.hasOwnProperty(arr[i]) && !jules._validate(value[arr[i]], additional_schema))
			return false;
	}
	return true;
};

jules._getAdditionalProperties = function(value, i, schema) {
	var arr = ivar.getProperties(value);
	
	if(schema.hasOwnProperty('properties')) {
		for(var i in schema.properties) {
			arr.remove(i);
		}
	}
	
	if(schema.hasOwnProperty('patternProperties')) {
		for(var i in schema.patternProperties) {
			i = i.toRegExp();
			arr.remove(i);
		}
	}
	return arr;
};

jules.validator._propertyRange = function(obj, del) {
	var count = 0;
	for(var i in obj) {
		count++;
		if(count > del)
			break;
	}
	return count;
};

jules.validator.object.minProperties = function(value, i, schema) {
	var count = jules.validator._propertyRange(value, schema[i]);
	return count >= schema[i];
};

jules.validator.object.maxProperties = function(value, i, schema) {
	var count = jules.validator._propertyRange(value, schema[i]);
	return count <= schema[i];
};

// ====== [Validators]: Array ====== //
ivar.namespace('jules.validator.array');

jules.validator.array.unique = function(value) {
	var aggr = {};
	for(var i = 0; i < value.length; i++) {
		var val = ivar.toMapKey(value[i]);
		if(!aggr.hasOwnProperty(val)) {
			aggr[''+val] = 1;
		} else {
			return false;
		}
	}
	return true;
};

jules.validator.array.uniqueItems = jules.validator.array.unique;

//XXX: this one has _validate
jules.validator.array.items = function(value, i, schema) {
	schema = schema[i];
	if(ivar.isObject(schema)) {
		for(var i = 0; i < value.length; i++) {
			var valid = jules._validate(value[i], schema);
			if(!valid) return false;
		}
		return true;
	} else {
		for(var i = 0; i < schema.length; i++) {
			var valid = jules._validate(value[i], schema[i]);
			if(!valid) return false;
		}
		return true;
	}
};

jules.validator.array.additionalItems = function(value, i, schema) {
	if(schema[i]) return true;
	return value.length <= schema.items.length;
};

jules.validator.array.minItems = jules.validator.min;
jules.validator.array.maxItems = jules.validator.max;

// ====== [Validators]: String ====== //
ivar.namespace('jules.validator.string');
jules.validator.string.regex = function(value, i, schema) {
	var regex = schema[i];
	if(!ivar.isString(value))
		value = value.toString();
	if(!(regex instanceof RegExp))
		regex = jules.buildRegExp(schema[i]);	
	return regex.test(value);
};

jules.validator.string.pattern = jules.validator.string.regex;

jules.formats = {}; //date-time YYYY-MM-DDThh:mm:ssZ, date YYYY-MM-DD, time hh:mm:ss, utc-milisec, regex, color, style, phone E.123, uri, url, email, ipv4, ipv6, host-name
jules.formats.email = function(value) {
	return ivar.regex.email.test(value);
};

jules.formats.regex = function(value) {
	if(!value.toRegExp())
		return false;
	return true;
};

jules.formats.time = function(value) {
	return ivar.regex.time.test(value);
};

jules.formats.uri = function(value) {
	return ivar.regex.uri.test(value);
};

jules.validator.string.format = function(value, i, schema) {
	return jules.formats[schema[i]](value);
};

jules.validator.string.minLength = jules.validator.min;
jules.validator.string.maxLength = jules.validator.max;

// ====== [Validators]: Number ====== //
ivar.namespace('jules.validator.number');

jules.validator.number.numberRegex = jules.validator.string.regex;
jules.validator.number.numberPattern = jules.validator.string.regex;

jules.validator.number.numberFormat = jules.validator.string.format;

jules.validator.number.minimum = jules.validator.min;
jules.validator.number.maximum = jules.validator.max;

jules.validator.number.exclusiveMinimum = function(value, i, schema) {
	return jules.validator.min(value, 'minimum', schema, schema[i]);
};

jules.validator.number.exclusiveMaximum = function(value, i, schema) {
	return jules.validator.max(value, 'maximum', schema, schema[i]);
};

jules.validator.number.dividableBy = function(value, i, schema) {
	if(schema[i] === 0)
		return false;
	return value%schema[i] === 0;
};
jules.validator.number.multipleOf = jules.validator.number.dividableBy;

// ====== Some utils... ====== //

jules.buildRangeObj = function(val, exclusive) {
	if(ivar.isString(val))
		val = parseFloat(val);
	if(!ivar.isSet(exclusive))
		exclusive = false;
	return ivar.isNumber(val)?{value:val, exclusive: exclusive}:val;
};

jules.buildRegExp = function(val) {
	if(!ivar.isString(val))
		val = val.toString();
	var re = val.toRegExp();
	if(re)
		return re;
	else
		jules.error('Malformed regexp!');
};

jules.error = function(msg) {
	var heading = 'jules [error]: ';
	ivar.error(heading + msg);
};

jules.getSchema = function(uri, callback) {
	var resp = undefined;
	ivar.request({uri: uri, async:false}, function(response) {
		if(ivar.isSet(response)) {
			try {
				resp = JSON.parse(response);
			} catch(e) {
				jules.error('Invalid Schema JSON syntax - ' + e);
			}
		} else {
			jules.error('Reference not accessible');
		}
	});
	callback(resp);
};
