/**
*
*	FIGURES: routes
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

	var // Path module:
		path = require( 'path' ),

		// Summary figure:
		summary = require( './summary' ),

		// Timeseries figure:
		timeseries = require( './timeseries' ),

		// Distribution comparison:
		compare = require( './compare' );


	// ROUTES //

	var routes = function ( clbk ) {

		var base = path.basename( __dirname );

		// NOTE: the 'this' context is the application.

		// Figure route:
		this.get( '/' + base, function onRequest( request, response ) {

			response.writeHead( 200, {
				'Content-Type': 'text/html'
			});
			response.write( '...rpo dynamics figures...' );
			response.end();

		});

		// Summary figure route for a particular condition:
		this.get( '/' + base + '/summary/:condition', function onRequest( request, response ) {

			var condition = request.params.condition;

			summary( condition, function onFigure( error, html ) {
				if ( error ) {
					response.writeHead( error.status, {
						'Content-Type': 'application/json'
					});
					response.write( error );
					response.end();
					return;
				}
				response.writeHead( 200, {
					'Content-Type': 'text/html'
				});
				response.write( html );
				response.end();

			});

		});

		// Timeseries figure route for a particular condition:
		this.get( '/' + base + '/timeseries/:condition', function onRequest( request, response ) {

			var condition = request.params.condition;

			timeseries( condition, function onFigure( error, html ) {
				if ( error ) {
					response.writeHead( error.status, {
						'Content-Type': 'application/json'
					});
					response.write( error );
					response.end();
					return;
				}
				response.writeHead( 200, {
					'Content-Type': 'text/html'
				});
				response.write( html );
				response.end();
			});

		});

		// Distribution comparison figure route for a condition pair:
		this.get( '/' + base + '/distribution/:condition1/compare/:condition2', function onRequest( request, response ) {

			var condition1 = request.params.condition1,
				condition2 = request.params.condition2;

			compare( condition1, condition2, function onFigure( error, html ) {
				if ( error ) {
					response.writeHead( error.status, {
						'Content-Type': 'application/json'
					});
					response.write( error );
					response.end();
					return;
				}
				response.writeHead( 200, {
					'Content-Type': 'text/html'
				});
				response.write( html );
				response.end();
			});
		});

		// Callback:
		clbk();

	}; // end ROUTES


	// EXPORTS //

	module.exports = routes;

})();