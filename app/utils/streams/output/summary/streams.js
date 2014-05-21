/**
*
*	STREAM: summary
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
*		- 2014/05/18: Created. [AReines].
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

				// For each metric, create transform streams...
				for ( var j = 0; j < metrics.length; j++ ) {

					// Instantiate a new transform stream generator:
					transform = new Transform();

					// Configure the transform:
					transform.metric( metrics[ j ] );

					// Include the file in our streams list:
					STREAMS.push( transform );

				} // end FOR j

			} // end IF !hidden

		} // end FOR i

	})();


	// STREAM //

	/**
	* FUNCTION: stream( data, dir, clbk )
	*	Takes a data collection and calculates summary statistics. Calculated summary statistics are written to file.
	*
	* @param {array} data - array of data arrays
	* @param {string} dir - file output directory
	* @param {function} clbk - (optional) callback to invoke after writing all streams.
	*/
	function stream( data, dir, clbk ) {
		var transform, write,
			filename, filepath,
			total = STREAMS.length,
			counter = 0;

		// Cycle through each stream...
		for ( var i = 0; i < total; i++ ) {
		
			// Instantiate a stream instance and configure:
			transform = STREAMS[ i ];

			// Generate the output filename:
			filename = transform.name + '.' + transform.type + '.json';

			filepath = path.join( dir, filename );

			// Create the write stream:
			write = writeStream( filepath, onEnd );

			// Pipe the transform stream to file:
			transform.stream( data )
				.pipe( write );

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