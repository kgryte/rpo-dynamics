/**
*
*	UTILS: partials
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
		fs = require( 'fs' ),

		// Path module:
		path = require( 'path' );


	// PARTIALS //

	var partials = function( path ) {

		var files, partials = {}, file_path, partial, key;

		// Get the file names:
		files = fs.readdirSync( path )
			.filter( function ( file ) {
				return file.substr( -5 ) === '.html';
			});

		// For each partial, get its content...
		for ( var i = 0; i < files.length; i++ ) {

			// Get the name of the partial:
			key = files[ i ].slice( 0, files[ i ].length - 5 );

			// Get the file path:
			file_path = path.join( path, files[ i ] );

			// Get the partial:
			partial = fs.readFileSync( file_path, 'utf8' );

			// Insert the partial into our partials object:
			partials[ key ] = partial;

		} // end FOR i

		return partials;

	}; // end partials


	// EXPORTS //

	module.exports = partials;

})();