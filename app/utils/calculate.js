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

		// Module to stream JSON objects:
		JSONStream = require( 'JSONStream' ),

		// Module allowing for event data transformation:
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
		var write1 = fs.createWriteStream( dest + '00000010/1a.json' );

		write1.on( 'error', function onError( error ) {
			console.error( error );
		});

		write1.on( 'finish', function onEnd() {
			console.log( 'write 1 is done' );
		});

		fs.createReadStream( path + '/00000010/1.json' )
			.pipe( parser )
			.pipe( eventStream.map( function onData( data, callback ) {
				var dat = [ data.x, data.y[ 1 ] / ( data.y[ 0 ] + data.y[ 1 ] ) ];
				callback( null, dat );
			}))
			.pipe( stringify )
			.pipe( write1 );

	}; // end FUNCTION calculate()

	function nextCalc() {
		var write2 = fs.createWriteStream( dest + '00000010/1b.json' );

		write2.on( 'error', function onError( error ) {
			console.error( error );
		});

		write2.on( 'finish', function onEnd() {
			console.log( 'write 2 is done' );
		});

		fs.createReadStream( path + '/00000010/1.json' )
			.pipe( parser )
			.pipe( eventStream.mapSync( function onData( data ) {
				return [ data.x, data.y[ 0 ] ];
			}))
			.pipe( stringify )
			.pipe( write2 );
	}

	
	// EXPORTS //

	module.exports = calculate;

})();