/**
*
*	STREAM: histogram
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
*		- 2014/05/20: Created. [AReines].
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

	var // Stream combiner:
		pipeline = require( 'stream-combiner' ),

		// Flow streams:
		flow = require( 'flow.io' ),

		// Linearly spaced vectors:
		linspace = require( 'vector-linspace' );

	// FUNCTIONS //

	/**
	* FUNCTION: map( fcn )
	*	Returns a data transformation function.
	*
	* @private
	* @param {function} fcn - function which performs the map transform
	* @returns {function} data transformation function
	*/
	function map( fcn ) {
		/**
		* FUNCTION: map( data )
		*	Defines the data transformation.
		*
		* @private
		* @param {*} data - stream data
		* @returns {number} transformed data
		*/
		return function map( data ) {
			return fcn( data );
		};
	} // end FUNCTION map()
	
	/**
	* FUNCTION: stringify( data )
	*	Defines the data transformation.
	*
	* @private
	* @param {array} data - streamed data
	* @returns {string} stringified data
	*/
	function stringify( data ) {
		return JSON.stringify( data );
	} // end FUNCTION stringify()


	// STREAM //

	/**
	* FUNCTION: Stream()
	*	Stream constructor.
	*
	* @constructor
	* @returns {object} Stream generator instance
	*/
	function Stream() {

		this.name = '';

		this._edges = linspace( -0.01, 1.01, 52 );

		// ACCESSORS:
		this._value = function( d ) {
			return d.y;
		};

		return this;
	} // end FUNCTION Stream()

	/**
	* ATTRIBUTE: type
	*	Defines the stream type.
	*/
	Stream.prototype.type = 'histogram';

	/**
	* METHOD: metric( metric )
	*	Metric setter and getter. If a metric instance is supplied, sets the metric. If no metric is supplied, returns the instance metric value function.
	*
	* @param {object} metric - an object with a 'value' method; see constructor for basic example. If the metric has a name property, sets the stream name.
	* @returns {object|object} instance object or instance metric
	*/
	Stream.prototype.metric = function ( metric ) {
		if ( !arguments.length ) {
			return this._value;
		}
		if ( !metric.value ) {
			throw new Error( 'metric()::invalid input argument. Metric must be an object with a \'value\' method.' );
		}
		// Extract the method to calculate the metric value and bind the metric context:
		this._value = metric.value.bind( metric );
		// If the metric has a name, set the stream name:
		this.name = ( metric.name ) ? metric.name : '';
		// Return the stream instance:
		return this;
	}; // end METHOD metric()

	/**
	* METHOD: stream()
	*	Returns a JSON data transform stream for calculating the statistic.
	*
	* @returns {stream} histogram stream
	*/
	Stream.prototype.stream = function() {
		var mTransform, mStream, histc, hStream, sStream, pStream;

		// Create a map transform generator and configure:
		mTransform = flow.map()
			.map( map( this._value ) );
		
		//Create the input transform stream:
		mStream = mTransform.stream();

		// Create a histogram counts stream generator and configure:
		histc = flow.histc()
			.edges( this._edges );

		// Create a histogram stream:
		hStream = histc.stream();

		// Create a stream to stringify histogram data:
		sStream = mTransform
			.map( stringify )
			.stream();

		// Create a stream pipeline:
		pStream = pipeline(
			mStream,
			hStream,
			sStream
		);

		// Return the pipeline:
		return pStream;
	}; // end METHOD stream()


	// EXPORTS //

	module.exports = function createStream() {
		return new Stream();
	};

})();