var Hotplug = require( '../index' ),
	Util = require( 'findhit-util' ),

	sinon = require( 'sinon' ),
	chai = require( 'chai' ),
	expect = chai.expect;

describe( "Plugin", function () {

	beforeEach(function () {
		var app = this.app = new Hotplug.App( Util.uuid() );

		app.options = {
			hello: 'world',
			foo: 'bar',
			awesome: 'option',
		};

		var plugin = this.plugin = new Hotplug.Plugin( 'MagicalPlugin', 'magician' );

		// Plug plugin on app
		app.plug( plugin );

	});

	it( "should be not `.plugged`", function () {

		expect( this.plugin.plugged ).to.not.be.ok

	});

	it( "should be `.plugged` after `app.start()`", function () {

		this.app
			.start();

		expect( this.plugin.plugged ).to.be.ok

	});

	it( "should fire `app-state-change` 2 times `.start`", function () {
		var times = 0;

		this.plugin
			.on( 'app-state-change', function () {
				times ++;
			});

		this.app
			.start();

		expect( times ).to.be.equal( 2 );

	});

	it( "should fire `plugged` on `.plug`", function () {
		var times = 0;

		this.plugin
			.on( 'plugged', function () {
				times ++;
			});

		this.app // Plug is already made on beforeEach
			.start()

		expect( times ).to.be.equal( 1 );
	
	});

	it( "should fire `unplugged` on `.unplug`", function () {
		var times = 0;

		this.plugin
			.on( 'unplugged', function () {
				times ++;
			});

		this.app
			.start()
			.unplug( this.plugin );

		expect( times ).to.be.equal( 1 );
	
	});

	it( "should fire `starting` and `started` on `.start`", function () {
		var times = 0;

		this.plugin
			.on( 'starting, started', function () {
				times ++;
			});

		this.app
			.start();

		expect( times ).to.be.equal( 2 );
	
	});

	it( "should fire `stoping` and `stopped` on `.stop`", function () {
		var times = 0;

		this.plugin
			.on( 'stoping, stopped', function () {
				times ++;
			});

		this.app
			.stop();

		expect( times ).to.be.equal( 2 );
	
	});

});