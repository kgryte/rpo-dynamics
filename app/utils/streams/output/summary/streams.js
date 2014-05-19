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

		// JSON stream transform:
		transformer = require( './../../json/transform.js' ),

		// Write-to-file stream:
		writeStream = require( './../../file/write.js' );


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

		var files, path;

		// Get the file names:
		files = fs.readdirSync( __dirname )
			.filter( filter );

		// Read in the stream generators...
		for ( var i = 0; i < files.length; i++ ) {

			if ( files[ i ][ 0 ] !== '.' ) {

				// Assemble the path:
				path = __dirname + '/' + files[ i ];

				// Include the file in our streams list:
				STREAMS.push( require( path ) );

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
			filename,
			total = STREAMS.length,
			counter = 0;

		// Cycle through each stream...
		for ( var i = 0; i < total; i++ ) {
		
			// Instantiate a stream instance and configure:
			transform = new STREAMS[ i ]();

			// Generate the output filename:
			filename = dir + '/' + transform.name + '.' + transform.type + '.json';

			// Create the write stream:
			write = writeStream( filename, onEnd );

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