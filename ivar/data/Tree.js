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
ivar.data.Node = function(name, parent, value, end) {
	this.children = [];
	if(name === undefined) throw 'Node must have a name';
	this.name = name;
	value !== undefined ? this.value = value : this.value = null;
	parent !== undefined ? this.parent = parent : this.parent = null;
	end !== undefined ? this.end = end : this.end = false;
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

ivar.data.Node.prototype.addChild = function(name, value, end) {
	var node = this.getChild(name);
	if(node  === undefined) {
		node = new ivar.data.Node(name, this, value, end);
		this.children.push(node);
	} else {
		if(value !== undefined) node.value = value;
		if(end !== undefined) node.end = end;
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
	this.length = 0;
};

ivar.data.Tree.prototype.clear = function() {
	this.root = new ivar.data.Node('root');
};

ivar.data.Tree.prototype.put = function(path, val, root) {
	var curr = this.root;
	if(root !== undefined)
		curr = root;
	if(this.length < path.length) this.length = path.length;
	
	for(var i = 0; i < path.length; i++) {
		if(i === path.length-1) {
			curr = curr.addChild(path[i], val, true);
			break;
		}
		curr = curr.addChild(path[i]);
	}
	return curr;
};

ivar.data.Tree.prototype.pathExists = function(path, root) {
	return this.get(path, root) !== undefined;
};

ivar.data.Tree.prototype.exists = function(path) {
	var node = this.get(path, this.root);
	return node !== undefined && node.end;
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
	var node = this.get(path, root);
	if(node !== undefined)
		return node.value;
};

ivar.data.Tree.prototype.remove = function(path, root) {
	var node = this.get(path, root);
	if(node !== undefined) {
		var res = node.remove();
		this.length = this.countLevels();
		return res;
	}
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

//TODO: doesnt work as it should
ivar.data.Tree.prototype.getLevel = function(level, root) {
	
	if(root === undefined) root = this.root;	
	var l = 0;
	
	var traverse = function(nodes) {
		var all_children = [];
		for(var i = 0; i < nodes.length; i++) {
			if(nodes[i].hasChildren())
				all_children = all_children.concat(nodes[i].children);
		}
		
		if(level !== undefined && level === l) return all_children;
		
		l++;
		
		if(all_children.length > 0)
			return traverse(all_children);
	};
	
	return traverse(root.children);
};

ivar.data.Tree.prototype.countLevels = function(root) {
	if(root === undefined) root = this.root;	
	var l = 0;
	
	var traverse = function(nodes) {
		l++;
		var all_children = [];
		for(var i = 0; i < nodes.length; i++) {
			if(nodes[i].hasChildren()) {
				all_children = all_children.concat(nodes[i].children);
			}
		}
		
		if(all_children.length > 0)
			traverse(all_children);
	};
	
	traverse(root.children);
	
	return l;
};


ivar.data.Tree.prototype.bfTraverseDown = function(fn, level, root) {
	if(root === undefined) root = this.root;	
	var l = 0;
	
	var traverse = function(nodes) {
		l++;
		var all_children = [];
		for(var i = 0; i < nodes.length; i++) {
			fn(nodes[i]);
			if(nodes[i].hasChildren()) {
				all_children = all_children.concat(nodes[i].children);
			}
		}
		
		if(level !== undefined && level === l) return all_children;
		
		if(all_children.length > 0)
			traverse(all_children);
	};
	
	traverse(root.children);
};

ivar.data.Tree.prototype.getLeaves = function() {
	var res = [];
	this.each(function(n){
		if(!n.hasChildren()) res.push(n);
	});
	return res;
};

ivar.data.Tree.prototype.equals = function() {
	//TODO
};

ivar.data.Tree.prototype.find = function(val, field) {
	var res = [];
	if(field === undefined) field = 'name';
	this.each(function(n){
		if(ivar.equal(n[field], val)) res.push(n);
	});
	return res;
};

ivar.data.Tree.prototype.getEnds = function() {
	return this.find(true, 'end');
};

ivar.data.Tree.prototype.traverseUp = function(node, field) {
	var path = [];
	var n = node;
	var f;
	while(n.parent !== null) {
		field !== undefined && n.hasOwnProperty(field) ? f = n[field] : f = n;
		path[n.level-1] = f;
		n = n.parent;
	}
	return path;
};

ivar.data.Tree.prototype.getPaths = function(set, field) {
	var paths = [];
	for(var i = 0; i < set.length; i++) {
		paths.push(this.traverseUp(set[i], field));
	}
	return paths;
};

ivar.data.Tree.prototype.getEntries = function() {
	return this.getPaths(this.getEnds(), 'name');
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
