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

	var // Event stream module:
		eventStream = require( 'event-stream' ),

		// Element-wise dataset concatentation:
		concat = require( './../../../concat.js' ),

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


	// STREAM //

	/**
	* FUNCTION: Stream()
	*	Stream constructor.
	*
	* @constructor
	* @returns {object} Stream instance
	*/
	function Stream() {

		this.name = '';

		this._edges = linspace( -0.01, 1.01, 52 );

		// ACCESSORS:
		this._value = function( d ) {
			return d.y;
		};

		return this;
	} // end FUNCTION transform()

	/**
	* ATTRIBUTE: type
	*	Defines the stream type.
	*/
	Stream.prototype.type = 'histogram';

	/**
	* METHOD: metric( metric )
	*	Metric setter and getter. If a metric instance is supplied, sets the metric. If no metric is supplied, returns the instance metric value function.
	*
	* @param {object} metric - an object with a 'value' method; see constructor for basic example. If the metric has a name property, sets the transform name.
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
		// If the metric has a name, set the transform name:
		this.name = ( metric.name ) ? metric.name : '';
		// Return the transform instance:
		return this;
	}; // end METHOD metric()

	/**
	* METHOD: stream( data )
	*	Returns a transform stream for calculating the statistic.
	*
	* @param {array} data - array of data arrays
	* @returns {stream} output statistic stream
	*/
	Stream.prototype.stream = function( data ) {
		var dStream, mTransform, mStream, histc, hStream, pStream, sStream;

		// Concatenate all datasets:
		data = concat( data );

		// Create a readable data stream:
		dStream = eventStream.readArray( data );

		// Create a map transform generator and configure:
		mTransform = flow.map()
			.map( map( this._value ) );

		// Create the input transform stream:
		mStream = mTransform.stream();

		// Create a histogram counts stream generator and configure:
		histc = flow.histc()
			.edges( this._edges );

		// Create a histogram stream:
		hStream = histc.stream();

		// Create a stream to stringify the results:
		sStream = flow.stringify().stream();

		// Create a stream pipeline:
		pStream = eventStream.pipeline(
			dStream,
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