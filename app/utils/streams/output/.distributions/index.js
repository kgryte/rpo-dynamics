/**
*
*	STREAM: distributions
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
*		- 2014/05/13: Created. [AReines].
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

	var // Module to recursively remove directories and their contents:
		rimraf = require( 'rimraf' ),

		// Module to recursively create directories:
		mkdirp = require( 'mkdirp' ),

		// Read stream:
		readStream = require( './../../file/read.js' ),

		// JSON stream parser:
		parser = require( './../../json/parse.js' ),

		// Distribution streams:
		distributions = require( './streams.js' );


	// VARIABLES //

	var DEST = __dirname + '/../../../../../public/data/distributions';


	// FUNCTIONS //

	/**
	* FUNCTION: onEnd( name, x, y, clbk )
	*	Returns a function to indicate progress.
	*
	* @param {string} name - indicator namespace
	* @param {number} x - current iteration
	* @param {number} y - total iterations
	* @param {function} clbk - callback to invoke once all streams have finished
	* @returns {function} callback to invoke on stream end
	*/
	function onEnd( name, x, y, clbk ) {
		return function onEnd() {
			console.log( name + ': ' + x + ' of ' + y + ' distribution streams finished...' );
			if ( x === y ) {
				clbk();
			}
		};
	} // end FUNCTION onEnd()

	/**
	* FUNCTION: mkdir( dirs, clbk )
	*
	*/
	function mkdir( dirs, clbk ) {
		var counter = 0, total = dirs.length;
		for ( var i = 0; i < total; i++ ) {
			mkdirp( DEST + '/' + dirs[ i ], onDir );
		} // end FOR i
		return;

		/**
		* FUNCTION: onDir( error )
		*	Callback invoked upon directory creation.
		*
		* @param {object|undefined} error
		*/
		function onDir( error ) {
			if ( error ) {
				clbk({
					'status': 500,
					'message': 'mkdir()::unable to create directory.',
					'error': error
				});
				console.error( error.stack );
				return;
			}
			if ( ++counter === total ) {
				clbk();
			}
		} // end FUNCTION onDir()
	} // end FUNCTION mkdir()

	/**
	* FUNCTION: stream( path, index, clbk )
	*	Takes a directory hash and calculates transforms across all hash datasets. Calculations are performed according to transform functions.
	*
	* @param {string} path - source parent data directory
	* @param {object} index - directory hash
	* @param {function} clbk - (optional) callback to invoke after finishing all streams. Function should take one input argument: [ error ]. If no errors, error is null.
	*/
	function stream( path, index, clbk ) {
		var dirs, files, total, file, filepath, data, counter = 0;

		// Get the directories:
		dirs = Object.keys( index );

		for ( var i = 0; i < dirs.length; i++ ) {

			// Get the directory files:
			files = index[ dirs[ i ] ];
			total = files.length;

			for ( var j = 0; j < total; j++ ) {

				// Get the file path:
				filepath = path + '/' + dirs[ i ] + '/' + files[ j ];

				// Remove the extension from filename:
				file = files[ j ].substr( 0, files[ j ].length-5 );

				// Create the raw data readstream:
				data = readStream( filepath )
					.pipe( parser() );

				// Send the data off to calculate transforms:
				distributions( data, DEST+'/'+dirs[ i ], file, onEnd( dirs[ i ], j+1, total, done ) );

			} // end FOR j

		} // end FOR i

		return;

		/**
		* FUNCTION: done()
		*
		*/
		function done() {
			if ( ++counter === dirs.length ) {
				clbk();
			}
		} // end FUNCTION done()

	} // end FUNCTION stream()


	// RUN //

	/**
	* FUNCTION: run( path, index, clbk )
	*	
	*
	* @param {string} path - source parent data directory
	* @param {object} index - directory hash
	* @param {function} clbk - (optional) callback to invoke after finishing all streams. Function should take one input argument: [ error ]. If no errors, error is null.
	*/
	function run( path, index, clbk ) {

		// Remove any previous data in the output directories:
		rimraf( DEST, onRemove );

		return;
		
		/**
		* FUNCTION: onRemove()
		*
		*/
		function onRemove() {
			// Make output data directories:
			mkdir( Object.keys( index ), onMake );
		}

		/**
		* FUNCTION: onMake( error )
		*
		*/
		function onMake( error ) {
			if ( error ) {
				clbk( error );
				return;
			}
			stream( path, index, onFinish );
		}

		/**
		* FUNCTION: onFinish()
		*
		*/
		function onFinish() {
			clbk();
		}

	} // end FUNCTION run()


	// EXPORTS //

	module.exports = run;

})();