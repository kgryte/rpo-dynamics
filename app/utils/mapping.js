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

	var // Directory encoding model:
		encoder = require( './../../public/data/encoding.json' ),

		// Directory mapper:
		Mapper = require( './dirMapper.js' ),

		// Index of raw datasets:
		INDEX = require( './../../public/data' ).get( 'raw' );


	// VARIABLES //

	var MAPPING = {};


	// INIT //

	(function buildMapping() {

		var model, mapper, keys;

		// Format the model appropriate for mapping:
		model = encoder.map( function ( element ) {
			return element.options.map( function ( option ) {
				return option.abbr;
			});
		});

		// Create a new directory mapper:
		mapper = new Mapper( model );

		// Get the index keys, where each key is an encoded condition:
		keys = Object.keys( INDEX );

		// Map each key to its decoding...
		for ( var i = 0; i < keys.length; i++ ) {
			// Update our mapping dictionary:
			MAPPING[ keys[ i ] ] = mapper.getMap( keys[ i ] );
		} // end FOR i

	})();


	// EXPORTS //

	module.exports = MAPPING;

})();