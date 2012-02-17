# Prezly.js

## Models

To create a Model 

	model = prezly.model('attr1 attr2');
	
This will create a model with the attribute accessor functions attr1 and attr2. Calling it with no arguments will return
the attributes value. Calling it with an argument will set the value.

	model.attr1('value');
	model.attr1(); // => 'value'
	
When you set an attribute the model will emit a change event. The handler will be passed the attribute name, new value and old value.
