ivar.require('ivar/html.js');
ivar.require('ivar.test.*');
ivar.require('ivar.patt.Events');
ivar.require('ivar.data.StringTree');
ivar.require('ivar.data.Graph');
ivar.require('ivar.data.Map');
ivar.require('http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js');
ivar.require('ivar.net.Communication');

function assertFalse(bool) {
	console.error(!bool);
}

function assertTrue(bool) {
	console.error(bool);
}

function test() {
	ivar.echo(a);
	ivar.echo(b);


	var map = new ivar.data.Map();
var map1 = new ivar.data.Map({a:1, b:2});

console.log(map.length); //0
console.log(map1.length); //2

map.put('foo', 1);
console.log(map.length); //1
console.log(map.keys()); //['foo'];
console.log(map1.keys());//['a','b'];
map1.remove('a');
console.log(map1.get('b')); //2
console.log(map1.keys());//['b'];
map1.incorporate({c:3,d:4,e:5});
console.log(map1.keys()); //['b','c','d','e'];
console.log(map1.length); //4
console.log(map1.getFirst()); // 2
console.log(map1.getLast()); // 5
map1.put('b',15)
console.log(map1.getById(0)); // 15
console.log(map.equals(map1)); //false
map1.clear();
map1.put('foo',1);
console.log(map.equals(map1)); //true
}

function asd() {
	var test = ['omgzlol','omfg','lol'];
	var test1 = ['omgzlol','rofl','zlol', 'yolo'];
	var test2 = ['rofl'];
	var st = new ivar.data.StringTree();
	st.put(test);
	st.put(test1);
	st.put(test2);
	//st.put('omg');
	//st.put('foo');
	//st.put('fool');
	
	var out = ivar.def({
		'int': function(a) {
			alert('Here is int '+a);
		},
		
		'float': function(a) {
			alert('Here is float '+a);
		},
		
		'string': function(a) {
			alert('Here is string '+a);
		},
		
		'int,string': function(a, b) {
			alert('Here is an int '+a+' and a string '+b);
		},
		'default': function(obj) {
			alert('Here is some other value '+ obj);
		}
		
	});
		
	var u = ivar.setUniqueObject().__uid__;
	ivar.echo(u);
	ivar.echo(window[u]);
	ivar.echo(ivar.uid());
	ivar.echo(st);
	ivar.echo(st.find(['omgzlol','omfg','lol']));
	ivar.namespace('ivar.lol.omg');
	ivar.lol.omg.zomg = 'yes!';
	ivar.echo(ivar.lol.omg.zomg);
	var h = ivar.html.create('h1');
	h.innerHTML = 'lol!';
	var b = document.body;
	b.appendChild(h);
	
	function    Lol  () {
		this.test = '2';
	}
	
	Lol.method(function rofl(){return 'lolzors'});
	
	function Rofl() {
	
	};
	
	function Animal() {
		this.genitals = true;
	};
	
	Animal.method(function say(){
		ivar.echo(this.says);
	});
	
	function Horse() {
		this.says = 'njiii';
		this.legs = 4;
	};
	
	Horse.inherit(Animal);
	
	function Bird() {
		this.says = 'ciuciu';
		this.legs = 2;
		this.wings = 2;
	};
	
	Bird.inherit(Animal);
	
	function Pegasus() {
		this.explodes = true;
	};
	
	Pegasus.inherit(Bird, Horse);
	
	var p = new Pegasus();
	
	ivar.echo(p);
	p.say();
	
	Rofl.inherit(Lol);
	var a = new Rofl();
	for(var i in a)
		ivar.echo(i);
	var lol = new Lol();
	ivar.echo(lol);
	//ivar.echo(lol.rofl());
	
	var g = new ivar.data.Graph();
	g.addNode('a');
	g.addNode('b');
	g.link({label: 'knows', distance: 26 },'a','b');
	g.link({label: 'knows', distance: 0 },'a');
	ivar.echo(g);
}

ivar.ready(test);
ivar.ready(asd);
