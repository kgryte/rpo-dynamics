/**
*
*	UTILS: data
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
*		- 2014/04/22: Created. [AReines].
*
*
*	DEPENDENCIES:
*		[1] 
*
*
*	LICENSE:
*		
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
		fs = require( 'fs' );


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


	// INIT //

	(function() {

		var files, stats, path,
			base = __dirname + '/../../public/data/raw' ;

		// Get the "file" names:
		files = fs.readdirSync( base );

		// For each possible file, determine if it is a directory...
		for ( var i = 0; i < files.length; i++ ) {

			if ( files[ i ][ 0 ] !== '.' ) {

				// Assemble the path:
				path = base + '/' + files[ i ];

				// Get the file stats:
				stats = fs.statSync( path );

				// Is the "file" actually a directory?
				if ( stats.isDirectory() ) {

					// Store the directory name and its path:
					INDEX[ files[ i ] ] = path;

				} // end IF directory

			} // end IF !hidden directory

		} // end FOR i

	})();


	// DATA //

	/**
	* FUNCTION: data( ids, clbk )
	*
	*/
	var data = function( ids, clbk ) {

		var files, total, path, DATA = {}, id, data, key, idx;

		for ( var i = 0; i < ids.length; i++ ) {

			id = ids[ i ];

			// Get the path for the provided id:
			path = INDEX[ id ];

			if ( !path ) {
				clbk({
					'status': 404,
					'message': 'ERROR:dataset does not exist. ID not found in directory list.'
				});
				return;
			}

			// Get the file names:
			files = fs.readdirSync( path )
				.filter( filter );

			total = files.length;

			// Initialize a new data array:
			DATA[ id ] = new Array( total );

			// For each data file, get its content...
			for ( var j = 0; j < files.length; j++ ) {

				// Get the name of the file:
				key = files[ j ].slice( 0, files[ j ].length - 5 );

				// Determine the index: (NOTE: we assume the files have numeric names and are number sequentially, beginning with 1.)
				idx = parseInt( key, 10 ) - 1;

				// Get the data:
				data = fs.readFileSync( path + '/' + files[ j ], 'utf8' );

				// Parse the data:
				DATA[ id ][ idx ] = JSON.parse( data );

			} // end FOR j

		} // end FOR i

		clbk( null, DATA );

		return;

	}; // end DATA


	// EXPORTS //

	module.exports = data;

})();