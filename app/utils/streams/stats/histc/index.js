/**
*
*	STREAM: histc
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

	var // Event-stream module:
		eventStream = require( 'event-stream' ),

		// Module for creating sink streams:
		Sink = require( 'pipette' ).Sink,

		// JSON stream transform:
		transformer = require( './../../json/transform.js' ),

		// JSON stream stringify:
		stringify = require( './../../json/stringify.js' ),

		// Module to determine bin location:
		getBin = require( './binarysearch.js' );


	// FUNCTIONS //

	/**
	* FUNCTION: linspace( min, max, increment )
	*	Generate a linearly spaced vector.
	*
	* @param {number} min - min defines the vector lower bound
	* @param {number} max - max defines the vector upper bound
	* @param {number} increment - distance between successive vector elements
	* @returns {array} a 1-dimensional array
	*/
	function linspace( min, max, increment ) {
		var numElements, vec = [];

		numElements = Math.round( ( ( max - min ) / increment ) ) + 1;

		vec[ 0 ] = min;
		vec[ numElements - 1] = max;

		for ( var i = 1; i < numElements - 1; i++ ) {
			vec[ i ] = min + increment*i;
		}
		return vec;
	} // end FUNCTION linspace()


	// STREAM //

	/**
	* FUNCTION: Stream()
	*	Stream constructor.
	*
	* @returns {object} Stream instance
	*/
	function Stream() {
		this._edges = linspace( -0.01, 1.01, 0.02 );
		return this;
	} // end FUNCTION stream()

	/**
	* METHOD: edges( vector )
	*	Edges setter and getter. If a vector is supplied, sets edges. If no vector is supplied, returns the edges.
	*
	* @param {array} vector - edges
	* @returns {object|vector} instance object or edges
	*/
	Stream.prototype.edges = function ( vector ) {
		if ( !arguments.length ) {
			return this._edges;
		}
		this._edges = vector;
		return this;
	}; // end METHOD edges()

	/**
	* METHOD: transform()
	*	Returns a data transformation function.
	*
	* @returns {function} data transformation function
	*/
	Stream.prototype.transform = function() {
		var self = this;
		/**
		* FUNCTION: transform( data )
		*	Defines the data transformation.
		*
		* @param {number} data - numeric stream data
		* @returns {number} transformed data
		*/
		return function transform( data ) {
			return getBin( self._edges, data );
		};
	}; // end METHOD transform()

	/**
	* METHOD: tabulate()
	*	Returns a data transformation function to tabulate bin counts.
	*
	* @returns {function} data transformation function
	*/
	Stream.prototype.tabulate = function() {
		var self = this,
			numBins = self._edges.length + 1, // include -/+ infinity bins
			counts = new Array( numBins );

		for ( var i = 0; i < numBins; i++ ) {
			counts[ i ] = [
				self._edges[ i-1 ],
				0,
				self._edges[ i ]
			];
		} // end FOR i

		/**
		* FUNCTION: transform( data )
		*	Defines the data transformation.
		*
		* @param {object} data - JSON stream data
		* @returns {array} transformed data
		*/
		return function transform( data ) {
			var idx;
			data = data.split( ',' );
			for ( var i = 0; i < data.length; i++ ) {
				idx = parseInt( data[ i ], 10 ) + 1;
				counts[ idx ][ 1 ] += 1;
			}
			return counts;
		};
	}; // end METHOD transform()

	/**
	* METHOD: stream()
	*	Returns a JSON data transform stream for calculating the statistic.
	*/
	Stream.prototype.stream = function() {
		var iStream, jStream, sink, oStream;

		// Create the input transform stream:
		iStream = transformer( this.transform() );

		// Transform the data into a comma-delimited string: (like Array join)
		jStream = iStream.pipe( eventStream.join( ',' ) );

		// Send the input stream to a sink, where the data is encoded as standard unicode data:
		sink = new Sink( jStream, { 'encoding': 'utf8' } );

		// Pipe the data collected in the sink to an output transform stream:
		oStream = sink.pipe( transformer( this.tabulate() ) )
			.pipe( stringify() );

		// Return the io streams:
		return [ iStream, oStream ];
	}; // end METHOD stream()


	// EXPORTS //

	module.exports = Stream;

})();