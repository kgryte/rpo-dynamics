/**
*
*	STREAM: stats
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
*		- 2014/05/22: Created. [AReines].
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
*/

(function() {
	'use strict';

	// MODULES //

	var // Path module:
		path = require( 'path' ),

		// Flow streams:
		flow = require( 'flow.io' ),

		// Hash of metric generators:
		METRICS = require( './../../metrics' ),

		// Stats reduce streams:
		statsStreams = require( './stats.js' );


	// VARIABLES //

	var STREAMS = [];


	// INIT //

	(function init() {
		var keys, name, metric, rStream;

		keys = Object.keys( METRICS );

		for ( var i = 0; i < keys.length; i++ ) {

			name = keys[ i ];

			// [0] Instantiate a new metric generator:
			metric = METRICS[ name ]();

			// [1] Instantiate a new stats reduce stream generator:
			rStream = statsStreams();

			// [2] Config the reduce:
			rStream.metric( metric );

			// [3] Append to our streams list:
			STREAMS.push( rStream );

		} // end FOR i
		
	})();


	// STREAM //

	/**
	* FUNCTION: streams( dStream, dir, prefix, clbk )
	*	Takes a readable JSON data stream and calculates stats. Calculated stats are written to file.
	*
	* @param {stream} dStream - JSON data stream
	* @param {string} dir - file output directory
	* @param {string} prefix - filename prefix; e.g., 'my-favorite-stats-name'
	* @param {function} clbk - (optional) callback to invoke after writing all streams.
	*/
	function streams( dStream, dir, prefix, clbk ) {
		var reduce, rStream, writeStream, stringify,
			filename, filepath,
			wStream, sStream, ioStreams,
			total = STREAMS.length, counter = 0;

		// Create a stream generators:
		writeStream = flow.write();

		// Cycle through each stream...
		for ( var i = 0; i < total; i++ ) {
		
			reduce = STREAMS[ i ];

			// Generate the output filename:
			filename = prefix + '.' + reduce.name + '.' + reduce.type + '.json';

			filepath = path.join( dir, filename );

			// Get the stats-metric reduction input/output streams:
			ioStreams = reduce.stream();

			// Create the write stream:
			wStream = writeStream.path( filepath )
				.stream( onEnd );

			// Pipe the JSON data to the input stream:
			dStream.pipe( ioStreams[ 0 ] );

			// Pipe the output stream to file:
			ioStreams[ 1 ].pipe( wStream );

		} // end FOR i

		return;

		/**
		* FUNCTION: onEnd()
		*	Invoked when writing to file has finished.
		*/
		function onEnd() {
			if ( ++counter === total ) {
				if ( clbk ) {
					clbk();
				}
			}
		} // end FUNCTION onEnd()
	} // end FUNCTION streams()


	// EXPORTS //

	module.exports = streams;

})();