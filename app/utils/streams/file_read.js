/**
*
*	STREAM: read
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
*		- 2014/05/11: Created. [AReines].
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

	var // Drop-in replacement for filesystem module:
		fs = require( './../graceful-fs' );
		

	// STREAM //

	/**
	* FUNCTION: getReader( path )
	*	Returns a readable stream which reads from a file.
	*
	* @param {string} path - file path
	* @returns {stream} readable stream
	*/
	function getReader( path ) {
		if ( !arguments.length ) {
			throw new Error( 'getReader()::insufficient input arguments. Must provide an input file path.' );
		}
		var stream = fs.createReadStream( path );
		stream.on( 'error', function onError( error ) {
			var err = {
					'status': 500,
					'message': 'internal server error. Error encountered while attempting to read data.',
					'error': error
				};
			console.error( error.stack );
		});
		return stream;
	} // end FUNCTION getReader()


	// EXPORTS //

	module.exports = getReader;

})();