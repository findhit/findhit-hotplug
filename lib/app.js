
var Evented = require( 'findhit-evented' ),
	Util = require( 'findhit-util' ),

	Plugin = require( './plugin' );

var apps = {};

var App = Evented.extend({

	statics: {
		STATE: {
			STOPPED: 0,
			STOPING: 1,
			STARTING: 2,
			STARTED: 3,
		},
	},

	initialize: function ( name, options ) {
		if( Util.is.instanceof( App, apps[ name ] ) ) {
			return apps[ name ];
		} else {
			apps[ name ] = this;
		}

		var app = this,

			state;

		this.name = name;
		this.plugins = {};

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

	},

	start: function ( options ) {
		var app = this;

		this.state = App.STATE.STARTING;
		this.options = options || this.options || {};

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

	_getPlugin: function ( args ) {
		var plugin = Util.is.instanceof( Plugin, args[ 0 ] ) && args[ 0 ] ||
			this.plugins[ args[ 0 ] ] ||
			Plugin.apply( null, args ) ||
			false;

		return plugin;
	},

});

// Export it
module.exports = App;