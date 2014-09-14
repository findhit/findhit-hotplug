var Hotplug = require( '../index' ),
	Util = require( 'findhit-util' ),

	sinon = require( 'sinon' ),
	chai = require( 'chai' ),
	expect = chai.expect;

describe( "App", function () {

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

	it( "should fire `starting` and `started` on `.start`", function () {
		var times = 0;

		this.app
			.on( 'starting, started', function () {
				times ++;
			})
			.start();

		expect( times ).to.be.equal( 2 );

	});

	it( "should fire `state-change` 2 times `.start`", function () {
		var times = 0;

		this.app
			.on( 'state-change', function () {
				times ++;
			})
			.start();

		expect( times ).to.be.equal( 2 );

	});

	describe( ".autoload", function () {

		before(function () {

			this.modules = this.app.autoload();

		});

		it( "check if this.modules arent empty", function () {

			expect( this.modules.length ).to.not.equal( 0 );

		});

		it( "check if `findhit-class` wasn't checked", function () {

			expect( this.modules.indexOf( 'findhit-class' ) ).to.equal( -1 );

		});

		it( "check if `findhit-evented` was checked", function () {

			expect( this.modules.indexOf( 'findhit-evented' ) ).to.not.equal( -1 );

		});

		it( "check if `findhit-util` was checked", function () {

			expect( this.modules.indexOf( 'findhit-util' ) ).to.not.equal( -1 );

		});

	});

});