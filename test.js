require('ivar.html');
require('ivar.test.*');
require('ivar.patt.Events');
require('ivar.data.StringTree');
require('ivar.data.Graph')

function test() {
	ivar.print(a);
	ivar.print(b);
}

function asd() {
	var test = ['omgzlol','omfg','lol'];
	var test1 = ['omgzlol','rofl','zlol', 'yolo'];
	var test2 = ['rofl'];
	var st = new ivar.data.StringTree();
	st.put(test);
	st.put(test1);
	st.put(test2);
	var t = 'Little Nole is cute!';
	print(t.insert('Lepi and ', 'Nole').swap('is', 'are'));
	//st.put('omg');
	//st.put('foo');
	//st.put('fool');
	var u = setUniqueObject().__uid__;
	print(u);
	print(window[u]);
	print(uid());
	print(st);
	print(st.find(['omgzlol','omfg','lol']));
	namespace('ivar.lol.omg');
	ivar.lol.omg.zomg = 'yes!';
	print(ivar.lol.omg.zomg);
	var h = html.create('h1');
	h.innerHTML = 'lol!';
	var b = document.body;
	b.appendChild(h);
	
	function    Lol  () {
	
	}
	
	Lol.method(function rofl(){return 'lolzors'});
	
	var lol = new Lol();
	print(lol);
	print(lol.rofl());
	
	var g = new ivar.data.Graph();
	g.addNode('a');
	g.addNode('b');
	g.link({label: 'knows', distance: 26 },'a','b');
	g.link({label: 'knows', distance: 0 },'a');
	print(g);
}

ready(test);
ready(asd);
