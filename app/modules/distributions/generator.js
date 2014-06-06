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
*		- 2014/05/02: Created. [AReines].
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
		var figure, datasets, canvas,
			Data = [], dat,
			yMax = Number.NEGATIVE_INFINITY, max;

		// [1] Instantiate a new figure generator:
		figure = xfig.figure();

		// Create the figure:
		figure.create( document, selection );

		// Select the figure element and set a data attribute:
		selection.querySelector( '.figure' )
			.setAttribute( 'data-sortable', 1 );

		// [2] Get the datasets:
		datasets = Object.keys( data );

		// [3] For each dataset, instantiate a new data generator and configure...
		for ( var d = 0; d < datasets.length; d++ ) {
			dat = data[ datasets[d] ];
			Data.push( xfig.data( dat ) );
			max = Data[ d ].max( yValue );
			if ( max > yMax ) {
				yMax = max;
			}
		}

		yMax += yMax * 0.05;
		
		// [4] Create a separate canvas for each dataset and create the KDE charts...
		for ( var i = 0; i < Data.length; i++ ) {

			// [3.0] Instantiate a new canvas generator and configure:
			canvas = xfig.canvas( figure )
				.width( 500 )
				.height( 450 );

			// Create the canvas:
			canvas.create();

			// [3.1] Create a new KDE chart:
			KDE( canvas, Data[ i ], yMax, 400, 260, 90, 80, mapping[ datasets[i] ] );

		} // end FOR i

		// Finished:
		clbk();

	}; // end GENERATOR


	// EXPORTS //

	module.exports = generator;

})();