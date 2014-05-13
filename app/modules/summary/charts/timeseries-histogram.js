/**
*
*	CHART: timeseries-histogram
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
		xfig = require( './../../../lib/xfig.js' );


	// HISTOGRAM //

	/**
	*
	*/
	var histogram = function( canvas, data, width, height, left, top, subtitle ) {

		var graph, histogram, edges, axes, annotations, title, text, means;

		// [1] Instantiate a new graph generator and configure:
		graph = xfig.graph( canvas )
			.width( width )
			.height( height )
			.position({
				'left': left,
				'top': top
			})
			.xMin( 0 )
			.xMax( 1 );

		// Create the graph:
		graph.create( 'timeseries-histogram' );

		// [2] Instantiate a new data generator and configure:
		data = xfig.data( data )
			.x( function ( d ) { return d.x; } )
			.y( function ( d ) { return d.y[1] / ( d.y[0]+d.y[1] ); } );

		// Create edges to define our histogram bins:
		edges = xfig.vector.linspace( -0.01, 1.01, 0.02 );
		
		// Transform the data and extract the data to histogram:
		data.format( 2 )
			.extract( function ( d ) { return d[ 1 ]; });

		// Calculate each dataset's mean value and sort the datasets based on their means:
		means = data.mean( function ( d ) { return d; });
		means = means.map( function ( d, i ) {
			return [ d, i ];
		});
		means.sort( function ( a, b ) {
			return a[0] < b[0] ? -1 : ( a[0] > b[0] ? 1 : 0 );
		});
		means = means.map( function ( d ) {
			return d[ 1 ];
		});

		// Calculate the histogram:
		data.reorder( means )
			.histc( function ( d ) { return d; }, edges );

		// Bind the data instance to the graph:
		graph.data( data )
			.yMin( 0 )
			.yMax( data.size()[0] )
			.zMin( 0 )
			.zMax( data.max( function ( d ) {
				return d[ 1 ];
			}))
			.zRange( ['#ffffff', '#000000'] );

		// [3] Instantiate a new histogram generator and configure:
		histogram = xfig.timeserieshistogram( graph );

		// Create the histogram:
		histogram.create();

		// [4] Instantiate a new axes generator and configure:
		axes = xfig.axes( graph )
			.xLabel( 'E' )
			.yLabel( 'molecule' );

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