
var Util = require( 'findhit-util' ),
	Evented = require( 'findhit-evented' );

var Plugin = Evented.extend({

	initialize: function ( name, type ) {

		this.name = name;
		this.type = type;

		this.plugged = false;

	},

});

// Export it
module.exports = Plugin;