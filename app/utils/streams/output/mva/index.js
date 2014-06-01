/**
*
*	STREAM: mean-variance analysis (MVA)
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
*		- 2014/05/28: Created. [AReines].
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

	var // Path module:
		path = require( 'path' ),

		// Module to recursively remove directories and their contents:
		rimraf = require( 'rimraf' ),

		// Module to recursively create directories:
		mkdirp = require( 'mkdirp' ),

		// Flow streams:
		flow = require( 'flow.io' ),

		// MVA streams:
		mva = require( './streams.js' );


	// VARIABLES //

	var DEST = path.resolve( __dirname, '../../../../../public/data/mva' );


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
			console.log( name + ': ' + x + ' of ' + y + ' mva streams finished...' );
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
		var counter = 0, total = dirs.length, dir_path;
		for ( var i = 0; i < total; i++ ) {
			dir_path = path.join( DEST, dirs[ i ] );
			mkdirp( dir_path, onDir );
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
	*	Takes a directory hash and performs mean-variance analysis across all hash datasets.
	*
	* @param {string} path - source parent data directory
	* @param {object} index - directory hash
	* @param {function} clbk - (optional) callback to invoke after finishing all streams. Function should take one input argument: [ error ]. If no errors, error is null.
	*/
	function stream( dir_path, index, clbk ) {
		var dirs, files, total, file, filepath, data, counter = 0;

		// Get the directories:
		dirs = Object.keys( index );

		for ( var i = 0; i < dirs.length; i++ ) {

			// Get the directory files:
			files = index[ dirs[ i ] ];
			total = files.length;

			for ( var j = 0; j < total; j++ ) {

				// Get the file path:
				filepath = path.join( dir_path, dirs[ i ], files[ j ] );

				// Remove the extension from filename:
				file = files[ j ].substr( 0, files[ j ].length-5 );

				// Create the raw data readstream:
				data = flow.read( filepath )
					.pipe( flow.parse() );

				// Send the data off to perform analysis:
				mva( data, path.join( DEST, dirs[ i ] ), file, onEnd( dirs[ i ], j+1, total, done ) );

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