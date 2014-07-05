/**
*
*	STREAM: timeseries-histogram
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
*		- 2014/05/26: Created. [AReines].
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

		// Flow streams:
		flow = require( 'flow.io' ),

		// Linearly spaced vectors:
		linspace = require( 'vector-linspace' );


	// FUNCTIONS //

	/**
	* FUNCTION: indexify( idx )
	*	Returns a transform function which binds an index to streamed data.
	*
	* @private
	* @param {number} idx - datum index
	* @returns {function} data transformation function
	*/
	function indexify( idx ) {
		/**
		* FUNCTION: transform( data )
		*	Defines the data transformation.
		*
		* @private
		* @param {number} data - streamed data
		* @returns {array} 2-element array: [ idx, data ]
		*/
		return function transform( data ) {
			return [ idx, data ];
		}; // end FUNCTION transform()
	} // end FUNCTION indexify()

	/**
	* FUNCTION: reorderify( acc, data )
	*	Defines the data reduction.
	*
	* @private
	* @param {array} acc - accumulated array
	* @param {array} data - streamed 2-element data array
	* @returns {array} reduced data as a 1-d array
	*/
	function reorderify( data, d ) {
		data[ d[0] ] = d[ 1 ];
		return data;
	} // end FUNCTION reorderify()

	/**
	* FUNCTION: parse( data )
	*	Defines the data transformation.
	*
	* @private
	* @param {array} data - streamed data
	* @returns {string} parsed JSON data
	*/
	function parse( data ) {
		return JSON.parse( data );
	} // end FUNCTION parse()

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
	* @returns {object} Transform instance
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
	Stream.prototype.type = 'timeseries-histogram';

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
		var histc, mTransform, rTransform,
			dStream, mapStream, hStream, iStream, pStream, mStream, rStream, sStream, oStream,
			pipelines = [];

		// Create stream generators:
		mTransform = flow.map();
		rTransform = flow.reduce();
		histc = flow.histc()
			.edges( this._edges );

		for ( var i = 0; i < data.length; i++ ) {

			// Create a readable data stream:
			dStream = eventStream.readArray( data[ i ] );

			// Create the input transform stream:
			mapStream = mTransform
				.map( map( this._value ) )
				.stream();

			// Create a histogram stream:
			hStream = histc.stream();

			// Create a transform stream to index the reduced stream:
			iStream = mTransform
				.map( indexify( i ) )
				.stream();

			// Create a stream pipeline:
			pStream = eventStream.pipeline(
				dStream,
				mapStream,
				hStream,
				iStream
			);

			// Append the pipeline to our list of pipelines:
			pipelines.push( pStream );

		} // end FOR i

		// Create a single merged stream from pipeline output:
		mStream = eventStream.merge.apply( {}, pipelines );

		// Create a stream to reorder (sort) the merged output:
		rStream = rTransform
			.reduce( reorderify )
			.acc( new Array( data.length ) )
			.stream();

		// Create a transform stream to convert the output to a string:
		sStream = mTransform
			.map( stringify )
			.stream();

		// Create the output stream:
		oStream = mStream
			.pipe( rStream )
			.pipe( sStream );

		// Return the output stream:
		return oStream;
	}; // end METHOD stream()


	// EXPORTS //

	module.exports = function createStream() {
		return new Stream();
	};

})();