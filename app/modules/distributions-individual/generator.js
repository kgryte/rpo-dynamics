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
*		- 2014/06/06: Created. [AReines].
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
		KDE = require( './charts/kde.js' );


	// FUNCTIONS //

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
		var figure, canvas,
			numData = data[ 1 ].length,
			Data = new Array( numData ),
			yMax = Number.NEGATIVE_INFINITY, max;

		// [1] Instantiate a new figure generator:
		figure = xfig.figure();

		// Create the figure:
		figure.create( document, selection );

		// Select the figure element and set a data attribute:
		selection.querySelector( '.figure' )
			.setAttribute( 'data-sortable', 1 );

		// [2] Compute the average for the summary KDE...
		for ( var n = 0; n < data[0][0].length; n++ ) {
			data[0][0][n][1] /= numData;
		} // end FOR n

		// [3] For each dataset, instantiate a new data generator and configure...
		for ( var d = 0; d < numData; d++ ) {
			// New data instance:
			Data[ d ] = xfig.data( [ data[1][d], data[0][0] ] );

			// Compute the y-max:
			max = Data[ d ].max( yValue );

			if ( max > yMax ) {
				yMax = max;
			}
		} // end FOR d

		yMax += yMax * 0.05;

		// [4] Create a separate canvas for each dataset and create the KDE charts:
		for ( var i = 0; i < Data.length; i++ ) {

			// [4.0] Instantiate a new canvas generator and configure:
			canvas = xfig.canvas( figure )
				.width( 500 )
				.height( 430 );

			// Create the canvas:
			canvas.create();

			// [4.1] Create a new KDE chart:
			KDE( canvas, Data[ i ], yMax, 400, 260, 90, 80, i+1 );

		} // end FOR i

		// Finished:
		clbk();

	}; // end GENERATOR


	// EXPORTS //

	module.exports = generator;

})();