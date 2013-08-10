/**
 *	Non binary tree data structure with parent references for reverse traversing.
 *	Accepts a path, that is, an array consisted of names for nodes, and can, but doesn't have too store the value at the end of the chain. *Note: Nodes must be named, names can be any data type, names uniquely deifne the node. Value field of a node is by default null. If it is undefined it is considered that node doesnt exist
 *
 *	@author		Nikola Stamatovic Stamat <stamat@ivartech.com>
 *	@copyright	IVARTECH http://ivartech.com
 *	@version	20130809  
 *	@file
 *
 *	@namespace	ivar.data
 */

ivar.namespace('ivar.data');

/**
 *	Sufficient to manifest a Node tree itself, but contains only Node-wise methods
 *	Which means that it needs a controler in order to offer a full tree functionality
 *	@class
 */
ivar.data.Node = function(name, parent, value) {
	this.children = [];
	if(name === undefined) throw 'Node must have a name';
	this.name = name;
	value !== undefined ? this.value = value : this.value = null;
	parent !== undefined ? this.parent = parent : this.parent = null;
	this.level = 0;
};

ivar.data.Node.prototype.getChildID = function(val, field) {
	if(field === undefined) field = 'name';
	for (var i = 0; i < this.children.length; i++) {
		if(ivar.equal(this.children[i][field], val))
			return i;
	}
};

ivar.data.Node.prototype.getChild = function(val, field) {
	var id = this.getChildID(val, field);
	if(id !== undefined)
		return this.children[id];
};

ivar.data.Node.prototype.removeChild = function(val, field) {
	var id = this.getChildID(val, field);
	if(id !== undefined)
		return this.children.splice(id, 1);
};

ivar.data.Node.prototype.remove = function() {
	return this.parent.removeChild(this.name);
};

ivar.data.Node.prototype.childExists = function(val, field) {
	return this.getChild(val, field) !== undefined;
};

ivar.data.Node.prototype.hasChildren = function() {
	return this.children.length > 0;
};

ivar.data.Node.prototype.addChild = function(name, value) {
	var node = this.getChild(name);
	if(node  === undefined) {
		node = new ivar.data.Node(name, this, value);
		this.children.push(node);
	} else {
		if(value !== undefined)
			node.value = value;
	}
	if(node.parent !== null)
		node.level = node.parent.level+1;
	return node;
};


/**
 *	Tree class with methods of storing, getting and removing path of nodes
 *	@class
 */
ivar.data.Tree = function() {
	this.root = new ivar.data.Node('root');
};

ivar.data.Tree.prototype.clear = function() {
	this.root = new ivar.data.Node('root');
};

ivar.data.Tree.prototype.put = function(path, val, root) {
	var curr = this.root;
	if(root !== undefined)
		curr = root;
	for(var i = 0; i < path.length; i++) {
		if(i === path.length-1) {
			curr.addChild(path[i], val);
			break;
		}
		curr = curr.addChild(path[i]);
	}
};

ivar.data.Tree.prototype.exists = function(path, root) {
	return this.get(path, root) !== undefined;
};

ivar.data.Tree.prototype.get = function(path, root) {
	var curr = this.root;
	if(root !== undefined)
		curr = root;
	for(var i = 0; i < path.length; i++) {
		curr = curr.getChild(path[i]);
		if(curr === undefined) break;
		if(i === path.length-1) {
			return curr;
		}
	}
};

ivar.data.Tree.prototype.getValue = function(path, root) {
	var res = this.get(path, root);
	if(res !== undefined)
		return res.value;
};

ivar.data.Tree.prototype.remove = function(path, root) {
	var res = this.get(path, root);
	if(res !== undefined)
		return res.remove();
};

ivar.data.Tree.prototype.each = function(fn, root) {
	var curr = this.root;
	if(root !== undefined)
		curr = root;
		
	var traverse = function(node) {
		for(var i = 0; i < node.children.length; i++) {
			fn(node.children[i]);
			if(node.children[i].hasChildren()) {
				traverse(node.children[i]);
			}
		}
	};
	
	traverse(curr);
};

ivar.data.Tree.prototype.getLeaves = function() {
	var res = [];
	this.each(function(n){
		if(!n.hasChildren()) res.push(n);
	});
	return res;
};

ivar.data.Tree.prototype.getPaths = function() {
	var paths = [];
	
	var leaves = this.getLeaves();
	
	for(var i = 0; i < leaves.length; i++) {
		var path = [];
		var node = leaves[i];
		while(node.parent !== null) {
			path[node.level-1] = node.name;
			node = node.parent;
		}
		paths.push(path);
	}
	
	return paths;
};


/**
 *	Builds a tree out of passed object
 */
ivar.data.Tree.prototype.parse = function(obj) {
	var curr = this.root;
	var parseObject = function(obj, parent) {
		for(var i in obj) {
			var node = parent.addChild(i);
			if(Object.prototype.toString.call(obj[i])
		.match(/^\[object\s(.*)\]$/)[1].toLowerCase() === 'object') {
				parseObject(obj[i], node);
			} else {
				node.value = obj[i];
			}
		}
	};
	
	parseObject(obj, curr);
	this.root = curr;
	return this;
};

/**
 *	Builds an object out of the current tree
 */
ivar.data.Tree.prototype.build = function() {
	var res = {};
	
	var traverse = function(node, obj) {
		for(var i = 0; i < node.children.length; i++) {
			if(node.children[i].hasChildren()) {
				obj[node.children[i].name] = {};
				traverse(node.children[i], obj[node.children[i].name]);
			} else {
				obj[node.children[i].name] = node.children[i].value;
			}
		}
	}
	
	traverse(this.root, res);
	return res;
};
