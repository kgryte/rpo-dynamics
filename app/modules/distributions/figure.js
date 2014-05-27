/**
*
*	FIGURE: distributions
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
*		- 2014/05/02: Created. [AReines].
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

		// Module to create a server-side DOM:
		DOM = require( './../../utils/dom.js' ),

		// Document partials:
		partials = require( './../../utils/partials.js' )( path.resolve( __dirname, '../../partials' ) ),

		// Module to generate the figure:
		generator = require( './generator.js' );


	// FIGURE //

	/**
	* FUNCTION: figure( data, clbk )
	*
	*/
	function figure( data, clbk ) {

		if ( arguments.length !== 2 ) {
			clbk({
				'status': 500,
				'message': 'Internal server error. API incompatibility.'
			});
			console.error( 'figure()::insufficient input arguments. Must provide a callback.' );
			return;
		}

		// Initialize a DOM:
		DOM( partials.index, function onWindow( error, window ) {
			var document = window.document,
				selection,
				datasets;

			// Any errors?
			if ( error ) {
				clbk({
					'status': 500,
					'message': 'Internal server error. Unable to generate server-side DOM.'
				});
				console.error( error.stack );
				return;
			} // end IF (error)

			// Get the selection:
			selection = document.querySelector( '.main' );

			// Generate the figure:
			generator( document, selection, data, function onFigure() {
				// Return the document contents to the callback:
				clbk( null, document.innerHTML );

				// Close the DOM window:
				window.close();
			});
		});
	} // end FIGURE
		

	// EXPORTS //

	module.exports = figure;

})();