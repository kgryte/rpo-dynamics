/**
*
*	DATA: index
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


	// INDEX //

	/**
	* FUNCTION: Index()
	*	Index constructor.
	*
	* @returns {object} index instance
	*/
	function Index() {
		return this;
	} // and FUNCTION Index()

	/**
	* METHOD: list()
	*	Lists available directory indices.
	*
	* @returns {array} list of directory indices
	*/
	Index.prototype.list = function() {
		var list = [], dirs, dir_path, stats;

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

					// Add the directory to our list:
					list.push( dirs[ i ] );

				} // end IF directory

			} // end IF !hidden directory

		} // end FOR i

		return list;
	}; // end METHOD list()

	/**
	* METHOD: get( name )
	*	Assembles an index of all data files, hashed by parent directory.
	*
	* @param {string} name - top-level directory in which to look for datasets and subsequent data files.
	* @returns {object} data file hash
	*/
	Index.prototype.get = function( name ) {
		var index = {}, parent_path, dirs, dir_path, stats, files;

		// Assemble the parent data directory path:
		parent_path = path.join( __dirname, name );

		// Get the directory names:
		dirs = fs.readdirSync( parent_path );

		for ( var i = 0; i < dirs.length; i++ ) {

			if ( dirs[ i ][ 0 ] !== '.' ) {

				// Assemble the path:
				dir_path = path.join( parent_path, dirs[ i ] );

				// Get the file/directory stats:
				stats = fs.statSync( dir_path );

				// Is the "directory" actually a directory?
				if ( stats.isDirectory() ) {

					// Get the file names within the directory, filtering for *.json files:
					files = fs.readdirSync( dir_path )
						.filter( filter );

					// Sort the filenames:
					files.sort( sort );

					// Store the directory and the associated data filenames in a hash:
					index[ dirs[ i ] ] = files;

				} // end IF directory

			} // end IF !hidden directory

		} // end FOR i

		return index;
	}; // end METHOD get()


	// EXPORTS //

	module.exports = new Index();

})();