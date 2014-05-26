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

		// Module to get data:
		getData = require( './../../utils/data.js' ),

		// Distribution comparison:
		figure = require( './figure.js' );


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
		response.write( error );
		response.end();
	} // end FUNCTION onError()


	// ROUTES //

	var routes = function ( clbk ) {

		// NOTE: the 'this' context is the application.

		// Timeseries figure route for a particular condition:
		this.get( '/timeseries/:condition', function onRequest( request, response ) {

			var condition = request.params.condition;

			// Get data:
			getData( 'timeseries', [ condition ], 'uncorrected.efficiency', 'timeseries', function onData( error, data ) {
				if ( error ) {
					onError( response, error );
					return;
				}

				figure( data[ condition ], function onFigure( error, html ) {
					if ( error ) {
						onError( response, error );
						return;
					}
					response.writeHead( 200, {
						'Content-Type': 'text/html'
					});
					response.write( html );
					response.end();
				});
			});
		});

		// Callback:
		clbk();

	}; // end ROUTES


	// EXPORTS //

	module.exports = routes;

})();