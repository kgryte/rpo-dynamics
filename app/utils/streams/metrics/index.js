/**
*
*	METRICS
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
*		- 2014/05/20: Created. [AReines].
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
*/

(function() {
	'use strict';

	// MODULES //

	var // Filesystem module:
		fs = require( 'fs' ),

		// Path module:
		path = require( 'path' );


	// VARIABLES //

	var METRICS = {};


	// FUNCTIONS //

	/**
	* FUNCTION: filter( file )
	*	Filters a directory for JavaScript files which are not index.js.
	*
	* @param {string} file - filename
	* @returns {boolean} true/false as to whether the filename matches the criteria.
	*/
	function filter( file ) {
		return file.substr( -3 ) === '.js' && file !== 'index.js';
	} // FUNCTION filter()


	// METRICS //

	(function init() {
		var files, filepath, name, metric;

		files = fs.readdirSync( __dirname )
			.filter( filter );

		for ( var i = 0; i < files.length; i++ ) {

			if ( files[ i ][ 0 ] !== '.' ) {

				filepath = path.join( __dirname, files[ i ] );
				metric = require( filepath );
				name = files[ i ].substr( 0, files[ i ].length-3 );
				METRICS[ name ] = metric;

			} // end IF (!hidden)

		} // end FOR i

	})();


	// EXPORTS //

	module.exports = METRICS;

})();