ivar.namespace('ivar.data');

ivar.data.Node = function(item, root) {
	this.children = {};
	this.item = null;
	if(item !== undefined);
		this.item = item;
	this.root = null;
	if(root !== undefined);
		this.root = root;
};

ivar.data.Node.prototype.put = function(key, item) {
	var node;
	if(!this.children.hasOwnProperty(key)) {
		node = new ivar.data.Node(item, this);
		this.children[key] = node;
	} else {
		node = this.children[key];
		if(item !== undefined)
			node.item = item;
	}
	return node;
}

ivar.data.Tree = function(item) {
	this.root = new ivar.data.Node(item, this.root);
};

ivar.data.Tree.prototype.put = function(arr, val, curr) {
	if(curr === undefined)
		curr = this.root;
	for(var i = 0; i < arr.length; i++) {
		if(i === arr.length-1) {
			curr.put(arr[i], val);
			break;
		}

		curr = curr.put(arr[i]);
		
	}
};

ivar.data.Tree.prototype.get = function(arr) {
	
};

ivar.data.Tree.prototype.find = function(string) {
	
};

ivar.data.Tree.prototype.remove = function(string) {
	
};
