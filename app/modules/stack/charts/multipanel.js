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
*		- 2014/06/02: Created. [AReines].
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
	* FUNCTION: multipanel( canvas, data, width, height, left, top, labels )
	*
	*/
	var multipanel = function( canvas, data, width, height, left, top, headers, labels ) {
		var multipanel,
			Data = [],
			d1, d2,
			key, datasets,
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
		key = Object.keys( data[0] );
		datasets = Object.keys( data[1] );

		numRows = datasets.length;
		numCols = 1;

		d1 = data[ 0 ][ key ][ 0 ];
		for ( var i = 0; i < numRows; i++ ) {
			d2 = data[ 1 ][ datasets[ i ] ][ 0 ];

			Data.push(
				xfig.data( [ d1, d2 ] )
			);

			// Compute the yMax:
			_yMax = Data[ Data.length-1 ].max( yValue );
			yMax = ( yMax < _yMax ) ? _yMax : yMax;
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