ivar.namespace('ivar.data');

ivar.data.NetNode = function(name, parent, value, end) {
	this.children = {};
	if(name === undefined) throw 'Node must have a name';
	this.name = name;
	value !== undefined ? this.value = value : this.value = null;
	parent !== undefined ? this.parent = parent : this.parent = null;
	end !== undefined ? this.end = end : this.end = false;
	this.level = 0;
};

ivar.data.NetNode.prototype.getChild = function(id) {
	return this.children[id];
};

ivar.data.NetNode.prototype.removeChild = function(val, field) {
	var id = this.getChildID(val, field);
	if(id !== undefined)
		return this.children.splice(id, 1);
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

ivar.data.Net = function() {
	this.levels = [];
};

ivar.data.Net.prototype.existsInLevel() {

}

ivar.data.Net.prototype.put = function(path) {
	for (var i = 0; i < path.length; i++) {
		if (!this.levels[i]) this.levels[i] = {};
		if(ivar.isEmpty(this.levels[i]) || )
	}
};

ivar.data.Net.prototype.

