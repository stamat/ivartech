ivar.require('ivar/html.js');
ivar.require('ivar.test.*');
ivar.require('ivar.patt.Events');
//ivar.require('ivar.data.StringTree');
ivar.require('ivar.data.Graph');
ivar.require('ivar.data.Map');
ivar.require('ivar.data.Tree');
ivar.require('http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js');
ivar.require('ivar.net.Communication');

function assertFalse(bool) {
	console.error(!bool);
}

function assertTrue(bool) {
	console.error(bool);
}

function test() {
	var a1 = ['foo', 'bar',2, 1,2,4, 'boo', 'ba', 'foo'];
	var a2 = ['foo', 'baz', 1,3,5];
	console.log(a1.unique());
	a1.merge(a2);
	console.log(a1);
	ivar.echo(a);
	ivar.echo(b);
	var t = new ivar.data.Tree();
	t.put(['integer','string', 'boolean'], function lol(){console.log('1')});
	t.put(['integer','string', 'object'], function rofl(){console.log('2')});
	t.put(['float']);
	t.put(['integer','string'], function omg(){console.log('3')})
	console.log(t.remove(['integer','string']));
	console.log(t);
	console.log(t.get(['integer']));
}

function asd() {
	var test = ['bar','baz','bazo','foo', 'far', 'fool', 'qux', 'quid'];
	var st = new ivar.data.Tree();
	
	function stPut(st, arr) {
		for(var i = 0; i < arr.length; i++) {
			st.put(arr[i]);
		}
	}
	
	stPut(st, test);
	st.remove('quid');
	console.log(st.exists('qux'));
	
	var to = new ivar.data.Tree().parse({ 
    "id" : 1490,
    "married" : true,
    "name" : "Larry Smith",
    "daughter" : { 
		"id" : 1490,
		"married" : true,
		"name" : "Larry Smith",
		"sons" : null,
		"daughters" : [ 
		    { 
		    "age" : 25,
		    "name" : "Melissa"
		    },
		    { 
		    "age" : 11,
		    "name" : "Melissa"
		    }
		]
    }
 });
 
 	console.log(to);
 	console.log(to.build());
	
	console.log();
	
	var out = ivar.def({
		'integer': function(a) {
			alert('Here is int '+a);
		},
		
		'float': function(a) {
			alert('Here is float '+a);
		},
		
		'string, ?, integer': function(a) {
			alert('Here is string '+a);
		},
		
		'string, string': function(a, b) {
			alert('Here is an int '+a+' and a string '+b);
		},
		
		'default': function(obj) {
			alert('Here is some other value '+ obj);
		}
		
	});
	
	out(new Date(), 34);
		
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
