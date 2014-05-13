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
		xfig = require( './../../../lib/xfig.js' ),

		// Module to decode dataset:
		mapping = require( './../../../utils/mapping.js' ),

		// Chart generators:
		Line = require( './charts/line.js' ),
		Multipanel = require( './charts/multipanel.js' );


	// GENERATOR //

	/**
	* FUNCTION: generator( document, selection, data, clbk )
	*
	*/
	var generator = function( document, selection, data, clbk ) {

		var figure, canvas,
			datasets = Object.keys( data ), d = [],
			xValue = function ( d ) {
				return d.x;
			},
			yValue = function ( d ) {
				return d.y[1] / (d.y[0]+d.y[1]);
			};

		// [1] Instantiate a new figure generator:
		figure = xfig.figure();

		// Create the figure:
		figure.create( document, selection );

		// [2] Instantiate a new canvas generator and configure:
		canvas = xfig.canvas( figure )
			.width( 500 )
			.height( 1000 );

		// Create the canvas:
		canvas.create();

		// TODO: insert quFRET timeseries for d[2]

		// [3] Extract individual timeseries:
		d[ 0 ] = [ data[ datasets[0] ][92] ];
		d[ 1 ] = [ data[ datasets[1] ][55] ];
		d[ 2 ] = [ data[ datasets[1] ][51] ];

		// [4] Generate the line charts...
		for ( var i = 0; i < d.length; i++ ) {
			d[ i ] = xfig.data( d[ i ] )
				.x( xValue )
				.y( yValue )
				.format( 2 );
		} // end FOR i

		Multipanel( canvas, d, 400, 720, 90, 80, '' ); // 720

		// Finished:
		clbk();

	}; // end GENERATOR


	// EXPORTS //

	module.exports = generator;

})();