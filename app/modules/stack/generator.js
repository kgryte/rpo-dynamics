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
		xfig = require( 'figure.io' ),

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
		var figure,
			datasets,
			headers = [], labels = [],
			canvas;

		// [1] Instantiate a new figure generator:
		figure = xfig.figure();

		// Create the figure:
		figure.create( document, selection );

		// [2] Instantiate a new canvas generator and configure:
		canvas = xfig.canvas( figure )
			.width( 620 )
			.height( 8000 );

		// Create the canvas:
		canvas.create();

		// [3] Decode the datasets:
		headers.push( '<span class="pink">' + mapping[ Object.keys( data[0] )[0] ] + '</span>' );

		datasets = Object.keys( data[1] );
		for ( var i = 0; i < datasets.length; i++ ) {
			labels.push( '<span class="blue">' + mapping[ datasets[ i ] ] + '</span>' );
		}

		// [4] Create a new Multipanel chart:
		Multipanel( canvas, data, 520, 7900, 90, 80, headers, labels );

		// Finished:
		clbk();

	}; // end GENERATOR


	// EXPORTS //

	module.exports = generator;

})();