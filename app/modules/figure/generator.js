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
*		- 2014/04/23: Created. [AReines].
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
		xfig = require( './lib/xfig.js' ),

		// Histogram generator:
		Histogram = require( './charts/histogram.js' );


	// GENERATOR //

	/**
	*
	*/
	var generator = function( document, selection, data, clbk ) {

		var figure, canvas, annotations, title, graph, histogram, edges, axes, text;

		// [1] Instantiate a new figure generator:
		figure = xfig.figure();

		// Create the figure:
		figure.create( document, selection );

		// [2] Instantiate a new canvas generator and configure:
		canvas = xfig.canvas( figure )
			.width( 1200 )
			.height( 2000 );

		// Create the canvas:
		canvas.create();

		// [3] Instantiate a new annotations generator and configure:
		annotations = xfig.annotations( canvas );

		// Create the annotations element:
		annotations.create();

		// [3.1] Instantiate a new title instance and configure:
		title = annotations.title()
			.position({
				'left': 600,
				'top': 10
			});

		// Create the title element:
		title.create( 'Title' );

		// [4] Histogram:
		histogram = Histogram( canvas, data, 500, 350, 90, 80 );

		// Finished:
		clbk();

	}; // end GENERATOR


	// EXPORTS //

	module.exports = generator;

})();