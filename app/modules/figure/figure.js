/**
*
*	DATA: figure
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

	var // D3:
		d3 = require( 'd3' ),

		// Module to create a server-side DOM:
		DOM = require( __dirname + '/../../utils/dom.js' ),

		// Document partials:
		partials = require( __dirname + '/../../utils/partials.js' )( __dirname + '/partials' ),

		// Module to getData:
		getData = require( __dirname + '/../../utils/data.js' );


	// FIGURE //

	/**
	* FUNCTION: figure( id, clbk )
	*
	*/
	function figure( id, clbk ) {

		if ( arguments.length !== 2 ) {
			throw new Error( 'figure()::insufficient input arguments. Must provide an id and a callback.' );
		}

		// Initialize a DOM:
		DOM( partials.index, function onWindow( error, window ) {

			var document = window.document;

			// Any errors?
			if ( error ) {
				clbk({
					'status': 500,
					'message': 'ERROR:internal server error. Unable to generate server-side DOM.'
				});
				return;
			} // end IF (error)

			// Get data:
			getData( id, function ( error, data ) {

				if ( error ) {
					clbk({
						'status': 500,
						'message': 'ERROR:internal server error. Unable to process request.'
					});
					console.error( error );
					return;
				}

				// Return the document contents to the callback:
				clbk( null, document.innerHTML );

			});

			// Close the DOM window:
			// window.close();

		});

		return;

	} // end FIGURE
		

	// EXPORTS //

	module.exports = figure;

})();