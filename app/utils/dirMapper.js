/**
*
*	DIRMAPPER
*
*
*
*	DESCRIPTION:
*		- Map a set of conditions to a unique key and perform the inverse function.
*
*
*	API:
*		- Mapper( model )
*		- getKey( map )
*		- getMap( key )
*		- test( map, key )
*
*
*	NOTES:
*		[1] Model should be an array of arrays, where each nested array is an array of strings.
*		[2] Maps should be space delimited strings.
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

	// MAPPER //

	/**
	* FUNCTION: Mapper( model )
	*	
	*
	* @param {array} model - array of arrays; where each nested array is an array of strings
	* @returns {object} Mapper instance
	*/
	var Mapper = function( model ) {

		// Lowercase everything in the model:
		for ( var i = 0; i < model.length; i++ ) {
			for ( var j = 0; j < model[ i ].length; j++ ) {
				model[ i ][ j ] = model[ i ][ j ].toLowerCase();
			}
		}

		this._model = model;

		return this;

	}; // end MAPPER

	// METHODS //

	/**
	* METHOD: getKey( map )
	*	Convert a map to its corresponding key.
	*
	* @param {string} map - map to be converted
	* @returns {string} coresponding key
	*/
	Mapper.prototype.getKey = function( map ) {

		var parts, idx, key = '';

		// Lowercase the map:
		map = map.toLowerCase();

		// Split the input map using whitespace as the delimiter:
		parts = map.split( ' ' );

		// CHECK!!!
		if ( parts.length !== this._model.length ) {
			throw new Error( 'getKey()::incompatible map. Ensure that the map corresponds to the instance model.' );
		}

		// For each condition, get the mapping:
		for ( var i = 0; i < parts.length; i++ ) {

			idx = this._model.indexOf( parts[ i ] );

			if ( id === -1 ) {
				console.warn( 'WARNING:unable to find ' + parts[ i ] + ' in the model. Defaulting to _.' );
				idx = '_';
			}

			key += idx;

		} // end FOR i

		return key;

	}; // end METHOD getKey()

	/**
	* FUNCTION: getMap( key )
	*	Convert a key to its corresponding map.
	* 
	* @param {string} key - key to be converted to its corresponding map
	* @returns {string} corresponding map
	*/
	Mapper.prototype.getMap = function( key ) {

		var map = '';
		
		for ( var i = 0; i < key.length; i++ ) {

			map += this._model[ i ][ key[ i ] ];

			if ( i < key.length-1 ) {
				map += ' ';
			}

		} // end FOR i

		return map;

	}; // end METHOD getMap()

	/**
	* FUNCTION: test( map, key )
	*	Tests the equivalence of a map and a key.
	*
	* @param {string} map - map to be tested
	* @param {string} key - key to be tested
	* @returns {boolean} test result; true if map and key are equivalent; false if map and key are not equivalent.
	*/
	Mapper.prototype.test = function( map, key ) {

		var _key;
		
		// Get the key:
		_key = this.getKey( map );

		// Return the test result as a boolean:
		return ( _key === key );

	}; // end METHOD test()


	// EXPORTS //

	module.exports = Mapper;

})();