/**
*
*	STREAM: kde
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

	var // Module for creating sink streams:
		Sink = require( 'pipette' ).Sink,

		// JSON stream transform:
		transformer = require( './../../json/transform.js' ),

		// JSON stream stringify:
		stringify = require( './../../json/stringify.js' ),

		// JSON stream parser:
		parser = require( './../../json/parse.js' ),

		// Module to calculate the KDE:
		KDE = require( './kde.js' );


	// STREAM //

	/**
	* FUNCTION: Stream()
	*	Stream constructor.
	*
	* @returns {object} Stream instance
	*/
	function Stream() {
		return this;
	} // end FUNCTION stream()

	/**
	* METHOD: transform()
	*	Returns a data transformation function.
	*
	* @returns {function} data transformation function
	*/
	Stream.prototype.transform = function() {
		var kde = new KDE();
		/**
		* FUNCTION: transform( data )
		*	Defines the data transformation.
		*
		* @param {number} data - numeric stream data
		* @returns {number} transformed data
		*/
		return function transform( data ) {
			data = JSON.parse( data );
			kde.estimator( data, 'silverman' );
			return kde.eval( data );
		};
	}; // end METHOD transform()

	/**
	* METHOD: stream()
	*	Returns a JSON data transform stream for calculating the statistic.
	*/
	Stream.prototype.stream = function() {
		var iStream, sink, oStream;

		// Create the input transform stream:
		iStream = stringify();

		// Send the input stream to a sink, where the data is encoded as standard unicode data:
		sink = new Sink( iStream, { 'encoding': 'utf8' } );

		// Pipe the data collected in the sink to an output transform stream:
		oStream = sink.pipe( transformer( this.transform() ) )
			.pipe( stringify() );

		// Return the io streams:
		return [ iStream, oStream ];
	}; // end METHOD stream()


	// EXPORTS //

	module.exports = Stream;

})();