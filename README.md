# Prezly.js

## Models

To create a Model 

	model = prezly.model('attr1 attr2');
	
This will create a model with the attribute accessor functions attr1 and attr2. Calling it with no arguments will return
the attributes value. Calling it with an argument will set the value.

	model.attr1('value');
	model.attr1(); // => 'value'
	
When you set an attribute the model will emit a change event. The handler will be passed the attribute name, new value and old value.


### Intanciation

The Model object returned from the factory does not do any initialization or intstanciation.
You can create an instance using a constructor or a factory method.
Or simply Object.create

#### Contructor

	function Person(name, age) {
		this.name(name);
		this.age(age);
	}
	Person.prototype = prezly.model('name age');
	var person = new Person('El Duderino', 40);

#### Factory Method

	var Person = prezly.model('name age');
	var createPerson = function (name, age) {
		var p = Object.create(Person);
		p.name(name);
		p.age(age);
		return p;
	}
	var person = createPerson('Walter', 40);
	