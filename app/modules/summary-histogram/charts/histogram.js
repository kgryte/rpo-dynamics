/**
*
*	CHART: histogram
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
*		- 2014/04/24: Created. [AReines].
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
		xfig = require( 'figure.io' );


	// HISTOGRAM //

	/**
	* FUNCTION: histogram( canvas, data, width, height, left, top, subtitle )
	*
	*/
	var histogram = function( canvas, data, width, height, left, top, subtitle ) {

		var graph, histogram, axes, annotations, title;

		// [1] Instantiate a new graph generator and configure:
		graph = xfig.graph( canvas )
			.width( width )
			.height( height )
			.position({
				'left': left,
				'top': top
			})
			.xMin( 0 )
			.xMax( 1 )
			.yMin( 0 );

		// Create the graph:
		graph.create( 'histogram' );

		// [2] Instantiate a new data generator and configure:
		data = xfig.data( data );

		// Bind the data instance to the graph:
		graph.data( data )
			.yMax( data.max( function ( d ) {
				return d[ 1 ];
			}));

		// [3] Instantiate a new histogram generator and configure:
		histogram = xfig.histogram( graph )
			.labels( [ 'data 0' ] );

		// Create the histogram:
		histogram.create();

		// [4] Instantiate a new axes generator and configure:
		axes = xfig.axes( graph )
			.xLabel( 'E' )
			.yLabel( 'counts' );

		// Create the axes:
		axes.create();

		// [5] Instantiate a new annotations generator and configure:
		annotations = xfig.annotations( graph );

		// Create the annotations element:
		annotations.create();

		// [5.1] Instantiate a new title instance and configure:
		title = annotations.title()
			.top( -65 )
			.left( -90 );

		// Add a (sub)title:
		title.create( '<span class="subtitle">' + subtitle + '</span>' );

	}; // end HISTOGRAM


	// EXPORTS //

	module.exports = histogram;

})();