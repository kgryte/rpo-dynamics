/**
*
*	STREAM: timeseries
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

	var // Filesystem module:
		fs = require( 'fs' ),

		// Path module:
		path = require( 'path' ),

		// Flow streams:
		flow = require( 'flow.io' ),

		// Hash of metric generators:
		METRICS = require( './../../metrics' ),

		// Timeseries transform:
		transform = require( './timeseries.js' );


	// VARIABLES //

	var STREAMS = [];


	// INIT //

	(function init() {
		var keys, name, metric, tStream;

		keys = Object.keys( METRICS );

		for ( var i = 0; i < keys.length; i++ ) {

			name = keys[ i ];

			// [0] Instantiate a new metric generator:
			metric = METRICS[ name ]();

			// [1] Instantiate a new timeseries transform stream generator:
			tStream = transform();

			// [2] Config the transform:
			tStream.metric( metric );

			// [3] Append to our streams list:
			STREAMS.push( tStream );

		} // end FOR i
		
	})();


	// STREAM //

	/**
	* FUNCTION: streams( dStream, dir, prefix, clbk )
	*	Takes a readable JSON data stream and calculates timeseries. Calculated timeseries are written to file.
	*
	* @param {stream} dStream - JSON data stream
	* @param {string} dir - file output directory
	* @param {string} prefix - filename prefix; e.g., 'my-favorite-timeseries-name'
	* @param {function} clbk - (optional) callback to invoke after writing all streams.
	*/
	function streams( dStream, dir, prefix, clbk ) {
		var transform, tStream, writeStream, stringify,
			filename, filepath,
			wStream, sStream,
			total = STREAMS.length, counter = 0;

		// Create a stream generators:
		writeStream = flow.write();
		stringify = flow.stringify();

		// Cycle through each stream...
		for ( var i = 0; i < total; i++ ) {

			transform = STREAMS[ i ];
		
			// Generate the output filename:
			filename = prefix + '.' + transform.name + '.' + transform.type + '.json';

			filepath = path.join( dir, filename );

			// Get the timeseries metric transform stream:
			tStream = transform.stream();

			// Create the stringifier:
			sStream = stringify.stream();

			// Create the write stream:
			wStream = writeStream.path( filepath )
				.stream( onEnd );

			// Pipe the JSON data:
			dStream.pipe( tStream )
				.pipe( sStream )
				.pipe( wStream );

		} // end FOR i

		return;

		/**
		* FUNCTION: onEnd()
		*	Invoked when writing to file has finished.
		*/
		function onEnd() {
			if ( ++counter === total ) {
				if ( clbk ) {
					clbk();
				}
			}
		} // end FUNCTION onEnd()
	} // end FUNCTION streams()


	// EXPORTS //

	module.exports = streams;

})();