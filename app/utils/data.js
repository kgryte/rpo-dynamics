/**
*
*	UTILS: data
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
*		- 2014/04/22: Created. [AReines].
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

		// Path module:
		path = require( 'path' ),

		// Module to listing available datasets:
		indexer = require( './../../public/data' );


	// VARIABLES //

	var PATH = path.resolve( __dirname, '../../public/data' ),
		INDICES = {};


	// FUNCTIONS //

	/**
	* FUNCTION: filter( prefix1, prefix2 )
	*	Returns a filter function based on the provided prefixes.
	*
	* @param {string} prefix1 - filter prefix
	* @param {string} prefix2 - filter prefix
	* @returns {function} callback invoked to filter filenames
	*/
	function filter( prefix1, prefix2 ) {
		var ext, numChars;

		ext = '';
		ext += ( prefix1 ) ? prefix1 + '.' : '';
		ext += ( prefix2 ) ? prefix2 + '.' : '';
		ext += 'json';

		numChars = ext.length;
		/**
		* FUNCTION: filter( file )
		*	Filters a filename. Returns false if filename does not match filter critera.
		*
		* @param {string} file - filename
		* @returns {boolean}
		*/
		return function filter( file ) {
			return file.substr( -numChars ) === ext;
		};
	} // end FUNCTION filter()


	// INIT //

	(function init() {
		var list;

		// Get the available indices:
		list = indexer.list();

		// For each index, cache the directory index...
		for ( var i = 0; i < list.length; i++ ) {
			INDICES[ list[ i ] ] = indexer.get( list[ i ] );
		}
		
	})();


	// DATA //

	/**
	* FUNCTION: getData( type, ids, metric, filter, clbk )
	*	Loads an array of data arrays based on the specified output data classification, conditions, metric, and dataset filter.
	*
	* @param {string} type - output data classification; e.g., raw, distributions, summary, etc.
	* @param {array} ids - array of encoded condition ids; e.g., [ '00100110' ]
	* @param {string} metric - (optional) metric name; e.g., 'uncorrected.efficiency', 'uncorrected.stoichiometry', etc.
	* @param {string} transform - (optional) transformation name; e.g., 'histogram', 'kde', 'timeseries', etc.
	* @param {function} clbk - callback to invoke upon loading the requested data. Function should take two arguments: [ error, data ]. If no errors, error is null.
	*/
	function getData( type, ids, metric, transform, clbk ) {
		var DATA = {}, index,
			files, total,
			dir_path, file_path, id,
			d, parts, idx,
			done, onRead;

		if ( !INDICES.hasOwnProperty( type ) ) {
			clbk({
				'status': 404,
				'message': 'Data classification does not exist: ' + type
			});
			return;
		}

		// Get the relevant data file index:
		index = INDICES[ type ];

		// Generate a callback to track progress:
		done = onFinish( ids.length );

		for ( var i = 0; i < ids.length; i++ ) {

			// Cache the current id:
			id = ids[ i ];

			if ( !index.hasOwnProperty( id ) ) {
				clbk({
					'status': 404,
					'message': 'Dataset does not exist. ID not found in directory list.'
				});
				return;
			}

			// Build the directory path:
			dir_path = path.join( PATH, type, id );

			// Get the file names matching the metric/transform criteria:
			files = index[ id ].filter( filter( metric, transform ) );

			total = files.length;

			if ( !total ) {
				clbk({
					'status': 404,
					'message': 'No files met the specified criteria: [ ' + metric + ', ' + transform + ' ].'
				});
				return;
			}

			// Initialize a new data array:
			DATA[ id ] = new Array( total );

			// Generate a callback to track progress:
			onRead = onData( total, id, done );

			// For each data file, get its content...
			for ( var j = 0; j < total; j++ ) {

				// Split the file name into parts:
				parts = files[ j ].split( '.' );

				// 1.uncorrected.efficiency.histogram.json
				if ( parts.length === 5 ) {
					// Determine the index: (NOTE: we assume the files have numeric names and are numbered sequentially, beginning with 1.)
					idx = parseInt( parts[ 0 ], 10 ) - 1;
				} else {
					idx = j;
				}

				// Get the file path:
				file_path = path.join( dir_path, files[ j ] );

				// Get the data:
				fs.readFile( file_path, 'utf8', onRead( idx ) );

			} // end FOR j

		} // end FOR i

		return;

		/**
		* FUNCTION: onData( total, id, clbk )
		*	Returns a callback generator for monitoring file read progress.
		*
		* @param {number} total - total iterations
		* @param {number} id - index
		* @param {function} clbk - callback to invoke after loading all files. Function should one argument: [ error ]. If no errors, error is null.
		* @returns {function} callback generator
		*/
		function onData( total, id, clbk ) {
			var counter = 0;
			/**
			* FUNCTION: onRead( idx )
			*	Returns an event handler to invoke upon loading data from file.
			*
			* @param {number} idx - index
			* @returns {function} callback to invoke upon file read
			*/
			return function onRead( idx ) {
				/**
				* FUNCTION: onRead( error, json )
				*	Event handler invoked upon reading a file.
				*
				* @param {object} error - error object
				* @param {string} json - stringified json
				*/
				return function onRead( error, json ) {
					if ( error ) {
						clbk({
							'status': 500,
							'message': 'Unable to load data file.'
						});
						console.error( error.stack );
						return;
					}
					// Parse and store the data:
					DATA[ id ][ idx ] = JSON.parse( json );

					if ( ++counter === total ) {
						clbk( null );
					}
				}; // end FUNCTION onRead()
			}; // end FUNCTION onRead()
		} // end FUNCTION onData()

		/**
		* FUNCTION: onFinish( total )
		*	Returns a callback to invoke upon loading all data files for a condition set.
		*
		* @param {number} total - total iterations
		* @returns {function} callback to invoke after loading all data files
		*/
		function onFinish( total ) {
			var counter = 0;
			/**
			* FUNCTION: done( error )
			*	Callback invoked upon loading all data files for a condition set.
			*
			* @param {object} error - error object
			*/
			return function done( error ) {
				if ( error ) {
					clbk( error );
					return;
				}
				if ( ++counter === total ) {
					clbk( null, DATA );
				}
			};
		} // end FUNCTION onFinish()

	} // end FUNCTION getData()


	// EXPORTS //

	module.exports = getData;

})();