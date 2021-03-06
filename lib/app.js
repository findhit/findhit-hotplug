var Path = require( 'path' ),
	FS = require( 'fs' ),
	
	Evented = require( 'findhit-evented' ),
	Util = require( 'findhit-util' ),
	Process = require( 'findhit-process' ),

	Plugin = require( './plugin' );

var App = Evented.extend({

	statics: {
		STATE: {
			STOPPED: 0,
			STOPING: 1,
			STARTING: 2,
			STARTED: 3,
		},
	},

	options: {
		autodetect: true,
		autostart: false,
	},

	initialize: function ( options ) {
		options = this.setOptions( options );

		this.plugins = {};

		if( options.autoload ) this.autoload();
		if( options.autostart ) this.start();
	},

	start: function ( options ) {
		var app = this;

		options = this.setOptions( options );

		this.state = App.STATE.STARTING;

		app.fire( 'starting' );

		Util.each( this.plugins, function ( plugin ) {
			plugin.fire( 'starting' );
		});

		this.state = App.STATE.STARTED;

		app.fire( 'started' );

		Util.each( this.plugins, function ( plugin ) {
			plugin.fire( 'started' );

			if( ! plugin.plugged ) {
				plugin.plugged = true;

				plugin.fire( 'plugged' );
				app.fire( 'plugged', { plugin: plugin } );
			}
		});

		return this;
	},

	stop: function () {
		var app = this;

		this.state = App.STATE.STOPING;

		app.fire( 'stoping' );

		Util.each( this.plugins, function ( plugin ) {
			plugin.fire( 'stoping' );
		});

		this.state = App.STATE.STOPPED;

		app.fire( 'stopped' );

		Util.each( this.plugins, function ( plugin ) {
			plugin.fire( 'stopped' );

			if( ! plugin.plugged ) {
				plugin.plugged = false;

				plugin.fire( 'unplugged' );
				app.fire( 'unplugged', { plugin: plugin } );
			}
		});

		return this;
	},

	plug: function () {
		var app = this,
			plugin = this._getPlugin( arguments );

		if ( plugin === false || Util.isnt.undefined( this.plugins[ plugin.name ] ) ) {
			return false;
		}

		// ---

		plugin.app = app;
		app.plugins[ plugin.name ] = plugin;
		
		if( app.state === App.STATE.STARTED ) {
			plugin.plugged = true;

			plugin.fire( 'plugged' );
			app.fire( 'plugged', { plugin: plugin } );
		}

		return this;
	},

	unplug: function ( name ) {
		var app = this,
			plugin = app._getPlugin( arguments );

		if ( plugin === false || app.plugins[ plugin.name ] !== plugin ) {
			return false;
		}

		// ---

		plugin.app = undefined;
		delete app.plugins[ plugin.name ];
		
		if( app.state === App.STATE.STARTED ) {
			plugin.plugged = false;

			plugin.fire( 'unplugged' );
			app.fire( 'unplugged', { plugin: plugin } );
		}

		return this;
	},

	// ---

	autoload: function ( path ) {
		var path = path && Path.normalize( path ) || Path.join( __dirname, '../' ),
			modules = [],

			folders,
			curPackage, curPath = '/',
			package;

		Util.each( path.split( Path.sep ), function ( folder, i ) {

			if( ! folder ) return;

			curPath = Path.join( curPath, folder );
			curPackage = Path.join( curPath, 'package.json' );

			// Check if there is a package.json
			if( FS.existsSync( curPackage ) ) {
				package = require( curPackage );
			}

		});

		// Load latest package only? :)
		if( package ) {

			// For each module dependency, if not loaded, load it now!!
			Util.each( package.dependencies, function ( version, module ) {
				if( modules.indexOf( module ) === -1 ) {
					modules.push( module );

					require( module );
				}
			});

		}

		return modules;
	},

	_getPlugin: function ( args ) {
		var plugin = Util.is.instanceof( Plugin, args[ 0 ] ) && args[ 0 ] ||
			this.plugins[ args[ 0 ] ] ||
			Plugin.apply( null, args ) ||
			false;

		return plugin;
	}

});

// State handler
App.addInitHook(function () {
	var app = this,
		state;

	Object.defineProperty( this, 'state', {

		enumerable: true,
		configurable: false,

		get: function() {
			return state;
		},
		set: function( v ) {
			state = v;

			app.fire( 'state-change' );

			Util.each( app.plugins, function ( plugin ) {
				plugin.fire( 'app-state-change', { app: app } );
			});
		},

	});
});

// Export it
module.exports = App;