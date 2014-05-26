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
*		- 2014/05/11: Created. [AReines].
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
		xfig = require( './../../lib/xfig.js' ),

		// Module to decode dataset:
		mapping = require( './../../utils/mapping.js' ),

		// Chart generators:
		KDE = require( './charts/kde.js' );


	// GENERATOR //

	/**
	* FUNCTION: generator( document, selection, data, clbk )
	*
	*/
	var generator = function( document, selection, data, clbk ) {
		var figure, canvas,
			datasets, d = [],
			colors = [ 'pink', 'blue' ], title = [];

		// [1] Instantiate a new figure generator:
		figure = xfig.figure();

		// Create the figure:
		figure.create( document, selection );

		// [2] Get the datasets:
		datasets = Object.keys( data );

		for ( var i = 0; i < datasets.length; i++  ) {
			d.push( data[ datasets[ i ] ] );
			title.push( '<span class="'+ colors[ i ] + '">' + mapping[ datasets[ i ] ] + '</span>');
		}

		// [3] Instantiate a new canvas generator and configure:
		canvas = xfig.canvas( figure )
			.width( 1000 )
			.height( 700 );

		// Create the canvas:
		canvas.create();

		// [4] Create a new KDE overlay chart:
		KDE( canvas, d, 800, 520, 90, 80, title.join( ' | ' ) );

		// Finished:
		clbk();

	}; // end GENERATOR


	// EXPORTS //

	module.exports = generator;

})();