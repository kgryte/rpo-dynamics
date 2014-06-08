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
*		- 2014/06/07: Created. [AReines].
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

		// Distributions:
		this.get( '/timeseries-histograms', function onRequest( request, response ) {

			var Data = new Array( 2 ),
				counter = 0;

			// Get data:
			getData( 'summary', [ '*' ], 'uncorrected.efficiency', 'timeseries-histogram', function onData( error, data ) {
				if ( error ) {
					onError( response, error );
					return;
				}
				Data[ 0 ] = data;
				next();
			});
			getData( 'summary', [ '*' ], 'uncorrected.efficiency', 'means', function onData( error, data ) {
				if ( error ) {
					onError( response, error );
					return;
				}
				Data[ 1 ] = data;
				next();
			});

			/**
			* FUNCTION: next()
			*	Callback to invoke after successfully loading data.
			*/
			function next() {
				if ( ++counter === 2 ) {
					figure( Data, onFigure );
				}
			} // end FUNCTION next()

			function onFigure( error, html ) {
				if ( error ) {
					onError( response, error );
					return;
				}
				response.writeHead( 200, {
					'Content-Type': 'text/html'
				});
				response.write( html );
				response.end();
			}
		});

		// Callback:
		clbk();

	}; // end ROUTES


	// EXPORTS //

	module.exports = routes;

})();