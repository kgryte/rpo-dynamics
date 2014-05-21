/**
*
*	UTILS: MAPPING
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
*		- 2014/04/30: Created. [AReines].
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

(function(){
	'use strict';


	// MODULES //

	var // Filesystem module:
		fs = require( 'fs' ),

		// Path module:
		path = require( 'path' ),

		// Directory encoding model:
		model = require( './../../public/data/encoding.json' ),

		// Directory mapper:
		Mapper = require( './dirMapper.js' );


	// VARIABLES //

	var MAPPING = {};


	// INIT //

	(function buildMapping() {

		var mapper, _model,
			files, stats, dir_path,
			base = path.resolve( __dirname, '/../../public/data/raw' );

		// Format the model appropriate for mapping:
		_model = model.map( function ( element ) {
			return element.options.map( function ( option ) {
				return option.abbr;
			});
		});

		// Create a new directory mapper:
		mapper = new Mapper( _model );

		// Get the "file" names:
		files = fs.readdirSync( base );

		// For each possible file, determine if it is a directory...
		for ( var i = 0; i < files.length; i++ ) {

			if ( files[ i ][ 0 ] !== '.' ) {

				// Assemble the path:
				dir_path = path.join( base, files[ i ] );

				// Get the file stats:
				stats = fs.statSync( dir_path );

				// Is the "file" actually a directory?
				if ( stats.isDirectory() ) {

					// Update our mapping dictionary:
					MAPPING[ files[ i ] ] = mapper.getMap( files[ i ] );

				} // end IF directory

			} // end IF !hidden directory

		} // end FOR i

	})();


	// EXPORTS //

	module.exports = MAPPING;

})();