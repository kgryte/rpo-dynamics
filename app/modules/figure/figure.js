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

		// Chart partials:
		partials = require( __dirname + '/../../utils/partials.js' )( __dirname + '/partials' );


	// FIGURE //

	function figure( clbk ) {

		// Initialize a DOM:
		DOM( partials.index, returnWindow );

		return;

		function returnWindow( error, window ) {

			var document = window.document;

			// Any errors?
			if ( error ) {
				clbk({
					'status': 500,
					'message': 'ERROR:internal server error. Unable to generate server-side DOM.'
				});
				return;
			} // end IF (error)

			// Return the document contents to the callback:
			if ( clbk ) {
				clbk( null, document.innerHTML );
			}

			// Close the DOM window:
			// window.close();

		} // end FUNCTION returnWindow()

	} // end FIGURE
		

	// EXPORTS //

	module.exports = figure;

})();