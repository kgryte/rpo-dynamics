/**
*
*	FIGURE: 6
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
*		- 2014/05/12: Created. [AReines].
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
		DOM = require( './../../../utils/dom.js' ),

		// Document partials:
		partials = require( './../../../utils/partials.js' )( path.resolve( __dirname, '../../../partials' ) ),

		// Module to get data:
		getData = require( './../../../utils/data.js' ),

		// Module to generate the figure:
		generator = require( './generator.js' );


	// FIGURE //

	/**
	* FUNCTION: figure( clbk )
	*
	*/
	function figure( clbk ) {

		var ids = [];

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
			getData( ids, function onData( error, data ) {
				if ( error ) {
					clbk( error );
					return;
				}
				// Generate the figure:
				generator( document, selection, data, function onFigure() {
					// Return the document contents to the callback:
					clbk( null, document.innerHTML );

					// Close the DOM window:
					window.close();
				});
			});
		});
	} // end FIGURE
		

	// EXPORTS //

	module.exports = figure;

})();