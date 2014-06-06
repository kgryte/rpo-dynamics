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
*		- 2014/05/01: Created. [AReines].
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
		KDE = require( './charts/kde.js' ),
		TimeseriesHistogram = require( './charts/timeseries-histogram.js' );

	// FUNCTIONS //

	/**
	* FUNCTION: removeBins( histogram )
	*	Removes the +/- infinity bins from a histogram.
	*
	* @param {array} histogram - array of histogram counts; length = N
	* @returns {array} array of histogram counts; length = N-2
	*/
	function removeBins( histogram ) {
		return histogram.slice( 1, histogram.length-1 );
	} // end FUNCTION removeBins()

	/**
	* FUNCTION: yValue( d )
	*	y-value accessor.
	*
	* @param {array} d - datum
	* @returns {number} y-value
	*/
	function yValue( d ) {
		return d[ 1 ];
	} // end FUNCTION yValue()


	// GENERATOR //

	/**
	* FUNCTION: generator( document, selection, data, clbk )
	*
	*/
	var generator = function( document, selection, data, clbk ) {
		var figure, canvas, datasets,
			kde = [], dat, hist, means,
			yMax = Number.NEGATIVE_INFINITY, max;

		// [1] Instantiate a new figure generator:
		figure = xfig.figure();

		// Create the figure:
		figure.create( document, selection );

		// [2] Get the dataset names:
		datasets = Object.keys( data[ 0 ] );

		// [2.1] Compute the yMax for the KDEs:
		for ( var d = 0; d < datasets.length; d++ ) {
			dat = data[ 0 ][ datasets[d] ];
			kde.push( xfig.data( dat ) );
			max = kde[ d ].max( yValue );
			if ( max > yMax ) {
				yMax = max;
			}
		} // end FOR d

		yMax += yMax * 0.05;

		// [3] Create a separate canvas for each dataset and create the line charts:
		for ( var i = 0; i < datasets.length; i++ ) {

			means = data[ 2 ][ datasets[i] ][ 0 ];

			// Remove the +/- infinity bins from each histogram:
			hist = data[ 1 ][ datasets[i] ][ 0 ];
			hist = hist.map( removeBins );
			hist = xfig.data( hist );

			// [3.0] Instantiate a new canvas generator and configure:
			canvas = xfig.canvas( figure )
				.width( 500 )
				.height( 1000 );

			// Create the canvas:
			canvas.create();

			// [3.1] Create a new KDE chart:
			KDE( canvas, kde[ i ], yMax, 400, 260, 90, 80, mapping[ datasets[ i ] ] );

			// [3.2] Create a new timeseries histogram chart:
			TimeseriesHistogram( canvas, hist, means, 400, 260, 90, 485, '' );

		} // end FOR i

		// Finished:
		clbk();

	}; // end GENERATOR


	// EXPORTS //

	module.exports = generator;

})();