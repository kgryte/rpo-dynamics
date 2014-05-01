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

	/**
	* FUNCTION: onData( DATA, idx, total, errFLG, clbk )
	*
	*/
	function onData( DATA, idx, total, clbk ) {
			
		return function onData( error, data ) {
			var numData;
			if ( error ) {
				clbk({
					'status': 500,
					'message': 'ERROR:internal server error. Unable to load data file.',
					'error': error
				});
				console.error( 'data()::unable to load data file: ', error.stack );
				return;
			}

			// Insert the data into our DATA array:
			DATA[ idx ] = JSON.parse( data );

			numData = Object.keys( DATA ).length;
			if ( numData === total ) {
				clbk( null );
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
	var data = function( ids, clbk ) {

		var files, total, path,

			DATA = {}, key, callback,

			numData = ids.length, counter = 0;

		for ( var i = 0; i < ids.length; i++ ) {

			// Get the path for the provided id:
			path = INDEX[ ids[ i ] ];

			if ( !path ) {
				clbk({
					'status': 404,
					'message': 'ERROR:dataset doest not exist. ID not found in directory list.'
				});
				return;
			}

			// Get the file names:
			files = fs.readdirSync( path )
				.filter( filter );

			total = files.length;

			// Initialize a new data array:
			DATA[ ids[ i ] ] = new Array( total );

			// For each data file, get its content...
			for ( var j = 0; j < files.length; j++ ) {

				// Get the name of the file:
				key = files[ j ].slice( 0, files[ j ].length - 5 );

				// Get the callback:
				callback = onData(
					DATA[ ids[ i ] ],
					parseInt( key, 10 ) - 1,
					total,
					onError
				);

				// Get the data:
				fs.readFile( path + '/' + files[ j ], 'utf8', callback );

			} // end FOR j

		} // end FOR i

		return;

		/**
		* FUNCTION: onError( error )
		*
		*/
		function onError( error ) {
			if ( error ) {
				clbk( error );
				return;
			}
			if ( ++counter === numData ) {
				clbk( null, DATA );
			}
		} // end FUNCTION onError()

	}; // end DATA


	// EXPORTS //

	module.exports = data;

})();