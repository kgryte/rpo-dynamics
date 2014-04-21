/**
*
*	MODULE: routes
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
		path = require( 'path' );
		

	// ROUTES //

	var routes = function ( clbk ) {

		// NOTE: the 'this' context is the application.

		//
		this.get( '/' + path.basename( __dirname ), function onRequest( request, response ) {

			response.send( 'Hello' );

		});

		// Callback:
		clbk();

	};


	// EXPORTS //

	module.exports = routes;

})();