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

	var path = __dirname + '/../../public/data/raw/',
		dest = __dirname + '/../../public/data/metrics/';


	// FUNCTIONS //

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


	// CALCULATE //

	var calculate = function() {

		var metrics = {
				'E': {
					'dest': dest + '00000010/1.efficiency.timeseries.json',
					'name': '00000010::FRET',
					func: function( data ) {
						return [
							xValue( data ),
							raw_efficiency( data )
						];
					}
				},
				'S': {
					'dest': dest + '00000010/1.stoichiometry.timeseries.json',
					'name': '00000010::stoichiometry',
					func: function( data ) {
						return [
							xValue( data ),
							raw_stoichiometry( data )
						];
					}
				}
			},
			keys, metric, write,
			data;

		// Create the raw data readstream:
		data = fs.createReadStream( path + '00000010/1.json' )
			.pipe( getParser() );

		// Get the metric names:
		keys = Object.keys( metrics );

		// Write out the metrics:
		for ( var i = 0; i < keys.length; i++ ) {

			// Get the metric config:
			metric = metrics[ keys[ i ] ];

			// Create the write stream:
			write = getWriter( metric.dest, metric.name );

			// Pipe the data stream:
			data.pipe( getTransformer( metric.func ) )
				.pipe( getStringifier() )
				.pipe( write );

		} // end FOR i

	}; // end FUNCTION calculate()
	
	// EXPORTS //

	module.exports = calculate;

})();