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
	* FUNCTION: onData( DATA, key, total, errFLG, clbk )
	*
	*/
	function onData( DATA, key, total, errFLG, clbk ) {
			
		return function onData( error, data ) {
			if ( errFLG ) {
				return;
			}
			if ( error ) {
				errFLG = true;
				clbk({
					'status': 500,
					'message': 'ERROR:internal server error. Unable to load data file. '
				});
				throw new Error( 'data()::unable to load data file: ' + error );
			}

			// Insert the data into our DATA object:
			DATA[ key ] = data;

			if ( Object.keys( DATA ).length === total ) {
				clbk( null, DATA );
			}

		}; // end FUNCTION onData()

	} // end FUNCTION onData()


	// INIT //

	(function() {

		var files, stats, path,
			base = __dirname + '/../../public/data' ;

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
	* FUNCTION: data( id, clbk )
	*
	*/
	var data = function( id, clbk ) {

		var files, total, path, errFLG = false,

			DATA = {}, key;

		// Get the path for the provided id:
		path = INDEX[ id ];

		if ( !path ) {
			throw new Error( 'data()::dataset does not exist. ID not found in directory list.' );
		}

		// Get the file names:
		files = fs.readdirSync( path )
			.filter( function ( file ) {
				return file.substr( -5 ) === '.json';
			});

		total = files.length;

		// For each data file, get its content...
		for ( var i = 0; i < files.length; i++ ) {

			// Get the name of the file:
			key = files[ i ].slice( 0, files[ i ].length - 5 );

			// Get the data:
			fs.readFile( path + '/' + files[ i ], 'utf8', onData( DATA, key, total, errFLG, clbk ) );

		} // end FOR i

		return;

	}; // end DATA


	// EXPORTS //

	module.exports = data;

})();