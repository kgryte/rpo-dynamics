/**
*
*	CHART: kde
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


	// KDE //

	/**
	* FUNCTION: kde( canvas, data, width, height, left, top, subtitle )
	*
	*/
	var kde = function( canvas, data, width, height, left, top, subtitle ) {
		var graph, area, max, axes, annotations, title, text;

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
		graph.create( 'kde' );

		// [2] Instantiate a new data generator and configure:
		data = xfig.data( data )
			.x( function ( d ) { return d[ 0 ]; } )
			.y( function ( d ) { return d[ 1 ]; } );

		// Bind the data instance to the graph:
		max = data.max( function ( d ) {
			return d[ 1 ];
		});
		max += max * 0.05;
		graph.data( data )
			.yMax( max );

		// [3] Instantiate a new area generator and configure:
		area = xfig.area( graph )
			.labels( [ 'data 0' ] );

		// Create the area chart:
		area.create();

		// [4] Instantiate a new axes generator and configure:
		axes = xfig.axes( graph )
			.xLabel( 'E' )
			.yLabel( 'density [au]' );

		// Create the axes:
		axes.create();

		// [5] Instantiate a new annotations generator and configure:
		annotations = xfig.annotations( graph );

		// Create the annotations element:
		annotations.create();

		// [5.1] Instantiate a new title instance and configure:
		title = annotations.title()
			.top( -65 )
			.left( -90 )
			.width( width )
			.height( 40 );

		// Add a (sub)title:
		title.create( '<span class="subtitle desc">' + subtitle + '</span>' );

	}; // end KDE


	// EXPORTS //

	module.exports = kde;

})();