var Util = require( 'findhit-util' ),
	Evented = require( 'findhit-evented' );

var Plugin = Evented.extend({

	initialize: function ( name, type ) {

		this.name = name;
		this.type = type;

		this.plugged = false;
	},

	plug: function ( app ) {
		return Util.is.Function( app.plug ) ? app.plug( this ) : false;
	},

});

// Export it
module.exports = Plugin;