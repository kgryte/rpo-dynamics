/**
*
*	STREAMS: output
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
*		- 2014/05/26: Created. [AReines].
*
*
*	DEPENDENCIES:
*		[1] 
*
*
*	LICENSE:
*		MIT
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

	var // Path module:
		path = require( 'path' ),

		// Timer module:
		Timer = require( './../../timer.js' ),

		// Output streams:
		STREAMS = require( './streams.js' ),

		// Module to retrieve a hash of data filenames:
		INDEX = require( './../../../../public/data' ).get( 'raw' );


	// VARIABLES //

	var PATH = path.resolve( __dirname, '../../../../public/data/raw' );


	// FUNCTIONS //

	/**
	* FUNCTION: onEnd( name, x, y, timer )
	*	Returns a function to indicate progress.
	*
	* @param {string} name - indicator namespace
	* @param {number} x - current iteration
	* @param {number} y - total iterations
	* @param {Timer} timer - Timer instance; used to clock build step duration
	* @param {function} clbk - callback
	* @returns {function} callback to invoke on end
	*/
	function onEnd( name, x, y, timer, clbk ) {
		return function onEnd() {
			console.log( name + ': finished. ' + x + ' of ' + y + ' output streams complete...' );
			console.log( 'Time Elapsed: ' + timer.split( name ) + ' seconds...' );
			clbk();
		};
	} // end FUNCTION onEnd()


	// STREAM //

	/**
	* FUNCTION: stream( callback )
	*	Run the streams.
	*
	* @param {function} callback - callback to invoke after all streams finish
	*/
	function stream( callback ) {
		var keys = Object.keys( STREAMS ),
			oStream, clbk,
			counter = 0, total = keys.length,
			stopwatch;

		// Initialize a new timer:
		stopwatch = new Timer();
		stopwatch.start();

		// Cycle through the streams...
		for ( var i = 0; i < total; i++ ) {
			oStream = STREAMS[ keys[ i ] ];
			clbk = onEnd( keys[ i ], i+1, total, stopwatch, done );
			oStream( PATH, INDEX, clbk );
		}

		return;

		/**
		* FUNCTION: done()
		*	Outputs total build time and split times to the console.
		*/
		function done() {
			stopwatch.stop();
			if ( ++counter === total ) {
				console.log( 'Total: ' + stopwatch.total() + ' seconds...' );
				console.log( 'Splits: ' + stopwatch.splits() );
				callback();
			}
		} // end FUNCTION done()
	} // end FUNCTION stream()


	// EXPORTS //

	module.exports = stream;

})();