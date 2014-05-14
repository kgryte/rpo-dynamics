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
		fs = require( 'fs' );


	// VARIABLES //

	var PATH = __dirname + '/../public/data/raw',
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
	* FUNCTION: createIndex()
	*
	*/
	function createIndex() {
		var dirs, files, stats, path;

		// Get the directory names:
		dirs = fs.readdirSync( PATH );

		// For each possible directory, determine if it is a directory...
		for ( var i = 0; i < dirs.length; i++ ) {

			if ( dirs[ i ][ 0 ] !== '.' ) {

				// Assemble the path:
				path = PATH + '/' + dirs[ i ];

				// Get the file/directory stats:
				stats = fs.statSync( path );

				// Is the "directory" actually a directory?
				if ( stats.isDirectory() ) {

					// Get the file names within the directory, filtering for *.json files:
					files = fs.readdirSync( path )
						.filter( filter );

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
		var path, dirs, dir_path, stats;

		// Get the path:
		path = __dirname + '/../app/utils/streams';

		// Get the directory names:
		dirs = fs.readdirSync( path );

		// For each possible directory, determine if it is a directory...
		for ( var i = 0; i < dirs.length; i++ ) {

			if ( dirs[ i ][ 0 ] !== '.' ) {

				// Assemble the path:
				dir_path = path + '/' + dirs[ i ];

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
	* @param {function} clbk - callback to invoke when all build steps are complete
	* @returns {function} callback to invoke on end
	*/
	function onEnd( name, x, y, timer, clbk ) {
		return function onEnd() {
			console.log( name + ': finished. ' + x + ' of ' + y + ' build steps complete...' );
			console.log( 'Time Elapsed: ' + timer.split( name ) + ' seconds...' );
			if ( x === y ) {
				clbk();
			}
		};
	} // end FUNCTION onEnd()

	/**
	* FUNCTION: Timer()
	*	Constructor.
	*/
	function Timer() {
		this._start = null;
		this._end = null;
		this._splits = {};
		return this;
	} // end FUNCTION timer()

	/**
	* METHOD: start()
	*	Starts the timer.
	*
	* @returns {number} start time in milliseconds
	*/
	Timer.prototype.start = function() {
		this._start = Date.now();
		return this._start;
	}; // end METHOD start()

	/**
	* METHOD: split( id )
	*	Returns the time elapsed since instance instantiation.
	*
	* @param {string} id - split identifier; e.g., build step name
	* @returns {number} elapsed time in seconds
	*/
	Timer.prototype.split = function( id ) {
		var now = Date.now();
		this._splits[ id ] = ( now-this._start ) / 1000;
		return this._splits[ id ];
	}; // end METHOD split()

	/**
	* METHOD: splits()
	*	Returns split times.
	*
	* @returns {string} stringified object where split times are in seconds.
	*/
	Timer.prototype.splits = function() {
		return JSON.stringify( this._splits );
	}; // end METHOD splits()

	/**
	* METHOD: stop()
	*	Returns the time elapsed since instance instantiation.
	*
	* @returns {number} elapsed time in seconds
	*/
	Timer.prototype.stop = function() {
		this._end = Date.now();
		return this._end;
	}; // end METHOD stop()

	/**
	* METHOD: total()
	*	Returns the time elapsed since instance instantiation.
	*
	* @returns {number} elapsed time in seconds
	*/
	Timer.prototype.total = function() {
		return ( this._end-this._start ) / 1000;
	}; // end METHOD total()

	
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
			total = keys.length,
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
			console.log( 'Total: ' + stopwatch.total() + ' seconds...' );
			console.log( 'Splits: ' + stopwatch.splits() );
		} // end FUNCTION done()

	}; // end FUNCTION build()
	

	// RUN //

	build();

})();