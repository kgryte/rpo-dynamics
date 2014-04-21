/**
*
*	MODULE: routes
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

	var // Path module:
		path = require( 'path' ),

		// Filesystem module:
		fs = require( 'fs' ),

		// Directory model:
		model = require( './model.json' ),

		// Directory mapper:
		Mapper = require( __dirname + '/../../utils/dirMapper.js' );


	// VARIABLES //

	var DATA = [],
		MAPPING = {};


	// FUNCTIONS //

	/**
	* FUNCTION: getDescription( request, response )
	*	HTTP GET request handler.
	*
	* @param {object} request - HTTP request object
	* @param {object} response - HTTP respone object
	*/
	function getDescription( request, response ) {
		var key = request.path.split( '/' )[ 2 ];
		response.send( MAPPING[ key ] );
	} // end FUNCTION getDescription()

	/**
	* FUNCTION: getFigures( request, response )
	*	HTTP GET request handler.
	*
	* @param {object} request - HTTP request object
	* @param {object} response - HTTP respone object
	*/
	function getFigures( request, response ) {
		response.send( 'Figures' );
	} // end FUNCTION getFigures()


	// INIT //

	(function() {

		var mapper, _model,
			files, stats, path;

		// Format the model appropriate for mapping:
		_model = model.map( function ( element ) {
			return element.options;
		});

		// Create a new directory mapper:
		mapper = new Mapper( _model );

		// Get the "file" names:
		files = fs.readdirSync( __dirname );

		// For each possible file, determine if it is a directory...
		for ( var i = 0; i < files.length; i++ ) {

			if ( files[ i ][ 0 ] !== '.' ) {

				// Assemble the path:
				path = __dirname + '/' + files[ i ];

				// Get the file stats:
				stats = fs.statSync( path );

				// Is the "file" actually a directory?
				if ( stats.isDirectory() ) {

					// Store the directory name:
					DATA.push( files[ i ] );

					// Update our mapping dictionary:
					MAPPING[ files[ i ] ] = mapper.getMap( files[ i ] );

				} // end IF directory

			} // end IF !hidden directory

		} // end FOR i

	})();


	// ROUTES //

	var routes = function ( clbk ) {

		var base = path.basename( __dirname );

		// NOTE: the 'this' context is the application.

		// Data conditions:
		this.get( '/' + base + '/conditions', function onRequest( request, response ) {

			response.writeHead( 200, {
				'Content-Type': 'application/json'
			});

			response.write( JSON.stringify( MAPPING ) );
			response.end();

		});

		// Data conditions (model):
		this.get( '/' + base + '/conditions/model', function onRequest( request, response ) {

			response.writeHead( 200, {
				'Content-Type': 'application/json'
			});

			response.write( JSON.stringify( model ) );
			response.end();

		});

		// Add routes for each dataset:
		for ( var i = 0; i < DATA.length; i++ ) {

			// Base route returns a description:
			this.get( '/' + base + '/' + DATA[ i ], getDescription );

			// Figures route returns figures:
			this.get( '/' + base + '/' + DATA[ i ] + '/figures', getFigures );

		} // end FOR i

		// Callback:
		clbk();

	};


	// EXPORTS //

	module.exports = routes;

})();