/**
*
*	MODULE: routes
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

		// Figure:
		figure = require( './figure.js' );


	// ROUTES //

	var routes = function ( clbk ) {

		var base = path.basename( __dirname );

		// NOTE: the 'this' context is the application.

		// Figure route:
		this.get( '/' + base, function onRequest( request, response ) {

			figure( function ( error, html ) {
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