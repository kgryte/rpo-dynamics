/**
*
*	APP: routes
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
*		- 2014/04/21: Created. [AReines].
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

		// Directory encoding model:
		model = require( __dirname + '/../public/data/encoding.json' ),

		// Directory mapper:
		Mapper = require( __dirname + '/utils/dirMapper.js' );


	// VARIABLES //

	var MAPPING = {};


	// INIT //

	(function() {

		var mapper, _model,
			files, stats, path,
			base = __dirname + '/../public/data' ;

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
				path = base + '/' + files[ i ];

				// Get the file stats:
				stats = fs.statSync( path );

				// Is the "file" actually a directory?
				if ( stats.isDirectory() ) {

					// Update our mapping dictionary:
					MAPPING[ files[ i ] ] = mapper.getMap( files[ i ] );

				} // end IF directory

			} // end IF !hidden directory

		} // end FOR i

	})();


	// ROUTES //

	var routes = function ( clbk ) {

		// NOTE: the 'this' context is the application.

		// Conditions:
		this.get( '/conditions', function onRequest( request, response ) {

			response.writeHead( 200, {
				'Content-Type': 'application/json'
			});

			response.write( JSON.stringify( MAPPING ) );
			response.end();

		});

		// Base route returns a description:
		this.get( '/conditions/:condition', function onRequest( request, response ) {

			var condition = request.params.condition;

			response.writeHead( 200, {
				'Content-Type': 'text/plain'
			});

			response.write( MAPPING[ condition ] );
			response.end();

		});

		// Conditions encoding:
		this.get( '/encoding', function onRequest( request, response ) {

			response.writeHead( 200, {
				'Content-Type': 'application/json'
			});

			response.write( JSON.stringify( model ) );
			response.end();

		});

		// Callback:
		clbk();

	}; // end ROUTES


	// EXPORTS //

	module.exports = routes;

})();