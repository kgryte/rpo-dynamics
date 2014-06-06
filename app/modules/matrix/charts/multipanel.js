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
		xfig = require( 'figure.io' );


	// MULTIPANEL //

	/**
	* FUNCTION: multipanel( canvas, data, width, height, left, top, headers, labels )
	*
	*/
	var multipanel = function( canvas, data, width, height, left, top, headers, labels ) {
		var multipanel,
			Data = [],
			datasets,
			numRows, numCols,
			graphs, area,
			yValue = function ( d ) { return d[ 1 ]; },
			_yMax, yMax = 0;

		// [1] Instantiate a new multipanel generator and configure:
		multipanel = xfig.multipanel( canvas )
			.width( width )
			.height( height )
			.gutter( 120 )
			.position({
				'left': left,
				'top': top
			});

		// [2] For each panel dataset, instantiate a new data generator and configure:
		datasets = Object.keys( data );

		numRows = datasets.length;
		numCols = numRows;

		for ( var i = 0; i < numRows; i++ ) {
			for ( var j = 0; j < numCols; j++ ) {

				Data.push(
					xfig.data( [ data[ datasets[i] ][0], data[ datasets[j] ][0] ] )
				);

				// Compute the yMax:
				_yMax = Data[ Data.length-1 ].max( yValue );
				yMax = ( yMax < _yMax ) ? _yMax : yMax;
			} // end FOR j
		} // end FOR i

		// Bind the data instance to the multipanel:
		multipanel.data( Data )
			.rows( numRows )
			.cols( numCols )
			.xMin( 0 )
			.xMax( 1 )
			.yMin( 0 )
			.yMax( yMax )
			.xLabel( 'E' )
			.yLabel( 'density [a.u.]' )
			.yNumTicks( 4 )
			.headers( headers )
			.labels( labels );

		// Create the multipanel:
		multipanel.create();

		// [3] For each panel graph, instantiate a new area generator and configure:
		graphs = multipanel.children().graph;
		for ( var k = 0; k < graphs.length; k++ ) {
			area = xfig.area( graphs[ k ] )
				.labels( [ 'data 0', 'data 1' ] );

			// Create the area:
			area.create();
		} // end FOR k

	}; // end MULTIPANEL


	// EXPORTS //

	module.exports = multipanel;

})();