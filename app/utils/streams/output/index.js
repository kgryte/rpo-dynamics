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


	// STREAM //

	/**
	* FUNCTION: run( callback )
	*	Run the streams.
	*
	* @param {function} callback - callback to invoke after all streams finish
	*/
	function run( callback ) {
		var keys = Object.keys( STREAMS ),
			total = keys.length,
			key, stopwatch;

		// Initialize a new timer:
		stopwatch = new Timer();
		stopwatch.start();

		// Begin the streams:
		key = keys.shift();
		stream();

		return;

		/**
		* FUNCTION: stream()
		*	Runs a single set of output streams.
		*
		* @private
		*/
		function stream() {
			var oStream = STREAMS[ key ];
			oStream( PATH, INDEX, onEnd );
		} // end FUNCTION stream()

		/**
		* FUNCTION: onEnd()
		*	Callback invoked once a set of output streams are finished.
		*
		* @private
		*/
		function onEnd() {
			// stdout:
			console.log( key + ': finished. ' + ( total-keys.length ) + ' of ' + total + ' output streams complete...' );
			console.log( 'Time Elapsed: ' + stopwatch.split( key ) + ' seconds...' );

			// Proceed to run next stream...
			if ( keys.length ) {
				key = keys.shift();
				stream();
				return;
			}

			stopwatch.stop();

			// Output the final times...
			console.log( 'Total: ' + stopwatch.total() + ' seconds...' );
			console.log( 'Splits: ' + stopwatch.splits() );

			done();
		} // end FUNCTION onEnd()

		/**
		* FUNCTION: done()
		*	Invokes the provided callback once all streams are finished.
		*
		* @private
		*/
		function done() {
			callback();
		} // end FUNCTION done()
	} // end FUNCTION run()


	// EXPORTS //

	module.exports = run;

})();