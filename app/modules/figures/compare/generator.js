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
		xfig = require( './../lib/xfig.js' ),

		// Module to decode dataset:
		mapping = require( './../../../utils/mapping.js' ),

		// Chart generators:
		KDE = require( './charts/kde.js' ),
		TimeseriesHistogram = require( './charts/timeseries-histogram.js' );


	// GENERATOR //

	/**
	*
	*/
	var generator = function( document, selection, data, clbk ) {

		var figure, datasets, d, canvas, left, top;

		// [1] Instantiate a new figure generator:
		figure = xfig.figure();

		// Create the figure:
		figure.create( document, selection );

		// [2] Get the datasets:
		datasets = Object.keys( data );

		// [3] Create a separate canvas for each dataset and create the line charts:
		for ( var i = 0; i < datasets.length; i++ ) {

			d = data[ datasets[ i ] ];

			// [3.0] Instantiate a new canvas generator and configure:
			canvas = xfig.canvas( figure )
				.width( 500 )
				.height( 1000 );

			// Create the canvas:
			canvas.create();

			// [3.1] Create a new line chart:
			KDE( canvas, d, 400, 260, 90, 80, mapping[ datasets[ i ] ] );

			// [3.2] Create a new timeseries histogram chart:
			TimeseriesHistogram( canvas, d, 400, 260, 90, 485, '' );

		} // end FOR i

		// Finished:
		clbk();

	}; // end GENERATOR


	// EXPORTS //

	module.exports = generator;

})();