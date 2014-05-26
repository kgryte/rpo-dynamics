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

	var // Filesystem module:
		fs = require( 'fs' ),

		// Path module:
		path = require( 'path' );


	// VARIABLES //

	var STREAMS = {};


	// INIT //

	(function init() {
		var dirs, dir_path, stats;

		// Get the directory names:
		dirs = fs.readdirSync( __dirname );

		// For each possible directory, determine if it is a directory...
		for ( var i = 0; i < dirs.length; i++ ) {

			if ( dirs[ i ][ 0 ] !== '.' ) {

				// Assemble the path:
				dir_path = path.join( __dirname, dirs[ i ] );

				// Get the file/directory stats:
				stats = fs.statSync( dir_path );

				// Is the "directory" actually a directory?
				if ( stats.isDirectory() ) {

					// Get the stream generator:
					STREAMS[ dirs[ i ] ] = require( dir_path );

				} // end IF directory

			} // end IF !hidden directory

		} // end FOR i
	})();


	// EXPORTS //

	module.exports = STREAMS;

})();