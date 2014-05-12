/**
*
*	STREAM: efficiency
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

	var // Write-to-file stream:
		writeStream = require( './../file_write.js' ),

		// JSON stream stringify:
		stringify = require( './../json_stringify.js' ),

		// JSON stream transform:
		transformer = require( './../json_transform.js' );


	// FUNCTIONS //

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
	* FUNCTION: transform( data )
	*	Defines the data transformation.
	*
	* @param {object} data - JSON stream data
	* @returns {array} transformed data
	*/
	function transform( data ) {
		return [
			xValue( data ),
			raw_efficiency( data )
		];
	} // end FUNCTION transform()


	// STREAM //

	/**
	* FUNCTION: stream( data, dest, name )
	*	Takes an input JSON data stream and writes out an efficiency timeseries.
	*
	* @param {stream} data - JSON data stream
	* @param {string} dest - output file destination (do not provide output file ending; internally appended)
	* @param {string} name - stream name
	*/
	function stream( data, dest, name ) {
		var filename, write;

		// Generate the output filename:
		filename = dest + 'efficiency.timeseries.json';

		// Append to the stream name:
		name += '::efficiency.timeseries';

		// Create the write stream:
		write = writeStream( output, filename );

		// Pipe the data stream:
		data.pipe( transformer( transform ) )
			.pipe( stringify )
			.pipe( write );
	} // end FUNCTION stream()


	// EXPORTS //

	module.exports = stream;

})();