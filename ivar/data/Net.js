ivar.namespace('ivar.data');

ivar.data.NetNode = function(name, parent, value, end) {
	this.children = {};
	if(name === undefined) throw 'Node must have a name';
	this.name = name;
	this.value = value !== undefined ? value : null;
	this.parent = parent ? parent : null;
	this.end = end !== undefined ? end : null;
	this.level = 0;
};

ivar.data.NetNode.prototype.findChildren = function(value, field) {
	var res = [];	
	for(var i in this.children) {
			
	}
};

ivar.data.NetNode.prototype.findChild = function(value, field) {
	for(var i in this.children) {
		if()
	}
};

ivar.data.NetNode.prototype.getChild = function(id) {
	return this.children[id];
};

ivar.data.NetNode.prototype.removeChild = function(id) {
	delete this.children[val];
};

ivar.data.NetNode.prototype.remove = function() {
	return this.parent.removeChild(this.name);
};

ivar.data.NetNode.prototype.equals = function(node) {
	if(this === node) return true;
	if(this.end !== node.end) return false;
	if(!ivar.equal(this.name, node.name)) return false;
	if(!ivar.equal(this.value, node.value)) return false;
	if(this.children.length !== node.children.length) return false;
	for(var i = 0; i < this.children.length; i++) {
		if(!this.children[i].equals(node.children[i])) return false;
	}
	return true;
};

ivar.data.NetNode.prototype.childExists = function(val, field) {
	return this.getChild(val, field) !== undefined;
};

ivar.data.NetNode.prototype.hasChildren = function() {
	return !ivar.isEmpty(this.children);
};

ivar.data.NetLevel = function(label, content) {
	this.label = label ? label : null;
	this.content = content ? content : {};
}

ivar.data.NetTree = function() {
	this.levels = [];
};

ivar.data.NetTree.prototype.buildLevels = function(level_labels) {
	if(ivar.isObject(level_labels)) {
		var count = 0;
		for (var i in level_labels) {
			this.levels[count] = new ivar.data.NetLevel(i, level_labels[i]);
			count++;	
		}
		return;
	};

	if(ivar.isString(level_labels)) level_labels = [level_labels];

	for (var i = 0; i < level_labels.length; i++) {
		this.levels[i] = new ivar.data.NetLevel(level_labels[i]);
	}
};

ivar.data.NetTree.prototype.getLevelID = function(label) {
	return this.levels.find(label, 'label');
};

ivar.data.NetTree.prototype.getLevel = function(id) {
	if(ivar.isNumber(id)) return this.levels[id];
	return this.levels[this.getLevelID(id)];
};

ivar.data.NetTree.prototype.getNode = function(level, node, feild) {
	level = this.getLevel(level).content;
	for	(var i in level) {
		if()
	}
};


ivar.data.Net.prototype.put = function(path) {
	for (var i = 0; i < path.length; i++) {
		if (!this.levels[path[i]]) this.levels[path[i]] = {};
		if(ivar.isEmpty(this.levels[i]) || !this.levels[i].hasOwnProperty(path[i])) {
			this.levels[i][path[i]] = new ivar.data.NetNode(path[i]);
		}
	}
};

ivar.data.Net.prototype.

