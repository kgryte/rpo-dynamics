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
*		- 2014/06/02: Created. [AReines].
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

		// Condition mapping:
		MAPPING = require( './../../utils/mapping.js' ),

		// Distribution comparison:
		figure = require( './figure.js' );


	// VARIABLES //

	var CONDITIONS = Object.keys( MAPPING );


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

	/**
	* FUNCTION: getConditions( id )
	*	Returns a list of conditions matching a condition filter.
	*
	* @param {string} id - condition expression; e.g., 01*10**0
	* @returns {array} list of conditions matching filter
	*/
	function getConditions( id ) {
		var conditions = CONDITIONS.slice();
		for ( var i = 0; i < id.length; i++ ) {
			conditions = conditions.filter( filter( id[i], i ) );
		}
		return conditions;
	} // end FUNCTION getConditions()

	/**
	* FUNCTION: filter( char, idx )
	*	Returns a filter function which filters based on a string having a character at a particular index.
	*
	* @param {string} char - character by which to filter; if char is '*', then all characters match.
	* @param {number} idx - index on which to filter
	*/
	function filter( c, idx ) {
		/**
		* FUNCTION: filter( str )
		*	Filter function.
		*
		* @param {string} str - string to be filtered
		* @returns {boolean} boolean indicating whether the string satisfies the filter conditions
		*/
		return function filter( str ) {
			if ( c === '*' ) {
				return true;
			}
			return str[ idx ] === c;
		};
	} // end FUNCTION filter()


	// ROUTES //

	/**
	* FUNCTION: routes( clbk )
	*
	*/
	var routes = function ( clbk ) {

		// NOTE: the 'this' context is the application.

		// Matrix:
		this.get( '/matrix', function onRequest( request, response ) {

			// Get data:
			getData( 'summary', [ '*' ], 'uncorrected.efficiency', 'kde', onData );

			function onData( error, data ) {
				if ( error ) {
					onError( response, error );
					return;
				}
				figure( data, onFigure );
			}

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

		// Sub-matrix:
		this.get( '/matrix/:id', function onRequest( request, response ) {

			var id = request.params.id,
				ids = getConditions( id );

			if ( !ids.length ) {
				onError( response, {
					'status': 404,
					'message': 'Resource unavailable. No conditions matched the specified filter: ' + id + '.'
				});
				return;
			}

			// Get data:
			getData( 'summary', ids, 'uncorrected.efficiency', 'kde', onData );

			function onData( error, data ) {
				if ( error ) {
					onError( response, error );
					return;
				}
				figure( data, onFigure );
			}

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