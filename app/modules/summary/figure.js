/**
*
*	FIGURE: summary
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

	var // Module to create a server-side DOM:
		DOM = require( './../../utils/dom.js' ),

		// Document partials:
		partials = require( './../../utils/partials.js' )( __dirname + '/../../partials' ),

		// Module to get data:
		getData = require( './../../utils/data.js' ),

		// Module to generate the figure:
		generator = require( './generator.js' );


	// FIGURE //

	/**
	* FUNCTION: figure( id, clbk )
	*
	*/
	function figure( id, clbk ) {

		if ( arguments.length !== 2 ) {
			console.error( 'figure()::insufficient input arguments. Must provide an id and a callback.' );
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
				console.error( error.stack );
				return;
			} // end IF (error)

			// Get the selection:
			selection = document.querySelector( '.main' );

			// Get data:
			getData( [ id ], function onData( error, data ) {

				if ( error ) {
					clbk( error );
					return;
				}

				// Generate the figure:
				generator( document, selection, data[ id ], function onFigure() {

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