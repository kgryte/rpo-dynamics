/**
*
*	FIGURE: generator
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

	var // xfig figure library:
		xfig = require( './../../lib/xfig.js' ),

		// Module to decode dataset:
		mapping = require( './../../utils/mapping.js' ),

		// Chart generators:
		Multipanel = require( './charts/multipanel.js' );


	// GENERATOR //

	/**
	* FUNCTION: generator( document, selection, data, clbk )
	*
	*/
	var generator = function( document, selection, data, clbk ) {
		var figure, datasets, labels = [], canvas;

		// [1] Instantiate a new figure generator:
		figure = xfig.figure();

		// Create the figure:
		figure.create( document, selection );

		// [2] Instantiate a new canvas generator and configure:
		canvas = xfig.canvas( figure )
			.width( 12000 )
			.height( 8000 );

		// Create the canvas:
		canvas.create();

		// [3] Decode the datasets:
		datasets = Object.keys( data );
		for ( var i = 0; i < datasets.length; i++ ) {
			labels.push( mapping[ datasets[ i ] ] );
		}

		// [4] Create a new Multipanel chart:
		Multipanel( canvas, data, 11900, 7900, 90, 80, labels );

		// Finished:
		clbk();

	}; // end GENERATOR


	// EXPORTS //

	module.exports = generator;

})();