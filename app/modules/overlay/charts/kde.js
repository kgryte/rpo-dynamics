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
		xfig = require( './../../../lib/xfig.js' );


	// KDE //

	/**
	*
	*/
	var kde = function( canvas, _data_, width, height, left, top, subtitle ) {

		var graph, area, axes, annotations, title, text,
			data = [], max = 0, _max,
			xValue = function( d ) {
				return d.x;
			},
			yValue = function( d ) {
				return d.y[1] / (d.y[0]+d.y[1]);
			},
			value = function ( d ) {
				return d[ 1 ];
			};

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
		graph.create( 'kde-overlay' );

		// [2] For each dataset, create a data object...
		for ( var i = 0; i < _data_.length; i++ ) {

			// Instantiate a new data generator and configure:
			data.push( xfig.data( _data_[ i ] )
				.x( xValue )
				.y( yValue ) );

			// Format the data and KDE the data:
			data[ i ].format( 2 )
				.concat()
				.kde( value, 0, 1 );

			// Calculate the max value so our chart is properly scaled:
			_max = data[ i ].max( value );

			if ( _max > max ) {
				max = _max;
			}

		} // end FOR i

		max += max * 0.05;
		graph.yMax( max );

		// [3] For each data object, bind data to the graph and create an area chart...
		for ( var j = 0; j < data.length; j++ ) {

			// Bind data to the graph:
			graph.data( data[ j ] );
			
			// Instantiate a new area generator and configure:
			area = xfig.area( graph )
				.labels( [ 'data ' + j ] );

			// Create the area chart:
			area.create();

		} // end FOR j

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