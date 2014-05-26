/**
*
*	UTILS: queue
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
*		[1] http://krasimirtsonev.com/blog/article/7-lines-JavaScript-library-for-calling-asynchronous-functions
*
*
*	TODO:
*		[1] 
*
*
*	HISTORY:
*		- 2014/05/26: Created. [AReines].
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

	// QUEUE //

	/**
	* FUNCTION: queue( funcs, scope )
	*	Takes an array of functions and serializes their execution. Each function should took a callback as its last argument.
	*
	* @param {array} funcs - array of functions to be executed serially
	* @param {object} scope - the function scope; default: {}
	*
	*/
	var queue = function( funcs, scope ) {
		var args;
		(function next() {
			if ( funcs.length > 0 ) {
				args = Array.prototype.slice.call( arguments, 0 );
				funcs.shift().apply( scope || {}, args.concat( [ next ] ) );
			}
		})();
	};

	// EXPORTS //

	module.exports = queue;

})();