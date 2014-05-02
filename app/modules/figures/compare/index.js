/**
*
*	FIGURE: compare
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
*		- 2014/05/01: Created. [AReines].
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
		DOM = require( './../../../utils/dom.js' ),

		// Document partials:
		partials = require( './../../../utils/partials.js' )( __dirname + '/../partials' ),

		// Module to get data:
		getData = require( './../../../utils/data.js' ),

		// Module to generate the figure:
		generator = require( './generator.js' );


	// FIGURE //

	/**
	* FUNCTION: figure( id1, id2, clbk )
	*
	*/
	function figure( id1, id2, clbk ) {

		if ( arguments.length !== 3 ) {
			console.error( 'figure()::insufficient input arguments. Must provide two ids and a callback.' );
			return;
		}

		// Initialize a DOM:
		DOM( partials.index, function onWindow( error, window ) {

			var document = window.document,
				selection;

			// Any errors?
			if ( error ) {
				clbk({
					'status': 500,
					'message': 'ERROR:internal server error. Unable to generate server-side DOM.',
					'error': error
				});
				return;
			} // end IF (error)

			// Get the selection:
			selection = document.querySelector( '.main' );

			// Get data:
			getData( [ id1, id2 ], function ( error, data ) {

				if ( error ) {
					clbk( error );
					return;
				}

				// Generate the figure:
				generator( document, selection, data, function() {

					// Return the document contents to the callback:
					clbk( null, document.innerHTML );

					// Close the DOM window:
					window.close();

				});

			});

		});

		return;

	} // end FIGURE
		

	// EXPORTS //

	module.exports = figure;

})();