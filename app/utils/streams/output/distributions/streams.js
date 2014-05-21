/**
*
*	STREAM: distributions
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
		writeStream = require( './../../file/write.js' ),

		// Hash of metric generators:
		Metrics = require( './../../metrics' );


	// VARIABLES //

	var STREAMS = [];


	// FUNCTIONS //

	/**
	* FUNCTION: filter( file )
	*	Keep only JavaScript scripts and exclude the index.js file.
	*/
	function filter( file ) {
		return file.substr( -3 ) === '.js' && file !== 'index.js' && file !== 'streams.js';
	} // end FUNCTION filter()


	// INIT //

	(function init() {

		var files, keys, name, metric, metrics = [], filepath, Transform, transform;

		// Get the file names:
		files = fs.readdirSync( __dirname )
			.filter( filter );

		// Get the metric names:
		keys = Object.keys( Metrics );

		// Instantiate new metric generators:
		for ( var m = 0; m < keys.length; m++ ) {
			name = keys[ m ];

			metric = new Metrics[ name ]();

			metrics.push( metric );
		}

		// Create the stream generators...
		for ( var i = 0; i < files.length; i++ ) {

			if ( files[ i ][ 0 ] !== '.' ) {

				// Assemble the path:
				filepath = path.join( __dirname, files[ i ] );

				// Get the transform generator:
				Transform = require( filepath );

				// For each metric create transform streams...
				for ( var j = 0; j < metrics.length; j++ ) {

					// Instantiate a new transform stream generator:
					transform = new Transform();

					// Configure the transform:
					transform.metric( metrics[ j ] );

					// Include the transform stream in our streams list:
					STREAMS.push( transform );

				} // end FOR j

			} // end IF !hidden

		} // end FOR i

	})();


	// STREAM //

	/**
	* FUNCTION: stream( data, dir, prefix, clbk )
	*	Takes a readable JSON data stream and calculates stats. Calculated stats are written to file.
	*
	* @param {stream} data - JSON data stream
	* @param {string} dir - file output directory
	* @param {string} prefix - filename prefix; e.g., 'my-favorite-timeseries-name'
	* @param {function} clbk - (optional) callback to invoke after writing all streams.
	*/
	function stream( data, dir, prefix, clbk ) {
		var transform, filename, write, ioStreams,
			total = STREAMS.length, counter = 0;

		// Cycle through each stream...
		for ( var i = 0; i < total; i++ ) {
		
			// Get the distribution transform stream:
			transform = STREAMS[ i ];

			// Generate the output filename:
			filename = dir + '/' + prefix + '.' + transform.name + '.' + transform.type + '.json';

			// Create the write stream:
			write = writeStream( filename, onEnd );

			// Get the input and output streams:
			ioStreams = transform.stream();

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