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

	var // Drop-in replacement for filesystem module:
		fs = require( './../app/utils/graceful-fs' ),

		// Module to recursively remove directories and their contents:
		rimraf = require( 'rimraf' ),

		// Read stream:
		readStream = require( './../app/utils/streams/file_read.js' ),

		// JSON stream parser:
		parser = require( './../app/utils/streams/json_parse.js' ),

		// Metric streams:
		metrics = require( './../app/utils/streams/metrics' ),

		// Stats streams:
		stats = require( './../app/utils/streams/stats' );


	// VARIABLES //

	var BASE = __dirname + '/../public/data',
		PATH = BASE + '/raw',
		DEST = {
			'metrics': BASE + '/metrics',
			'stats': BASE + '/stats',
			'summary': BASE + '/summary'
		},
		INDEX = {};


	// FUNCTIONS //

	/**
	* FUNCTION: filter( file )
	*
	*/
	function filter( file ) {
		return file.substr( -5 ) === '.json';
	} // end FUNCTION filter()

	/**
	* FUNCTION: calculateMetrics( DEST, dir, filename )
	*	Read a file from a directory and calculates metrics from the data contents. Calculations are performed according to metric functions.
	*
	* @param {string} DEST - directory destination
	* @param {string} dir - directory name
	* @param {string} filename - filename
	*/
	function calculateMetrics( DEST, dir, filename ) {
		var file, path, data;

		// Get the file path:
		path = PATH + '/' + dir + '/' + filename;

		// Remove the extension from filename:
		file = filename.substr( 0, filename.length-5 );

		// Create the raw data readstream:
		data = readStream( path )
			.pipe( parser() );

		// Send the data off to calculate metrics:
		metrics( data, DEST+'/'+dir, file, function onEnd() {
			console.log( file + '::metrics finished...' );
		});
	} // end FUNCTION calculateMetrics()

	/**
	* FUNCTION: mkdir( dir, clbk )
	*	Checks if a directory exists. If not, creates the directory.
	*
	* @param {string} dir - directory to be created
	* @param {function} clbk - Callback to be invoked after creating a directory.
	*/
	function mkdir( dir, clbk ) {
		fs.exists( dir, function onExist( exists ) {
			if ( !exists ) {
				fs.mkdir( dir, function onError( error ) {
					if ( error ) {
						throw new Error( 'mkdir()::unable to create directory.' );
					}
					clbk();
				});
				return;
			}
			clbk();
		});
	} // end FUNCTION mkdir()

	/**
	* FUNCTION: run()
	*	Runs the transformations across all datasets.
	*
	*/
	function run() {
		var dirs = Object.keys( INDEX ),
			files;

		for ( var i = 0; i < 1; i++ ) {
			files = INDEX[ dirs[ i ] ];
			mkdir( DEST.metrics+'/'+dirs[ i ], onDir( dirs[ i ], files ) );
		}
	} // end FUNCTION run()

	/**
	* FUNCTION: onDir( name, files )
	*	Encloses a directory name and an array of directory contents and returns a callback.
	*
	* @param {string} name - directory name
	* @param {array} files - array of filenames
	* @returns {function} callback to be invoked upon create a directory.
	*/
	function onDir( name, files ) {
		return function onDir() {
			for ( var i = 0; i < 1; i++ ) {
				calculateMetrics( DEST.metrics, name, files[ i ] );
			}
		};
	} // end FUNCTION onDir()


	// INIT //

	(function init() {

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

	})();


	// CALCULATE //

	var calculate = function() {
		// Remove all previous data transformations, if any, before running transforms:
		// rimraf( DEST, function onRemove() {
			// Create the top-level destination directory:
			mkdir( DEST.metrics, function onCreate() {
				// Run the transforms:
				run();
			});
		// });
	}; // end FUNCTION calculate()
	

	// RUN //

	calculate();

})();