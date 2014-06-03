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
		xfig = require( 'figure.io' ),

		// Chart generators:
		KDE = require( './charts/kde.js' ),

		TimeseriesHistogram = require( './charts/timeseries-histogram.js' ),
		
		Multipanel = require( './charts/multipanel.js' );


	// GENERATOR //

	/**
	* FUNCTION: generator( document, selection, data, clbk )
	*
	*/
	var generator = function( document, selection, data, clbk ) {
		var dataset, kde, hist, means, timeseries, figure, canvas;

		// Get the dataset name: (should be only one)
		dataset = Object.keys( data[ 0 ] )[ 0 ];

		kde = data[ 0 ][ dataset ];
		hist = data[ 1 ][ dataset ][ 0 ];
		means = data[ 2 ][ dataset ][ 0 ];
		timeseries = data[ 3 ][ dataset ];

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

		// [3] Histogram / KDE:
		// Histogram( canvas, data, 400, 260, 90, 80, 'a' );
		KDE( canvas, kde, 400, 260, 90, 80, 'a' );

		// [4] Timeseries Histogram chart:
		TimeseriesHistogram( canvas, hist, means, 400, 260, 90, 485, 'b' );

		// [5] Multipanel chart:
		Multipanel( canvas, timeseries, 400, 720, 630, 80, 'c' );

		// Finished:
		clbk();

	}; // end GENERATOR


	// EXPORTS //

	module.exports = generator;

})();