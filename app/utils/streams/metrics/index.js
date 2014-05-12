/**
*
*	STREAM: metrics
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

		// JSON stringify stream:
		stringify = require( './../json_stringify.js' ),

		// Write-to-file stream:
		writeStream = require( './../file_write.js' );


	// VARIABLES //

	var METRICS = [];


	// FUNCTIONS //

	/**
	* FUNCTION: filter( file )
	*	Keep only JavaScript scripts and exclude the index.js file.
	*/
	function filter( file ) {
		return file.substr( -3 ) === '.js' && file !== 'index.js';
	} // end FUNCTION filter()


	// INIT //

	(function init() {

		var files, path;

		// Get the file names:
		files = fs.readdirSync( __dirname )
			.filter( filter );

		// Read in the metric stream generators...
		for ( var i = 0; i < files.length; i++ ) {

			if ( files[ i ][ 0 ] !== '.' ) {

				// Assemble the path:
				path = __dirname + '/' + files[ i ];

				// Include the file in our metric list:
				METRICS.push( require( path ) );

			} // end IF !hidden

		} // end FOR i

	})();


	// STREAM //

	/**
	* FUNCTION: stream( data, dir, prefix, clbk )
	*	Takes a readable JSON data stream and calculates metrics. Calculated metrics are written to file.
	*
	* @param {stream} data - JSON data stream
	* @param {string} dir - file output directory
	* @param {string} prefix - filename prefix; e.g., 'my-favorite-timeseries-name'
	* @param {function} clbk - (optional) callback to invoke after writing all metric streams.
	*/
	function stream( data, dir, prefix, clbk ) {
		var metric, filename, write,
			numMetrics = METRICS.length, counter = 0;

		// Cycle through metrics and stream...
		for ( var i = 0; i < numMetrics; i++ ) {
		
			// Instantiate a metric instance:
			metric = new METRICS[ i ]();

			// Generate the output filename:
			filename = dir + '/' + prefix + '.' + metric.name + '.' + metric.type + '.json';

			// Create the write stream:
			write = writeStream( filename, onEnd );

			// Pipe the JSON data:
			data.pipe( metric.stream() )
				.pipe( stringify() )
				.pipe( write );

		} // end FOR i

		return;

		/**
		* FUNCTION: onEnd()
		*	Invoked when writing to file has finished.
		*/
		function onEnd() {
			if ( ++counter === numMetrics ) {
				if ( clbk ) {
					clbk();
				}
			}
		} // end FUNCTION onEnd()
	} // end FUNCTION stream()


	// EXPORTS //

	module.exports = stream;

})();