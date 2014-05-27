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
		KDE = require( './charts/kde.js' );


	// GENERATOR //

	/**
	* FUNCTION: generator( document, selection, data, clbk )
	*
	*/
	var generator = function( document, selection, data, clbk ) {
		var figure, canvas,
			datasets = Object.keys( data ),
			d,
			labels = [ 'a', '', 'b', '' ],
			left, top;

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

		// [3] Assemble our datasets and generate a KDE:
		for ( var i = 0; i < datasets.length; i++ ) {

			// [3.0] Instantiate a new data generator and configure:
			d = xfig.data( data[ datasets[ i ] ] );

			// [3.1] KDE:
			left = 90 + ( 540 * (i%2) );
			top = 80 + ( 405 * Math.floor( i / 2 ) );

			KDE( canvas, d, 400, 260, left, top, labels[ i ] );
		}

		// Finished:
		clbk();

	}; // end GENERATOR


	// EXPORTS //

	module.exports = generator;

})();