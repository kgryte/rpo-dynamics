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
		KDE = require( './charts/kde.js' ),
		FRET = require( './charts/efficiency.js' ),
		Raw = require( './charts/raw.js' );


	// GENERATOR //

	/**
	* FUNCTION: generator( document, selection, data, clbk )
	*
	*/
	var generator = function( document, selection, data, clbk ) {
		var figure, canvas,
			dataset1 = Object.keys( data[ 0 ] )[ 0 ],
			dataset2 = Object.keys( data[ 3 ] )[ 0 ],
			d = [], raw, dat = [[],[]];


		// [1] Instantiate a new figure generator:
		figure = xfig.figure();

		// Create the figure:
		figure.create( document, selection );

		// [2] Instantiate a new canvas generator and configure:
		canvas = xfig.canvas( figure )
			.width( 1200 )
			.height( 800 );

		// Create the canvas:
		canvas.create();

		// [3] Assemble our datasets...

		raw = data[ 0 ][ dataset1 ][10];
		for ( var i = 0; i < raw.length; i++ ) {
			dat[ 0 ].push([
				raw[ i ].x,
				raw[ i ].y[ 0 ]
			]);
			dat[ 1 ].push([
				raw[ i ].x,
				raw[ i ].y[ 1 ]
			]);
		}

		// Raw intensities:
		d[ 0 ] = xfig.data( dat )
			.x( function ( d ) { return d[0]; } )
			.y( function ( d ) { return d[1]; } )
			.format( 2 );

		// FRET:
		d[ 1 ] = xfig.data( [ data[ 1 ][ dataset1 ][10] ] );

		// KDE:
		d[ 2 ] = xfig.data( data[ 2 ][ dataset1 ] );

		// KDE:
		d[ 3 ] = xfig.data( data[ 3 ][ dataset2 ] );

		// [4] Generate a example intensity timeseries from the first dataset:
		Raw( canvas, d[ 0 ], 400, 260, 90, 80, 'a' );

		// [5] Generate an example FRET timeseries from the first dataset:
		FRET( canvas, d[ 1 ], 400, 260, 630, 80, 'b' );

		// [6] Generate the KDE for the first dataset:
		KDE( canvas, d[ 2 ], 400, 260, 90, 485, 'c' );

		// [7] Generate the KDE for the second dataset:
		KDE( canvas, d[ 3 ], 400, 260, 630, 485, 'd' );

		// Finished:
		clbk();

	}; // end GENERATOR


	// EXPORTS //

	module.exports = generator;

})();