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
		response.send( 'Description' );
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

		var files, stats, path;

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

				} // end IF directory

			} // end IF !hidden directory

		} // end FOR i

	})();


	// ROUTES //

	var routes = function ( clbk ) {

		var base = path.basename( __dirname );

		// NOTE: the 'this' context is the application.

		//
		this.get( '/' + base, function onRequest( request, response ) {

			response.send( 'Hello' );

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