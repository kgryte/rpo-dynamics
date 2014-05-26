/**
*
*	DATA: raw
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

	var INDEX = {};


	// FUNCTIONS //

	/**
	* FUNCTION: filter( file )
	*
	*/
	function filter( file ) {
		return file.substr( -5 ) === '.json';
	} // end FUNCTION filter()

	/**
	* FUNCTION: sort( a, b )
	*
	*/
	function sort( a, b ) {
		var val1, val2;
		val1 = parseInt( a.substr( 0, a.length-5 ), 10 );
		val2 = parseInt( b.substr( 0, b.length-5 ), 10 );
		return val1 - val2;
	} // end FUNCTION sort()


	// INIT //

	(function init() {
		var dirs, files, stats, dir_path;

		// Get the directory names:
		dirs = fs.readdirSync( __dirname );

		for ( var i = 0; i < dirs.length; i++ ) {

			if ( dirs[ i ][ 0 ] !== '.' ) {

				// Assemble the path:
				dir_path = path.join( __dirname, dirs[ i ] );

				// Get the file/directory stats:
				stats = fs.statSync( dir_path );

				// Is the "directory" actually a directory?
				if ( stats.isDirectory() ) {

					// Get the file names within the directory, filtering for *.json files:
					files = fs.readdirSync( dir_path )
						.filter( filter );

					// Sort the filenames:
					files.sort( sort );

					// Store the directory and the associated data files in a hash:
					INDEX[ dirs[ i ] ] = files;

				} // end IF directory

			} // end IF !hidden directory

		} // end FOR i
	})();


	// EXPORTS //

	module.exports = INDEX;

})();