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
*		- 2014/04/25: Created. [AReines].
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
		xfig = require( './../lib/xfig.js' ),

		// Chart generators:
		Line = require( './charts/line.js' );


	// GENERATOR //

	/**
	*
	*/
	var generator = function( document, selection, data, clbk ) {

		var figure, canvas, left, top;

		// [1] Instantiate a new figure generator:
		figure = xfig.figure();

		// Create the figure:
		figure.create( document, selection );

		// [2] Instantiate a new canvas generator and configure:
		canvas = xfig.canvas( figure )
			.width( 1200 )
			.height( 25000 );

		// Create the canvas:
		canvas.create();

		// [3] Create a new line chart for each dataset:
		for ( var i = 0; i < data.length; i++ ) {
			left = ( i % 2 === 0 ) ? 90 : 630;
			top = 80 + Math.floor( i / 2 ) * 405;
			Line( canvas, [ data[ i ] ], 400, 260, left, top, i+1 );
		}

		// Finished:
		clbk();

	}; // end GENERATOR


	// EXPORTS //

	module.exports = generator;

})();