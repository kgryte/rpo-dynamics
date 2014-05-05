/**
*
*	UTILS: calculate
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
*		- 2014/05/03: Created. [AReines].
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

		//
		JSONStream = require( 'JSONStream' ),

		// 
		eventStream = require( 'event-stream' );


	// VARIABLES //

	var path = __dirname + '/../../public/data/raw',
		dest = __dirname + '/../../public/data/metrics/';


	// STREAMS //

	var parser = JSONStream.parse( '*' );
	
	parser.on( 'error', function onError( error ) {
		console.error( error );
	});

	var stringify = JSONStream.stringify( '[\n\t', ',\n\t', '\n]\n' );

	// CALCULATE //

	var calculate = function() {
		var write = fs.createWriteStream( dest + '00000010/1.json' );

		write.on( 'error', function onError( error ) {
			console.error( error );
		});

		fs.createReadStream( path + '/00000010/1.json' )
			.pipe( parser )
			.pipe( eventStream.mapSync( function onData( data ) {
				return [ data.x, data.y[ 1 ] / ( data.y[ 0 ] + data.y[ 1 ] ) ];
			}))
			.pipe( stringify )
			.pipe( write );
	}; // end FUNCTION calculate()

	
	// EXPORTS //

	module.exports = calculate;

})();