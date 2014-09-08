/**
  The entry point.
  @module Hotplug
**/
'use strict';

/**
 * To use it, you just need to import it:
 *
 * ```js
 * var Hotplug = require( 'findhit-hotplug' )( 'appname' );
 * ```
 *
 *
 * @class Hotplug
 */

var App = require( './lib/app' ),
	Plugin = require( './lib/plugin' ),

	apps = {},
	loader = function ( app ) {
		return new App( app );
	};

loader.App = App;
loader.Plugin = Plugin;

// Export it
module.exports = loader;

// TODO: AMDify