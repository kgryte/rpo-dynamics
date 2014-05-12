/**
*
*	STREAM: write
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
	* FUNCTION: getWriter( dest, name )
	*	Returns a writable stream which outputs to a provided destination.
	*
	* @param {string} dest - output destination
	* @param {string} name - (optional) stream name
	* @returns {object} writable stream
	*/
	function getWriter( dest, name ) {
		if ( !arguments.length ) {
			throw new Error( 'getWriter()::insufficient input arguments. Must provide an output file destination.' );
		}
		var stream = fs.createWriteStream( dest );
		stream.on( 'error', function onError( error ) {
			var err = {
					'status': 500,
					'message': 'internal server error. Error encountered while attempting to write data.',
					'error': error
				};
			console.error( error.stack );
			if ( name ) {
				throw new Error( name + '::' + err.message );
			}
		});
		stream.on( 'finish', function onEnd() {
			if ( name ) {
				console.log( name + '::writable stream is finished...' );
			}
		});
		return stream;
	} // end FUNCTION getWriter()


	// EXPORTS //

	module.exports = getWriter;

})();