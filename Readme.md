# KVS Stagger
[KVS](http://npmjs.org/package/kvs) or   *K*ey *V*alue *S*tore is an abstract KeyValueStore system. The *kvs-** group of node modules, are intended to present a unified interface to key value stores of every persuasion. This allows for substituting them without changing anything but the initializing parameters.

*KVS-filter* modules are modules that are used to modify the requests to the KVS system. They can transform the *key* or the *value* or both in some way. However they need to take either be transparent and keep to the KVS-system definition (i.e.: values are buffers, etc...) or be used close to the consumer of the API.

*KVS-stagger* is a *KVS filter* module that does not transform the key or the value, but tries to access them in multiple stores. This is especially useful for caching, or migrating from one store-type to another.

## Install
    npm install kvs-stagger
    
## Use
    var KVS=require('kvs-stagger');
    var store = new KVS([ <stores> ], { // pass in the KVS-Instances that are used as storage
    	percolate: false, // if a value is not found in previous stores, but fetched from below, should the previous stores be updated
    	writeDepth:1, // on set, how many stores should be written to (default: 1)
    	removeDepth:3, // when removing a key, how many levels deep to remove (default: all stores) 
    }); 
    store.set('name',  new Buffer('value is a buffer'), function(err) {…});
    store.get('name', function(err, value) {
    	// attention! value will be a string (or null if not found)
    });
    store.remove('name', function(err) { … });
    store.list('name', function(err, value) { … });

## License (MIT)
**Copyright (c) 2013 [Philipp Dunkel](mailto:pip@pipobscure.com)**

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
