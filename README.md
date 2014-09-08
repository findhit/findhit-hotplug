Hotplug
=======

Hotplug is an universal plugin manager system for nodejs apps

Instalation
-----------

```bash

	npm install findhit-hotplug --save

```

Usage / Implementation Example
------------------------------

#### App-side

```js

	var Hotplug = require( 'findhit-hotplug' );

	Hotplug( 'MyAwesomeAppName' )
		.on( 'plug-in', function ( e ) {
			var plugin = e.plugin;

			// Some I/O over plugin ?
		})
		.on( 'plug-out', function ( e ) {
			var plugin = e.plugin;

			// Some I/O over plugin ?
		})
		.start({
			host: '127.0.0.1',
			port: '80',
			zip: '4490',
		});

```

#### Plugin-side

```js

	var Hotplug = require( 'findhit-hotplug' ),
		app = Hotplug( 'MyAwesomeAppName' )
		plugin = Hotplug.Plugin( 'MyPlugin', 'SomeType' );

	plugin
		.on( 'starting', function () {
			// ...
		})
		.on( 'started', function () {
			// ...
		})
		.on( 'stoping', function () {
			// ...
		})
		.on( 'stopped', function () {
			// ...
		})
		.on( 'state-change', function ( e ) {
			// Everytime state changes
		});

	// Now we can introduce methods to plugin
	plugin.sync = function () {
		// Some I/O
	};

	plugin.teach = function () {
		// Some I/O
	};

	plugin.YOLO = function () {
		// Some I/O
	};

	// In the end, we just have to plug into app
	app.plug( plugin );

```

Available Classes
-----------------

* `Hotplug.App` - Event-driven Bus for each App.
* `Hotplug.Plugin` - Event-driven for each Plugin which interacts with App.

#### How to access them?

```js

	var Hotplug = require( 'findhit-hotplug' ),
		app, plugin;

	// Lets examplify App creation
	app = new Hotplug.App( 'MyAwesomeAppName' );

	// Initialize app
	app.start({ app: 'options', so: 'each', plugin: 'can', read: 'it' });

	// Now, Plugin creation
	plugin = new Hotplug.Plugin( 'PluginName', 'Type', { object: 'with', plugin: 'data' });

	// Linking plugin into app
	app.plug( plugin );

```