#!/usr/bin/env node
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
*		- 2014/05/12: Made executable. [AReines].
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
*
*/

(function() {
	'use strict';

	// MODULES //

	var // Filesystem module:
		fs = require( 'fs' ),

		// Path module:
		path = require( 'path' ),

		// Timer module:
		Timer = require( './../app/utils/timer.js' );


	// VARIABLES //

	var PATH = path.resolve( __dirname, '../public/data/raw' ),
		INDEX = {},
		STREAMS = {};


	// FUNCTIONS //

	/**
	* FUNCTION: filter( file )
	*
	*/
	function filter( file ) {
		return file.substr( -5 ) === '.json';
	} // end FUNCTION filter()

	/**
	* FUNCTION: sort( a, b )
	*
	*/
	function sort( a, b ) {
		var val1, val2;
		val1 = parseInt( a.substr( 0, a.length-5 ), 10 );
		val2 = parseInt( b.substr( 0, b.length-5 ), 10 );
		return val1 - val2;
	} // end FUNCTION sort()

	/**
	* FUNCTION: createIndex()
	*
	*/
	function createIndex() {
		var dirs, files, stats, dir_path;

		// Get the directory names:
		dirs = fs.readdirSync( PATH );

		// For each possible directory, determine if it is a directory...
		for ( var i = 0; i < dirs.length; i++ ) {

			if ( dirs[ i ][ 0 ] !== '.' ) {

				// Assemble the path:
				dir_path = path.join( PATH, dirs[ i ] );

				// Get the file/directory stats:
				stats = fs.statSync( dir_path );

				// Is the "directory" actually a directory?
				if ( stats.isDirectory() ) {

					// Get the file names within the directory, filtering for *.json files:
					files = fs.readdirSync( dir_path )
						.filter( filter );

					// Sort the filenames:
					files.sort( sort );

					// Store the directory and the associated data files in a hash:
					INDEX[ dirs[ i ] ] = files;

				} // end IF directory

			} // end IF !hidden directory

		} // end FOR i
	} // end FUNCTION createIndex()

	/**
	* FUNCTION: getStreams()
	*
	*/
	function getStreams() {
		var output_path, dirs, dir_path, stats;

		// Get the path:
		output_path = path.resolve( __dirname, '../app/utils/streams/output' );

		// Get the directory names:
		dirs = fs.readdirSync( output_path );

		// For each possible directory, determine if it is a directory...
		for ( var i = 0; i < dirs.length; i++ ) {

			if ( dirs[ i ][ 0 ] !== '.' ) {

				// Assemble the path:
				dir_path = path.join( output_path, dirs[ i ] );

				// Get the file/directory stats:
				stats = fs.statSync( dir_path );

				// Is the "directory" actually a directory?
				if ( stats.isDirectory() ) {

					// Get the stream generator:
					STREAMS[ dirs[ i ] ] = require( dir_path );

				} // end IF directory

			} // end IF !hidden directory

		} // end FOR i
	} // end FUNCTION getStreams()

	/**
	* FUNCTION: onEnd( name, x, y, timer )
	*	Returns a function to indicate progress.
	*
	* @param {string} name - indicator namespace
	* @param {number} x - current iteration
	* @param {number} y - total iterations
	* @param {Timer} timer - Timer instance; used to clock build step duration
	* @param {function} clbk - callback
	* @returns {function} callback to invoke on end
	*/
	function onEnd( name, x, y, timer, clbk ) {
		return function onEnd() {
			console.log( name + ': finished. ' + x + ' of ' + y + ' build steps complete...' );
			console.log( 'Time Elapsed: ' + timer.split( name ) + ' seconds...' );
			clbk();
		};
	} // end FUNCTION onEnd()

	
	// INIT //

	(function init() {
		// [0] Create a data file hash:
		createIndex();
		// [1] Get the stream generators:
		getStreams();
	})();


	// BUILD //

	/**
	* FUNCTION: build()
	*
	*/
	var build = function() {
		var keys = Object.keys( STREAMS ),
			stream, clbk,
			counter = 0, total = keys.length,
			stopwatch;

		// Initialize a new timer:
		stopwatch = new Timer();
		stopwatch.start();

		// Cycle through the streams...
		for ( var i = 0; i < total; i++ ) {
			stream = STREAMS[ keys[ i ] ];
			clbk = onEnd( keys[ i ], i+1, total, stopwatch, done );
			stream( PATH, INDEX, clbk );
		}

		return;

		/**
		* FUNCTION: done()
		*	Outputs total build time and split times to the console.
		*/
		function done() {
			stopwatch.stop();
			if ( ++counter === total ) {
				console.log( 'Total: ' + stopwatch.total() + ' seconds...' );
				console.log( 'Splits: ' + stopwatch.splits() );
			}
		} // end FUNCTION done()

	}; // end FUNCTION build()
	

	// RUN //

	build();

})();