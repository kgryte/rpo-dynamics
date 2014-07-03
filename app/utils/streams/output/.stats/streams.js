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

	var // Filesystem module:
		fs = require( 'fs' ),

		// Path module:
		path = require( 'path' ),

		// Write-to-file stream:
		writeStream = require( 'flow.io' ).write,

		// Hash of metric generators:
		Metrics = require( './../../metrics' ),

		// Stats reducer:
		Stats = require( './stats.js' );


	// VARIABLES //

	var STREAMS = [];


	// INIT //

	(function init() {
		var keys, name, metric, reduce;

		keys = Object.keys( Metrics );

		for ( var i = 0; i < keys.length; i++ ) {

			name = keys[ i ];

			// [0] Instantiate a new metric generator:
			metric = new Metrics[ name ]();

			// [1] Instantiate a new stats reduce stream generator:
			reduce = new Stats();

			// [2] Config the reduce:
			reduce.metric( metric );

			// [3] Append to our streams list:
			STREAMS.push( reduce );

		} // end FOR i
		
	})();


	// STREAM //

	/**
	* FUNCTION: stream( data, dir, prefix, clbk )
	*	Takes a readable JSON data stream and calculates stats. Calculated stats are written to file.
	*
	* @param {stream} data - JSON data stream
	* @param {string} dir - file output directory
	* @param {string} prefix - filename prefix; e.g., 'my-favorite-stats-name'
	* @param {function} clbk - (optional) callback to invoke after writing all streams.
	*/
	function stream( data, dir, prefix, clbk ) {
		var reduce, filename, filepath, write, ioStreams,
			total = STREAMS.length, counter = 0;

		// Cycle through each stream...
		for ( var i = 0; i < total; i++ ) {
		
			// Get the stats-metric reduction stream:
			reduce = STREAMS[ i ];

			// Generate the output filename:
			filename = prefix + '.' + reduce.name + '.' + reduce.type + '.json';

			filepath = path.join( dir, filename );

			// Create the write stream:
			write = writeStream( filepath, onEnd );

			// Get the input/output streams:
			ioStreams = reduce.stream();

			// Pipe the JSON data to the input stream:
			data.pipe( ioStreams[ 0 ] );

			// Pipe the output stream to file:
			ioStreams[ 1 ].pipe( write );

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
	} // end FUNCTION stream()


	// EXPORTS //

	module.exports = stream;

})();