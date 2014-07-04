/**
*
*	STREAM: summary
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
*		- 2014/05/17: Created. [AReines].
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

	var // Drop-in replacement for filesystem module:
		fs = require( './../../../graceful-fs' ),

		// Path module:
		path = require( 'path' ),

		// Module to recursively remove directories and their contents:
		rimraf = require( 'rimraf' ),

		// Module to recursively create directories:
		mkdirp = require( 'mkdirp' ),

		// Summary streams:
		streams = require( './streams.js' );


	// VARIABLES //

	var DEST = path.resolve( __dirname, '../../../../../public/data/summary' );


	// FUNCTIONS //

	/**
	* FUNCTION: onEnd( name, x, y, clbk )
	*	Returns a function to indicate progress.
	*
	* @param {string} name - indicator namespace
	* @param {number} x - current iteration
	* @param {number} y - total iterations
	* @param {function} clbk - callback
	* @returns {function} callback to invoke on stream end
	*/
	function onEnd( name, x, y, clbk ) {
		return function onEnd() {
			console.log( name + ': ' + x + ' of ' + y + ' summary streams finished...' );
			clbk();
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
	*	Takes a directory hash and calculates transforms across all hash datasets. Calculations are performed according to transform functions.
	*
	* @param {string} path - source parent data directory
	* @param {object} index - directory hash
	* @param {function} clbk - (optional) callback to invoke after finishing all streams. Function should take one input argument: [ error ]. If no errors, error is null.
	*/
	function stream( dirpath, index, clbk ) {
		var dirs, numDirs,
			files, numFiles,
			filepath,
			onRead, onFinish,
			counter = 0;

		// Get the directories:
		dirs = Object.keys( index );
		numDirs = dirs.length;

		for ( var i = 0; i < numDirs; i++ ) {

			// Get the directory files:
			files = index[ dirs[ i ] ];
			numFiles = files.length;

			onFinish = onEnd( dirs[ i ], i+1, numDirs, done );
			onRead = onData( path.join( DEST, dirs[ i ] ), numFiles, onFinish );

			for ( var j = 0; j < numFiles; j++ ) {

				// Get the file path:
				filepath = path.join( dirpath, dirs[ i ], files[ j ] );

				// Load the data file:
				fs.readFile( filepath, 'utf8', onRead( j ) );

			} // end FOR j

		} // end FOR i

		return;

		/**
		* FUNCTION: onData( path, total, clbk )
		*	Wraps parameters in an enclosure and returns a functin to enclose a file index.
		*
		* @param {string} path - output directory path
		* @param {number} total - total file number
		* @param {function} clbk - callback to invoke after calculating summary statistics
		* @returns {function} function to enclose a file index
		*/
		function onData( path, total, clbk ) {
			var DATA = new Array( total ),
				counter = 0;
			/**
			* FUNCTION: onData( idx )
			*	Returns a callback invoked upon reading a data file. Enclosing the index ensures the output data array is the same order as the input files.
			*
			* @param {number} idx - file index
			* @returns {function} callback to invoke after reading a data file.
			*/
			return function onData( idx ) {
				/**
				* FUNCTION: onData()
				*	Callback to invoke after reading a data file.
				*
				* @param {object} error - error object
				* @param {string} data - data as a string
				*/
				return function onData( error, data ) {
					if ( error ) {
						console.error( error.stack );
						throw new Error( 'stream()::unable to read file.' );
					}
					// Append the data to our data buffer:
					DATA[ idx ] = JSON.parse( data );

					if ( ++counter === total ) {
						// Send off the data to calculate transforms:
						streams( DATA, path, clbk );
					}
				}; // end FUNCTION onData()
			}; // end FUNCTION onData()
		} // end FUNCTION onData()

		/**
		* FUNCTION: done()
		*
		*/
		function done() {
			if ( ++counter === numDirs ) {
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