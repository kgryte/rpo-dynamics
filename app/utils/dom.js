/**
*
*	UTILS: DOM
*
*
*
*	DESCRIPTION:
*		- Create a server-side DOM.
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
*		- 2014/04/22: Created. [AReines].
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

	var // Module for creating a DOM server-side; used for server-side rendering...
		jsdom = require( 'jsdom' );


	// DOM //

	var dom = function( html, clbk ) {

		// Pass a partial to jsDOM:
		jsdom.env({
			'features': {
				'QuerySelector': true
			},
			'html': html,
			done: function( errors, window ) {
				if ( errors ) {
					console.error( 'ERROR:unable to generate server-side- DOM: ' + errors );
					clbk( errors, null );
					return;
				}
				// Pass the window to the callback:
				clbk( null, window );
			}
		});

	}; // end DOM

	// EXPORTS //

	module.exports = dom;

})();