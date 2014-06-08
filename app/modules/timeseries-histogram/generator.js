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
*		- 2014/06/07: Created. [AReines].
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
		histogram = require( './charts/timeseries-histogram.js' );


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

	/**
	* FUNCTION: indexify( d, i )
	*	Binds an array index to each datum.
	*
	* @param {number} d - datum
	* @param {number} i - index
	* @returns {array} [ d, i ]
	*/
	function indexify( d, i ) {
		return [ d, i ];
	} // end FUNCTION indexify()

	/**
	* FUNCTION: sort( a, b )
	*	Descending sort.
	*
	* @param {array} a - datum
	* @param {array} b - datum
	* @returns {number} -1 if a<b; 1 if a>b; else 0
	*/
	function sort( a, b ) {
		return a[0] < b[0] ? -1 : ( a[0] > b[0] ? 1 : 0 );
	} // end FUNCTION sort()


	// GENERATOR //

	/**
	* FUNCTION: generator( document, selection, data, clbk )
	*
	*/
	var generator = function( document, selection, data, clbk ) {
		var figure, canvas, datasets,
			hist, means,
			Data = [];

		// [1] Instantiate a new figure generator:
		figure = xfig.figure();

		// Create the figure:
		figure.create( document, selection );

		// Select the figure element and set a data attribute:
		selection.querySelector( '.figure' )
			.setAttribute( 'data-sortable', 1 );

		// [2] Get the datasets:
		datasets = Object.keys( data[ 0 ] );

		// [3] For each dataset, instantiate a new data generator, sort the timeseries histograms according to the means, and configure...
		for ( var d = 0; d < datasets.length; d++ ) {
			hist = data[ 0 ][ datasets[d] ][ 0 ];
			means = data[ 1 ][ datasets[d] ][ 0 ];

			Data.push( xfig.data( hist ) );

			// Sort the means:
			means = means.map( indexify );
			means.sort( sort );
			means = means.map( yValue );
			
			// Reorder the timeseries histograms:
			Data[ d ].reorder( means );
		} // end FOR d

		// [4] Create a separate canvas for each dataset and create the KDE charts...
		for ( var i = 0; i < Data.length; i++ ) {

			// [3.0] Instantiate a new canvas generator and configure:
			canvas = xfig.canvas( figure )
				.width( 500 )
				.height( 450 );

			// Create the canvas:
			canvas.create();

			// [3.1] Create a new timeseries histogram chart:
			histogram( canvas, Data[ i ], 400, 260, 90, 80, mapping[ datasets[i] ] );

		} // end FOR i

		// Finished:
		clbk();

	}; // end GENERATOR


	// EXPORTS //

	module.exports = generator;

})();