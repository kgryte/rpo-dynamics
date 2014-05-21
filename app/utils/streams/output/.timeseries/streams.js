/**
*
*	STREAM: timeseries
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

		// JSON stringify stream:
		stringify = require( './../../json/stringify.js' ),

		// Write-to-file stream:
		writeStream = require( './../../file/write.js' ),

		// Hash of metric generators:
		Metrics = require( './../../metrics' ),

		// Timeseries transform:
		Transform = require( './transform.js' );


	// VARIABLES //

	var STREAMS = [];


	// INIT //

	(function init() {
		var keys, name, metric, transform;

		keys = Object.keys( Metrics );

		for ( var i = 0; i < keys.length; i++ ) {

			name = keys[ i ];

			// [0] Instantiate a new metric generator:
			metric = new Metrics[ name ]();

			// [1] Instantiate a new timeseries transform stream generator:
			transform = new Transform();

			// [2] Config the transform:
			transform.metric( metric );

			// [3] Append to our streams list:
			STREAMS.push( transform );

		} // end FOR i
		
	})();


	// STREAM //

	/**
	* FUNCTION: stream( data, dir, prefix, clbk )
	*	Takes a readable JSON data stream and calculates timeseries. Calculated timeseries are written to file.
	*
	* @param {stream} data - JSON data stream
	* @param {string} dir - file output directory
	* @param {string} prefix - filename prefix; e.g., 'my-favorite-timeseries-name'
	* @param {function} clbk - (optional) callback to invoke after writing all streams.
	*/
	function stream( data, dir, prefix, clbk ) {
		var transform, filename, filepath, write,
			total = STREAMS.length, counter = 0;

		// Cycle through each stream...
		for ( var i = 0; i < total; i++ ) {
		
			// Get the timeseries metric transform stream:
			transform = STREAMS[ i ];

			// Generate the output filename:
			filename = prefix + '.' + transform.name + '.' + transform.type + '.json';

			filepath = path.join( dir, filename );

			// Create the write stream:
			write = writeStream( filepath, onEnd );

			// Pipe the JSON data:
			data.pipe( transform.stream() )
				.pipe( stringify() )
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