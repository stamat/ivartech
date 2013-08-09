ivar.namespace('ivar.data');

ivar.data.Node = function(name, parent, value, any) {
	this.children = [];
	if(name === undefined) throw 'Node must have a name';
	this.name = name;
	value !== undefined ? this.value = value : this.value = null;
	parent !== undefined ? this.parent = parent : this.parent = null;
	any !== undefined ? this.any = root : this.any = false;
	this.level = 0;
};

ivar.data.Node.prototype.getChild = function(val, field) {
	if(field === undefined) field = 'name';	
	var any;

	for (var i = 0; i < this.children.length; i++) {
		if(this.children[i].any)
			any = this.children[i];
		if(ivar.equal(this.children[i][field], val))
			return this.children[i];
	}
	return any;
};

ivar.data.Node.prototype.removeChild = function(val, field) {
	if(field === undefined) field = 'name';
	
	for (var i = 0; i < this.children.length; i++) {
		if(ivar.equal(this.children[i][field], val)) {
			return this.children.splice(i, 1);
		}
	}
};

ivar.data.Node.prototype.childExists = function(val, field) {
	return this.getChild(val, field) !== undefined;
};

ivar.data.Node.hasChildren = function() {
	return this.children.length > 0;
};

ivar.data.Node.prototype.addChild = function(name, value, any) {
	var node = this.getChild(name);
	if(node  === undefined) {
		node = new ivar.data.Node(name, this, value, any);
		this.children.push(node);
	} else {
		if(value !== undefined)
			node.value = value;
		if(any !== undefined)
			node.any = any;
	}
	if(node.parent !== null)
		node.level = node.parent.level+1;
	return node;
};



ivar.data.Tree = function(any_trigger) {
	this.any_trigger = any_trigger;
	this.root = new ivar.data.Node('root');
};

ivar.data.Tree.prototype.put = function(chain, val, curr) {
	if(curr === undefined)
		curr = this.root;
	for(var i = 0; i < chain.length; i++) {
		if(i === chain.length-1) {
			curr.addChild(chain[i], val);
			break;
		}

		curr = curr.addChild(chain[i]);
		if(ivar.equal(this.any_trigger, chain[i]))
			curr.any = true;
		
	}
};

ivar.data.Tree.prototype.exists = function(arr) {

}

ivar.data.Tree.prototype.get = function(arr) {
	
};

ivar.data.Tree.prototype.find = function(string) {
	
};

ivar.data.Tree.prototype.remove = function(string) {
	
};
