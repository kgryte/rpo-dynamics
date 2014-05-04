/**
*
*	APP: routes
*
*
*
*	DESCRIPTION:
*		- 
*
*
*	API:
*		- 
*
*
*	NOTES:
*		[1] 
*
*
*	TODO:
*		[1] 
*
*
*	HISTORY:
*		- 2014/04/21: Created. [AReines].
*
*
*	DEPENDENCIES:
*		[1] 
*
*
*	LICENSE:
*		
*
*	Copyright (c) 2014. Athan Reines.
*
*
*	AUTHOR:
*		Athan Reines. athan@nodeprime.com. 2014.
*
*
*/


(function() {
	'use strict';

	// MODULES //

	var // Condition mapping:
		MAPPING = require( './utils/mapping.js' ),

		// Directory encoding model:
		model = require( './../public/data/encoding.json' ),

		// Module for performing calculations:
		calculate = require( './utils/calculate.js' );


	// ROUTES //

	var routes = function ( clbk ) {

		// NOTE: the 'this' context is the application.

		// Conditions:
		this.get( '/conditions', function onRequest( request, response ) {

			response.writeHead( 200, {
				'Content-Type': 'application/json'
			});

			response.write( JSON.stringify( MAPPING ) );
			response.end();

		});

		// Base route returns a description:
		this.get( '/conditions/:condition', function onRequest( request, response ) {

			var condition = request.params.condition;

			response.writeHead( 200, {
				'Content-Type': 'text/plain'
			});

			response.write( MAPPING[ condition ] );
			response.end();

		});

		// Conditions encoding:
		this.get( '/encoding', function onRequest( request, response ) {

			response.writeHead( 200, {
				'Content-Type': 'application/json'
			});

			response.write( JSON.stringify( model ) );
			response.end();

		});

		// Calculations:
		this.get( '/calculate', function onRequest( request, response ) {
			calculate();
			response.writeHead( 200, {
				'Content-Type': 'text/plain'
			});
			response.write( 'Ok' );
			response.end();
		});

		// Callback:
		clbk();

	}; // end ROUTES


	// EXPORTS //

	module.exports = routes;

})();