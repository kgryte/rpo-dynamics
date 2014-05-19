/**
*
*	UTILS: concat
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
*		- 2014/05/18: Created. [AReines].
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

	// CONCAT //

	/**
	* FUNCTION: concat( datasets )
	*	Performs an element-wise concatenation of a dataset array.
	*
	* @param {array} datasets - array of data arrays
	* @returns {array} 1d data array
	*/
	function concat( datasets ) {
		var data = [];
		for ( var i = 0; i < datasets.length; i++ ) {
			for ( var n = 0; n < datasets[ i ].length; n++ ) {
				data.push( datasets[ i ][ n ] );
			}
		}
		return data;
	} // end FUNCTION concat()

	// EXPORTS //

	module.exports = concat;

})();