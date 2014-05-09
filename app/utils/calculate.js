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

	var // Drop-in replacement for filesystem module:
		fs = require( './graceful-fs' ),

		// Module to recursively remove directories and their contents:
		rimraf = require( 'rimraf' ),

		// Module to stream JSON objects:
		JSONStream = require( 'JSONStream' ),

		// Module allowing for event data transformation:
		eventStream = require( 'event-stream' ),

		// Module for creating sink streams:
		Sink = require( 'pipette' ).Sink;


	// VARIABLES //

	var PATH = __dirname + '/../../public/data/raw/',
		DEST = {
			'metrics': __dirname + '/../../public/data/metrics/',
			'stats': __dirname + '/../../public/data/stats/',
			'summary': __dirname + '/../../public/data/summary/'
		},
		INDEX = {};


	// METRICS | STATS | SUMMARY //

	var METRICS = {
			// 'efficiency.timeseries': {
			// 	transform: function( data ) {
			// 		return [
			// 			xValue( data ),
			// 			raw_efficiency( data )
			// 		];
			// 	}
			// },
			// 'stoichiometry.timeseries': {
			// 	transform: function( data ) {
			// 		return [
			// 			xValue( data ),
			// 			raw_stoichiometry( data )
			// 		];
			// 	}
			// }
		},
		STATS = {
			'efficiency.histogram': {
				transform: function( data ) {
					return [
						raw_efficiency( data )
					];
				}
			},
			'stoichiometry.histogram': {
				transform: function( data ) {
					return [
						raw_stoichiometry( data )
					];
				}
			}
		};
			

	// FUNCTIONS //

	/**
	* FUNCTION: filter( file )
	*
	*/
	function filter( file ) {
		return file.substr( -5 ) === '.json';
	} // end FUNCTION filter()

	/**
	* FUNCTION: getParser()
	*	Returns a transform stream to parse a JSON stream.
	*
	* @returns {object} JSON stream parser
	*/
	function getParser() {
		var stream = JSONStream.parse( '*' );
		stream.on( 'error', function onError( error ) {
			console.error( error.stack );
		});
		return stream;
	} // end FUNCTION getParser()

	/**
	* FUNCTION: getStringifier()
	*	Returns a transform stream to stringify data as a JSON array.
	* 
	* @returns {object} JSON stream stringifier
	*/
	function getStringifier() {
		var stream = JSONStream.stringify( '[\n\t', ',\n\t', '\n]\n' );
		stream.on( 'error', function onError( error ) {
			console.error( error.stack );
		});
		return stream;
	} // end FUNCTION getStringifier()

	/**
	* FUNCTION: getTransformer( func )
	*	Provided a data transformation function, returns an event stream which applies the transformation to piped data.
	*
	* @param {function} func - data transformation function
	* @returns {object} JSON transform stream
	*/
	function getTransformer( func ) {
		if ( !arguments.length ) {
			throw new Error( 'getTransformer()::insufficient input arguments. Must provide a transformation function.' );
		}
		var stream = eventStream.map( function onData( data, callback ) {
			callback( null, func( data ) );
		});
		stream.on( 'error', function onError( error ) {
			console.error( error.stack );
		});
		return stream;
	} // end FUNCTION getTransformer()

	/**
	* FUNCTION: getWriter( dest, name )
	*	Returns a writable stream which outputs to a provided destination.
	*
	* @param {string} dest - output destination
	* @param {string} name - (optional) stream name
	* @returns {object} writable stream
	*/
	function getWriter( dest, name ) {
		if ( !arguments.length ) {
			throw new Error( 'getWriteStream()::insufficient input arguments. Must provide an output file destination.' );
		}
		var stream = fs.createWriteStream( dest );
		stream.on( 'error', function onError( error ) {
			var err = {
					'status': 500,
					'message': 'internal server error. Error encountered while attempting to write data.',
					'error': error
				};
			console.error( error.stack );
			if ( name ) {
				throw new Error( name + '::' + err.message );
			}
		});
		stream.on( 'finish', function onEnd() {
			if ( name ) {
				console.log( name + '::writable stream is finished...' );
			}
		});
		return stream;
	} // end FUNCTION getWriter()

	/**
	* FUNCTION: calculateMetrics( DEST, dir, filename )
	*	Read a file from a directory and calculates metrics from the data contents. Calculations are performed according to metric functions.
	*
	* @param {string} DEST - directory destination
	* @param {string} dir - directory name
	* @param {string} filename - filename
	*/
	function calculateMetrics( DEST, dir, filename ) {
		var keys, metric,
			output, file, path, dest, name,
			write,
			data;

		// Get the file path:
		path = PATH + dir + '/' + filename;

		// Remove the extension from filename:
		file = filename.substr( 0, filename.length-5 );

		// Set the destination:
		dest = DEST + dir + '/' + file + '.';

		// Create the raw data readstream:
		data = fs.createReadStream( path )
			.pipe( getParser() );

		// Get the metric names:
		keys = Object.keys( METRICS );

		// Write out the metrics:
		for ( var i = 0; i < keys.length; i++ ) {

			// Get the metric config:
			metric = METRICS[ keys[ i ] ];

			// Generate the output filename:
			output = dest + keys[ i ] + '.json';

			// Generate a stream name:
			name = dir + '::' + keys[ i ];

			// Create the write stream:
			write = getWriter( output, name );

			// Pipe the data stream:
			data.pipe( getTransformer( metric.transform ) )
				.pipe( getStringifier() )
				.pipe( write );

		} // end FOR i
	} // end FUNCTION calculateMetrics()

	/**
	* FUNCTION: calculateStats( DEST, dir, filename )
	*	Read a file from a directory and calculates statistics from the data contents. Calculations are performed according to stats functions.
	*
	* @param {string} DEST - directory destination
	* @param {string} dir - directory name
	* @param {string} filename - filename
	*/
	function calculateStats( DEST, dir, filename ) {
		var keys, stat,
			output, file, path, dest, name,
			write,
			data, source, sink;

		// Get the file path:
		path = PATH + dir + '/' + filename;

		// Remove the extension from filename:
		file = filename.substr( 0, filename.length-5 );

		// Set the destination:
		dest = DEST + dir + '/' + file + '.';

		// Create the raw data readstream:
		data = fs.createReadStream( path )
			.pipe( getParser() );

		// Get the stat names:
		keys = Object.keys( STATS );

		// Write out the stats:
		for ( var i = 0; i < keys.length; i++ ) {

			// Get the stat config:
			stat = STATS[ keys[ i ] ];

			// Generate the output filename:
			output = dest + keys[ i ] + '.json';

			// Generate a stream name:
			name = dir + '::' + keys[ i ];

			// Create the write stream:
			write = getWriter( output, name );

			// Pipe the data stream:
			source = data.pipe( getTransformer( stat.transform ) )
				.pipe( getStringifier() );

			sink = new Sink( source );

			sink.pipe( eventStream.mapSync( function onData ( data ) {
					return data;
				}))
				.pipe( write );

		} // end FOR i
	} // end FUNCTION calculateStats()

	/**
	* FUNCTION: xValue( d )
	*	x-value accessor.
	*
	* @param {object} d - datum
	* @returns {number} x-value
	*/
	function xValue( d ) {
		return d.x;
	} // end FUNCTION tValue()

	/**
	* FUNCTION: yValue( d, i )
	*	y-value accessor.
	*
	* @param {object} d - datum
	* @param {number} i - y-value index
	* @returns {number} y-value
	*/
	function yValue( d, i ) {
		return d.y[ i ];
	} // end FUNCTION yValue()

	/**
	* FUNCTION: raw_efficiency( data )
	*	Calculates the (uncorrected) transfer efficiency between donor and acceptor fluorophores.
	*
	* @see [Journal Paper]{@link http://www.ncbi.nlm.nih.gov/pmc/articles/PMC1282518/}
	*
	* @param {object} data - data object containing intensity values
	* @returns {number} (uncorrected) calculated transfer efficiency
	*/
	function raw_efficiency( data ) {
		var // Donor-excitation donor-emission intensity: 
			dexdem = yValue( data, 0 ),
			// Donor-excitation acceptor-emission intensity:
			dexaem = yValue( data, 1 ),
			// Total donor-excitation emission intensity:
			total = dexdem + dexaem;
		// Calculated transfer efficiency:
		return dexaem / total;
	} // end FUNCTION raw_efficiency()

	/**
	* FUNCTION: raw_stoichiometry( data )
	*	Calculates the (uncorrected) stoichiometric ratio between donor and acceptor fluorophores.
	*
	* @see [Journal Paper]{@link http://www.ncbi.nlm.nih.gov/pmc/articles/PMC1282518/}
	*
	* @param {object} data - data object containing intensity values
	* @returns {number} (uncorrected) calculated stoichiometry
	*/
	function raw_stoichiometry( data ) {
		var // Donor-excitation donor-emission intensity: 
			dexdem = yValue( data, 0 ),
			// Donor-excitation acceptor-emission intensity: 
			dexaem = yValue( data, 1 ),
			// Acceptor-excitation acceptor-emission intensity: 
			aexaem = yValue( data, 2 ),
			// Total donor-excitation emission intensity:
			num = dexdem + dexaem,
			// Total emission intensity:
			denom = num + aexaem;
		// Calculated stoichiometry ratio:
		return num / denom;
	} // end FUNCTION raw_stoichiometry()

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
			mkdir( DEST.stats+dirs[ i ], onDir( dirs[ i ], files ) );
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
				calculateStats( DEST.stats, name, files[ i ] );
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
			mkdir( DEST.stats, function onCreate() {
				// Run the transforms:
				run();
			});
		// });
	}; // end FUNCTION calculate()
	
	// EXPORTS //

	module.exports = calculate;

})();