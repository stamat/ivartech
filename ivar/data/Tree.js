/**
 *	Non binary tree data structure with parent references for reverse traversing.
 *	Accepts a chain of names for nodes, and can, but doesn't have too store the value at the end of the chain. *Note: Nodes must be named, names can be any data type, names uniquely deifne the node. Value field of a node is by default null. If it is undefined it is considered that node doesnt exist
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
 *	Tree class with methods of storing, getting and removing chain of nodes
 *	@class
 */
ivar.data.Tree = function() {
	this.root = new ivar.data.Node('root');
};

ivar.data.Tree.prototype.put = function(chain, val, root) {
	var curr = this.root;
	if(root !== undefined)
		curr = root;
	for(var i = 0; i < chain.length; i++) {
		if(i === chain.length-1) {
			curr.addChild(chain[i], val);
			break;
		}
		curr = curr.addChild(chain[i]);
	}
};

ivar.data.Tree.prototype.exists = function(chain, root) {
	return this.get(chain, root) !== undefined;
};

ivar.data.Tree.prototype.get = function(chain, root) {
	var curr = this.root;
	if(root !== undefined)
		curr = root;
	for(var i = 0; i < chain.length; i++) {
		curr = curr.getChild(chain[i]);
		if(curr === undefined) break;
		if(i === chain.length-1) {
			return curr;
		}
	}
};

ivar.data.Tree.prototype.getValue = function(chain, root) {
	var res = this.get(chain, root);
	if(res !== undefined)
		return res.value;
};

ivar.data.Tree.prototype.remove = function(chain, root) {
	var res = this.get(chain, root);
	if(res !== undefined)
		return res.remove();
};
