/**
*
*	CHART: line
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
*		- 2014/05/12: Created. [AReines].
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
		xfig = require( './../../../../lib/xfig.js' );


	// LINE //

	/**
	* FUNCTION: line( canvas, data, widget, height, left, top, subtitle )
	*
	*/
	var line = function( canvas, data, width, height, left, top, subtitle ) {

		var graph, line, axes, annotations, title, text;

		// [1] Instantiate a new graph generator and configure:
		graph = xfig.graph( canvas )
			.width( width )
			.height( height )
			.position({
				'left': left,
				'top': top
			})
			.yMin( 0 )
			.yMax( 1 );

		// Create the graph:
		graph.create( 'line' );

		// [2] Bind the data instance to the graph:
		graph.data( data )
			.xMin( data.min( function ( d ) { return d[ 0 ]; } ) )
			.xMax( data.max( function ( d ) { return d[ 0 ]; } ) );

		// [3] Instantiate a new line generator and configure:
		line = xfig.line( graph )
			.labels( [ 'data 0' ] );

		// Create the line graph:
		line.create();

		// [4] Instantiate a new axes generator and configure:
		axes = xfig.axes( graph )
			.xLabel( 'time [sec]' )
			.yLabel( 'E' );

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

	}; // end LINE


	// EXPORTS //

	module.exports = line;

})();