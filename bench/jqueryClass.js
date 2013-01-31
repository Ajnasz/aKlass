/**
 * Based on MooTools 1.11 Core Class module which is "slightly based on Base.js"
 * License: MIT-style license.
 */
(function($, undefined){
	var version = "1.1-wip";

	var K = function(){
		var obj, parent, type = K.internal.type;
		// regular syntax, one object -> a new Class will be made
		if (arguments.length == 1) {
			obj = arguments[0];
			if (type(obj) !== "object") {
				throw("$.klass (creation): invalid parameter type!");
			}
			return new K.internal.Class(obj);
		} else if (arguments.length == 2) { // two parameters: extending an existing Class
			parent = arguments[0];
			obj = arguments[1];
			if (type(parent) !== "class") { // parent.constructor is MooTools.Class
				throw("$.klass (extending): first parameter must be a Class!");
			}
			if (type(obj) !== "object") {
				throw("$.klass (extending): second parameter must be an object!");
			}
			return parent.extend(obj);
		} else { // otherwise throw an error
			throw("$.klass: incorrect number of parameters!");
		}
	};

	K.internal = (function(){//-{{{

		/*
		Script: Core.js
			Mootools - My Object Oriented javascript.

		License:
			MIT-style license.

		MooTools Copyright:
			copyright (c) 2007 Valerio Proietti, <http://mad4milk.net>

		MooTools Credits:
			- Class is slightly based on Base.js <http://dean.edwards.name/weblog/2006/03/base/>
			(c) 2006 Dean Edwards, License <http://creativecommons.org/licenses/LGPL/2.1/>
			- Some functions are inspired by those found in prototype.js <http://prototype.conio.net/>
			(c) 2005 Sam Stephenson sam [at] conio [dot] net, MIT-style license
			- Documentation by Aaron Newton (aaron.newton [at] cnet [dot] com) and Valerio Proietti.
		*/

		var MooTools = {
			version: '1.11'
		};

		/* Section: Core Functions */

		/*
		Function: MooTools.defined
			Returns true if the passed in value/object is defined,
			that means is not null or undefined.

		Arguments:
			obj - object to inspect
		*/

		MooTools.defined = function(obj){
			return (obj != undefined);
		};


		// mootools-1.2.5-core/classes - $unlink
		MooTools.unlink = function(object){
			var unlinked;
			switch (MooTools.type(object)){
				case "object":
					unlinked = {};
					for (var p in object) {
						unlinked[p] = MooTools.unlink(object[p]);
					}
				break;
				case "array":
					unlinked = [];
					for (var i = 0, l = object.length; i < l; i++) {
						unlinked[i] = MooTools.unlink(object[i]);
					}
				break;
				default: return object;
			}
			return unlinked;
		};

		// mootools Class.js git 100644 vs 1.2.5-core merge
		MooTools.objectReset = function(object, key){
			for (var key in object){
				var value = object[key];
				switch (MooTools.type(value)){
					case "object":
						var F = function(){};
						F.prototype = value;
						var instance = new F;
						object[key] = MooTools.objectReset(instance); // rekurzivan tovabb
						break;
					case "array": object[key] = MooTools.unlink(object[key]); // tkp deep clone
						break;
				}
			}
			return object;
		};


		/*
		Function: MooTools.type
			Returns the type of object that matches the element passed in.

		Arguments:
			obj - the object to inspect.

		Example:
			>var myString = 'hello';
			>MooTools.type(myString); //returns "string"

		Returns:
			'element' - if obj is a DOM element node - sorry Safari2, but it's not a big deal with jQuery
			'textnode' - if obj is a DOM text node
			'whitespace' - if obj is a DOM whitespace node
			'arguments' - if obj is an arguments object
			'object' - if obj is an object
			'string' - if obj is a string
			'number' - if obj is a number
			'boolean' - if obj is a boolean
			'function' - if obj is a function
			'regexp' - if obj is a regular expression
			'class' - if obj is a Class. (created with new Class, or the extend of another class).
			'collection' - if obj is a native htmlelements collection, such as childNodes, getElementsByTagName .. etc.
			false - (boolean) if the object is not defined or none of the above.
		*/

		MooTools.type = function(obj){
			if (!MooTools.defined(obj)) return false;
			if (obj.htmlElement) return 'element';
			var type = typeof obj;
			if (type == 'object' && obj.nodeName){
				switch(obj.nodeType){
					case 1: return 'element';
					case 3: return (/\S/).test(obj.nodeValue) ? 'textnode' : 'whitespace';
				}
			}
			if (type == 'object' || type == 'function'){
				switch(obj.constructor){
					case Array: return 'array';
					case RegExp: return 'regexp';
					case MooTools.Class: return 'class';
				}
				if (typeof obj.length == 'number'){
					if (obj.item) return 'collection';
					if (obj.callee) return 'arguments';
				}
			}
			return type;
		};

		/*
		Function: MooTools.$merge
			merges a number of objects recursively without referencing them or their sub-objects.

		Arguments:
			any number of objects.

		Example:
			>var mergedObj = MooTools.$merge(obj1, obj2, obj3);
			>//obj1, obj2, and obj3 are unaltered
		*/

		MooTools.merge = MooTools.$merge = function(){
			var mix = {};
			for (var i = 0; i < arguments.length; i++){
				for (var property in arguments[i]){
					var ap = arguments[i][property];
					var mp = mix[property];
					if (mp && MooTools.type(ap) == 'object' && MooTools.type(mp) == 'object') mix[property] = MooTools.$merge(mp, ap);
					else mix[property] = ap;
				}
			}
			return mix;
		};

		/*
		Function: MooTools.$extend
			Copies all the properties from the second passed object to the first passed Object.
			If you do myWhatever.extend = MooTools.$extend the first parameter will become myWhatever,
			and your extend function will only need one parameter.

		Example:
			(start code)
			var firstOb = {
				'name': 'John',
				'lastName': 'Doe'
			};
			var secondOb = {
				'age': '20',
				'sex': 'male',
				'lastName': 'Dorian'
			};
			MooTools.$extend(firstOb, secondOb);
			//firstOb will become:
			{
				'name': 'John',
				'lastName': 'Dorian',
				'age': '20',
				'sex': 'male'
			};
			(end)

		Returns:
			The first object, extended.
		*/

		MooTools.$extend = function(){
			var args = arguments;
			if (!args[1]) args = [this, args[0]];
			for (var property in args[1]) args[0][property] = args[1][property];
			return args[0];
		};

		/*
		Class: Abstract
			Abstract class, to be used as singleton. Will add .extend to any object

		Arguments:
			an object

		Returns:
			the object with an .extend property, equivalent to <MooTools.$extend>.
		*/

		MooTools.Abstract = function(obj){
			obj = obj || {};
			obj.extend = MooTools.$extend;
			return obj;
		};

		//var Window = new MooTools.Abstract(window);
		//var Document = new MooTools.Abstract(document);
		//document.head = document.getElementsByTagName('head')[0];

		// kipucolt BOM
// 		MooTools.BOM = MooTools.Browser = (function () {
// 			var ua = navigator.userAgent.toLowerCase();
// 			return {
// 				ie: /*@cc_on!@*/false, // sok helyen van
// 				webkit: /webkit/.test(ua), // numberinput classban van
// 				ios: /iphone|ipad|ipod/.test(ua) // andris dolgozott vele, html5 player
// 			};
// 		}());

		/*
		Script: Class.js
			Contains the Class Function, aims to ease the creation of reusable Classes.

		License:
			MIT-style license.
		*/

		/*
		Class: Class
			The base class object of the <http://mootools.net> framework.
			Creates a new class, its initialize method will fire upon class instantiation.
			Initialize wont fire on instantiation when you pass *null*.

		Arguments:
			properties - the collection of properties that apply to the class.

		Example:
			(start code)
			var Cat = new Class({
				initialize: function(name){
					this.name = name;
				}
			});
			var myCat = new Cat('Micia');
			alert(myCat.name); //alerts 'Micia'
			(end)
		*/

		/**
		 * The base class object of the <http://mootools.net> framework.
		 * Creates a new class, its initialize method will fire upon class instantiation.
		 * Initialize wont fire on instantiation when you pass *null*.
		 *
		 * @memberOf ustream.framework.OOP
		 * @name Class
		 * @static
		 * @param {Object} a prototype object
		 * @return {Object} Creates a new class, its initialize method will fire upon class instantiation.
		 * @example
		 *     var Cat = new Class({
		 *         initialize: function(name){
		 *             this.name = name;
		 *         }
		 *     });
		 *     var myCat = new Cat('Micia');
		 *     alert(myCat.name); //alerts 'Micia'
		 */
		MooTools.__classId = MooTools.__instaId = 0; // uid generator
		MooTools.__instanciated = {}; // classes that have been instanciated
		MooTools.__instances = {}; // all the instances
		MooTools.Class = function(properties){
			var clid = MooTools.__classId++;
			properties.__classId = clid;
			var klass = function(){ // instance real constructor, in Moo 1.2.5: newClass
					if (properties._exclusive && MooTools.__instanciated[this.__classId]) {
						throw new Error("Trying to instanciate an exclusive class.");
						return;
					}
					if (arguments[0] !== null) { // extend uses a null arg
						this.__instaId = MooTools.__instaId++;
						MooTools.__instanciated[clid] = true;
						MooTools.__instances[this.__instaId] = this;
					}
					MooTools.objectReset(this);
					return (
						arguments[0] !== null &&
						this.initialize &&
						MooTools.type(this.initialize) == 'function'
					) ? this.initialize.apply(this, arguments) : this;
				};

			MooTools.$extend(klass, this); // add extend, implement (static funcs)

			klass.prototype = properties;
			klass.constructor = MooTools.Class;
			return klass;
		};

		/*
		Property: empty
			Returns an empty function
		*/

		MooTools.Class.empty = function(){};

		MooTools.Class.prototype = {

			/*
			Property: extend
				Returns the copy of the Class extended with the passed in properties.

			Arguments:
				properties - the properties to add to the base class in this new Class.

			Example:
				(start code)
				var Animal = new Class({
					initialize: function(age){
						this.age = age;
					}
				});
				var Cat = Animal.extend({
					initialize: function(name, age){
						this.parent(age); //will call the previous initialize;
						this.name = name;
					}
				});
				var myCat = new Cat('Micia', 20);
				alert(myCat.name); //alerts 'Micia'
				alert(myCat.age); //alerts 20
				(end)
			*/

			/**
			 * Returns the copy of the Class extended with the passed in properties.
			 *
			 * @memberOf ustream.framework.OOP
			 * @name extend
			 * @static
			 *
			 * @param {Object} A prototype object, the properties to add to the base class in this new Class.
			 * @return {Object} Returns the copy of the Class extended with the passed in properties.
			 * @example
			 *     var Animal = new Class({
			 *         initialize: function(age){
			 *             this.age = age;
			 *         }
			 *     });
			 *     var Cat = Animal.extend({
			 *     initialize: function(name, age){
			 *         this.parent(age); //will call the previous initialize;
			 *             this.name = name;
			 *         }
			 *     });
			 *     var myCat = new Cat('Micia', 20);
			 *     alert(myCat.name); //alerts 'Micia'
			 *     alert(myCat.age); //alerts 20
			 */
			extend: function(properties){
				this.__isParent = true; // static flag
				var proto = new this(null);
				for (var property in properties){
					var pp = proto[property];
					proto[property] = MooTools.Class.Merge(pp, properties[property]);
				}
				return new MooTools.Class(proto);
			},

			/*
			Property: implement
				Implements the passed in properties to the base Class prototypes,
				altering the base class, unlike <Class.extend>.

			Arguments:
				properties - the properties to add to the base class.

			Example:
				(start code)
				var Animal = new Class({
					initialize: function(age){
						this.age = age;
					}
				});
				Animal.implement({
					setName: function(name){
						this.name = name
					}
				});
				var myAnimal = new Animal(20);
				myAnimal.setName('Micia');
				alert(myAnimal.name); //alerts 'Micia'
				(end)
			*/

			implement: function(){
				for (var i = 0, l = arguments.length; i < l; i++) {
					MooTools.$extend(this.prototype, arguments[i]);
				}
			}

		};

		//internal
		MooTools.Class.Merge = function(previous, current){
			if (previous && previous != current){
				var type = MooTools.type(current);
				if (type != MooTools.type(previous)) return current;
				switch(type){
					case 'function':
						var merged = function(){
							var oldParent = this.parent, ret;
							// we assign this function temporarily (during runtime!)  to the class's method called "parent"
							this.parent = merged.parent; // arguments.callee.parent;
							// store the returning value
							ret = current.apply(this, arguments);
							// restore the original temp method, whatever it was
							this.parent = oldParent;
							return ret;
						};
						merged.parent = previous;
						return merged;
					case 'object': return MooTools.$merge(previous, current);
				}
			}
			return current;
		};

		return MooTools;
	})();//}}}

	/**
	 * set the globalc classpool (where the classes are stored); for example: "ustream.classes"
	 * since effective instanciation is outside the plugin, this is required
	 * for runtime introspections (getInstancesByClass and friends)
	 */
	K.setClassPool = function (cP) {
		K.internal.__classPool = cP;
	};

	/**
	 * export the merge function, it's pretty useful to have it around
	 */
	K.merge = K.internal.merge;

	/**
	 * get classes: returns the predefined classpool (which MAY be undefined)
	 */
	K.getClasses = function (cP) {
		return K.internal.__classPool;
	};

	/**
	 * get the instances (as an object, with the instance ids as keys)
	 */
	K.getInstances = function () {
		return K.internal.__instances;
	};

	/**
	 * get instances grouped by classnames
	 * by default the instances are in an object, where the id is the instance ID,
	 * but if the instasAsArray is set then they will be returned in an array.
	 */
	K.getInstancesByClass = function (instasAsArray) {
		if (!K.internal.__classPool) {
			throw("$.klass: classPool not set!");
		}
		var ret = {}, retA = [], i, clid, inid, c, instas;
		instas = K.internal.__instances;
		for (i in instas) {
			if (instas.hasOwnProperty(i)) {
				clid = instas[i].__classId;
				inid = instas[i].__instaId;
				for (c in K.internal.__classPool) {
					if (clid === K.internal.__classPool[c].prototype.__classId) {
						if (!ret[c]) {
							ret[c] = instasAsArray ? [] : {};
						}
						if (instasAsArray) {
							ret[c].push(instas[i]);
						} else {
							ret[c][inid] = instas[i];
						}
						break;
					} // endIf
				} // endFor
			} // endHasOwn
		} // endFor
		return ret;
	};

	/**
	 * get the first instance of a given classname
	 */
	K.getFirstInstanceOf = function (className, nth) {
		var objs = {}, obj = false, objsArr = [], instas;
		instas = K.getInstancesByClass()[className];
		for (var i in instas) if (instas.hasOwnProperty(i)) { // convert to array
			objsArr.push(instas[i]);
		}
		nth = objsArr.length && nth >= objsArr.length ? objsArr.length - 1 : ~~nth;
		return objsArr[nth];
	};

	/**
	 * get the last instance of a given classname
	 */
	K.getLastInstanceOf = function (className) {
		return K.getFirstInstanceOf(className, Infinity);
	};

	/**
	 * has this class been instanciated? returns a bool
	 */
	K.isClassInstanciated = function (className) {
		return !!K.getInstancesByClass()[className];
	};

	/**
	 * resets to the default state
	 */
	K.flush = function () {
		delete K.internal.__classPool;
		K.internal.__instances = {};
		K.internal.__instanciated = {};
		K.internal.__classId = 0;
		K.internal.__instaId = 0;
	};

	// FINALLY
	$.klass = K;

}(jQuery));