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
		path = require( 'path' );


	// VARIABLES //

	// TODO: clean me.

	var FIGURES = {}, IDS;

	for ( var i = 2; i < 3; i++ ) {
		FIGURES[ i ] = require( './' + i + '/figure.js' );
	}

	IDS = Object.keys( FIGURES );


	// ROUTES //

	var routes = function ( clbk ) {

		// NOTE: the 'this' context is the application.

		// Base route:
		this.get( '/figures', function onRequest( request, response ) {
			response.writeHead( 200, {
				'Content-Type': 'text/html'
			});
			response.write( '...rpo dynamics figures...' );
			response.end();
		});

		// Figures route:
		this.get( '/figures/:id', function onRequest( request, response ) {
			var id = request.params.id;

			// CHECK!!!
			if ( IDS.indexOf( id ) === -1 ) {
				response.writeHead( 400, {
					'Content-Type': 'application/json'
				});
				response.write( JSON.stringify({
					'status': 400,
					'message': 'invalid request. Provided figure number does not correspond to any figure.'
				}));
				response.end();
				return;
			}

			// Generate the figure:
			FIGURES[ id ]( function onFigure( error, html ) {
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