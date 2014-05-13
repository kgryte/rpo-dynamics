/**
*
*	CHART: multipanel
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


	// MULTIPANEL //

	/**
	*
	*/
	var multipanel = function( canvas, data, width, height, left, top, subtitle ) {

		var multipanel, graphs, line, annotations, title;

		// [1] Instantiate a new multipanel generator and configure:
		multipanel = xfig.multipanel( canvas )
			.width( width )
			.height( height )
			.padding( 25 )
			.position({
				'left': left,
				'top': top
			});

		// [2] Bind the data instance to the multipanel:
		multipanel.data( data )
			.xMin( data[0].min( function ( d ) { return d[ 0 ]; } ) )
			.xMax( data[0].max( function ( d ) { return d[ 0 ]; } ) )
			.yMin( 0 )
			.xLabel( 'time [sec]' )
			.yLabel( 'E' )
			.yNumTicks( 4 )
			.xTickDirection( 'both' )
			.xInnerTickSize( 12 )
			.xOuterTickSize( 0 );

		// Create the multipanel:
		multipanel.create();

		// [3] Instantiate a new annotations generator and configure:
		annotations = xfig.annotations( multipanel );

		// Create the annotations element:
		annotations.create();

		// [3.1] Instantiate a new title instance and configure:
		title = annotations.title()
			.top( -65 )
			.left( -90 );

		// Add a (sub)title:
		title.create( '<span class="subtitle">' + subtitle + '</span>' );

		// [4] For each panel graph, instantiate a new line generator and configure:
		graphs = multipanel.children().graph;
		for ( var j = 0; j < graphs.length; j++ ) {

			line = xfig.line( graphs[ j ] )
				.labels( [ 'data ' + j ] );

			// Create the line graph:
			line.create();

		} // end FOR j

	}; // end MULTIPANEL


	// EXPORTS //

	module.exports = multipanel;

})();