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

		// Flow streams:
		flow = require( 'flow.io' ),

		// Hash of metric generators:
		METRICS = require( './../../metrics' );


	// VARIABLES //

	var STREAMS = [];


	// FUNCTIONS //

	/**
	* FUNCTION: filter( file )
	*	Keep only JavaScript scripts and exclude the index.js file.
	*
	* @private
	*/
	function filter( file ) {
		return file.substr( -3 ) === '.js' && file !== 'index.js' && file !== 'streams.js';
	} // end FUNCTION filter()


	// INIT //

	(function init() {

		var files, keys, name, metric, metrics = [], filepath, tStream, transform;

		// Get the file names:
		files = fs.readdirSync( __dirname )
			.filter( filter );

		// Get the metric names:
		keys = Object.keys( METRICS );

		// Instantiate new metric generators:
		for ( var m = 0; m < keys.length; m++ ) {
			name = keys[ m ];
			metric = METRICS[ name ]();
			metrics.push( metric );
		}

		// Create the stream generators...
		for ( var i = 0; i < files.length; i++ ) {

			if ( files[ i ][ 0 ] !== '.' ) {

				// Assemble the path:
				filepath = path.join( __dirname, files[ i ] );

				// Get the transform generator:
				transform = require( filepath );

				// For each metric, create transform streams...
				for ( var j = 0; j < metrics.length; j++ ) {

					// Instantiate a new transform stream generator:
					tStream = transform();

					// Configure the transform:
					tStream.metric( metrics[ j ] );

					// Include the transform stream in our streams list:
					STREAMS.push( tStream );

				} // end FOR j

			} // end IF !hidden

		} // end FOR i

	})();


	// STREAMS //

	/**
	* FUNCTION: streams( dStream, dir, prefix, clbk )
	*	Takes a readable JSON data stream and calculates stats. Calculated stats are written to file.
	*
	* @param {stream} dStream - JSON data stream
	* @param {string} dir - file output directory
	* @param {string} prefix - filename prefix; e.g., 'my-favorite-timeseries-name'
	* @param {function} clbk - (optional) callback to invoke after writing all streams.
	*/
	function streams( dStream, dir, prefix, clbk ) {
		var transform, tStream, writeStream,
			filename, filepath,
			wStream,
			total = STREAMS.length, counter = 0;

		// Create stream generators:
		writeStream = flow.write();

		// Cycle through each stream...
		for ( var i = 0; i < total; i++ ) {

			transform = STREAMS[ i ];
		
			// Generate the output filename:
			filename = prefix + '.' + transform.name + '.' + transform.type + '.json';

			filepath = path.join( dir, filename );

			// Get the distribution transform stream:
			tStream = transform.stream();

			// Create the write stream:
			wStream = writeStream
				.path( filepath )
				.stream( onEnd );

			// Pipe the JSON data to the transform stream and write to file:
			dStream
				.pipe( tStream )
				.pipe( wStream );
				
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