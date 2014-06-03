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
*		- 2014/04/25: Created. [AReines].
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


	// MULTIPANEL //

	/**
	* FUNCTION: multipanel( canvas, data, width, height, left, top, subtitle )
	*
	*/
	var multipanel = function( canvas, data, width, height, left, top, subtitle ) {

		var multipanel,
			Data = [],
			graphs, line,
			annotations, title,
			idx;

		// [1] Instantiate a new multipanel generator and configure:
		multipanel = xfig.multipanel( canvas )
			.width( width )
			.height( height )
			.paddingTop( 25 )
			.position({
				'left': left,
				'top': top
			});

		// [2] For each panel dataset, instantiate a new data generator and configure:
		idx = [0,1,2].map( function ( id ) {
			return Math.round( Math.random() * data.length );
		});
		for ( var i = 0; i < 3; i++ ) {
			Data.push( xfig.data( [ data[ idx[i] ] ] ) );
		} // end FOR i

		// Bind the data instance to the multipanel:
		multipanel.data( Data )
			.rows( Data.length )
			.cols( 1 )
			.xMin( Data[0].min( function ( d ) { return d[ 0 ]; } ) )
			.xMax( Data[0].max( function ( d ) { return d[ 0 ]; } ) )
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