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

	// VARIABLES //

	// TODO: clean me.

	var FIGURES = {}, IDS;

	FIGURES[ 2 ] = require( './' + 2 + '/figure.js' );
	FIGURES[ 3 ] = require( './' + 3 + '/figure.js' );
	FIGURES[ 4 ] = require( './' + 4 + '/figure.js' );

	IDS = Object.keys( FIGURES );


	// FUNCTIONS //

	/**
	* FUNCTION: onError( response, error )
	*	Sends an error response.
	*
	* @param {object} response - HTTP response object
	* @param {object} error - error object
	*/
	function onError( response, error ) {
		response.writeHead( error.status, {
			'Content-Type': 'application/json'
		});
		response.write( JSON.stringify( error ) );
		response.end();
	} // end FUNCTION onError()


	// ROUTES //

	/**
	* FUNCTION: routes( clbk )
	*
	*/
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

		// Figure route:
		this.get( '/figure/:id', function onRequest( request, response ) {
			var id = request.params.id;

			// CHECK!!!
			if ( IDS.indexOf( id ) === -1 ) {
				onError( response, {
					'status': 400,
					'message': 'Invalid request. Provided figure number does not correspond to any figure.'
				});
				return;
			}

			// Generate the figure:
			FIGURES[ id ]( function onFigure( error, html ) {
				if ( error ) {
					onError( error );
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