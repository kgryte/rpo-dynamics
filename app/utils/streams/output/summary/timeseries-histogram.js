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

		// JSON stream transform:
		transformer = require( './../../json/transform.js' ),

		// JSON stream reducer:
		reducer = require( './../../json/reduce.js' ),

		// Module to calculate the histogram counts:
		Histc = require( './../../stats/histc' );


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

	/**
	* FUNCTION: indexify( idx )
	*	Returns a transform function which binds an index to streamed data.
	*
	* @param {number} idx - datum index
	* @returns {function} data transformation function
	*/
	function indexify( idx ) {
		/**
		* FUNCTION: transform( data )
		*	Defines the data transformation.
		*
		* @param {number} data - streamed data
		* @returns {array} 2-element array: [ idx, data ]
		*/
		return function transform( data ) {
			return [ idx, data ];
		}; // end FUNCTION transform()
	} // end FUNCTION indexify()

	/**
	* FUNCTION: reorderify()
	*	Returns a reduction function which reorders streamed data.
	*
	* @param {number} numData - data stream length
	* @returns {function} data reduction function
	*/
	function reorderify() {
		/**
		* FUNCTION: reduce( acc, data )
		*	Defines the data reduction.
		*
		* @param {array} acc - accumulated array
		* @param {array} data - streamed 2-element data array
		* @returns {array} reduced data as a 1-d array
		*/return function reduce( data, d ) {
			data[ d[0] ] = d[ 1 ];
			return data;
		}; // end FUNCTION transform()
	} // end FUNCTION reorderify()

	/**
	* FUNCTION: parse()
	*	Returns a transform function to parse JSON streamed data.
	*/
	function parse() {
		/**
		* FUNCTION: transform( data )
		*	Defines the data transformation.
		*
		* @param {array} data - streamed data
		* @returns {string} parsed JSON data
		*/
		return function transform( data ) {
			return JSON.parse( data );
		}; // end FUNCTION transform()
	} // end FUNCTION parse()

	/**
	* FUNCTION: stringify()
	*	Returns a transform function to stringify streamed data.
	*/
	function stringify() {
		/**
		* FUNCTION: transform( data )
		*	Defines the data transformation.
		*
		* @param {array} data - streamed data
		* @returns {string} stringified data
		*/
		return function transform( data ) {
			return JSON.stringify( data );
		}; // end FUNCTION transform()
	} // end FUNCTION stringify()


	// TRANSFORM //

	/**
	* FUNCTION: Transform()
	*	Transform constructor.
	*
	* @returns {object} Transform instance
	*/
	function Transform() {

		this.type = 'timeseries-histogram';
		this.name = '';

		// this._edges = linspace( -0.01, 1.01, 0.02 );

		// ACCESSORS:
		this._value = function( d ) {
			return d.y;
		};

		return this;
	} // end FUNCTION transform()

	/**
	* METHOD: metric( metric )
	*	Metric setter and getter. If a metric instance is supplied, sets the metric. If no metric is supplied, returns the instance metric value function.
	*
	* @param {object} metric - an object with a 'value' method; see constructor for basic example. If the metric has a name property, sets the transform name.
	* @returns {object|object} instance object or instance metric
	*/
	Transform.prototype.metric = function ( metric ) {
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
	* METHOD: transform()
	*	Returns a data transformation function.
	*
	* @returns {function} data transformation function
	*/
	Transform.prototype.transform = function() {
		var val = this._value;
		/**
		* FUNCTION: transform( data )
		*	Defines the data transformation.
		*
		* @param {object} data - JSON stream data
		* @returns {array} transformed data
		*/
		return function transform( data ) {
			return val( data );
		};
	}; // end METHOD transform()

	/**
	* METHOD: stream( data )
	*	Returns a transform stream for calculating the statistic.
	*
	* @param {array} data - array of data arrays
	* @returns {stream} output statistic stream
	*/
	Transform.prototype.stream = function( data ) {
		var histc, dStream, transform, hStream, iStream, pStream, mStream, rStream, oStream, pipelines = [];

		// Create a histogram counts stream generator and configure:
		histc = new Histc();

		for ( var i = 0; i < data.length; i++ ) {

			// Create a readable data stream:
			dStream = eventStream.readArray( data[ i ] );

			// Create the input transform stream:
			transform = transformer( this.transform() );

			// Create a histogram stream:
			hStream = histc.stream();

			// Create a transform stream to index the reduced stream:
			iStream = transformer( indexify( i ) );

			// Create a stream pipeline:
			pStream = eventStream.pipeline(
				dStream,
				transform,
				hStream,
				transformer( parse() ),
				iStream
			);

			// Append the pipeline to our list of pipelines:
			pipelines.push( pStream );

		} // end FOR i

		// Create a single merged stream from pipeline output:
		mStream = eventStream.merge.apply( {}, pipelines );

		// Create a stream to reorder (sort) the merged output:
		rStream = reducer( reorderify(), new Array( data.length ) );

		// Create the output stream:
		oStream = mStream.pipe( rStream )
			.pipe( transformer( stringify() ) );

		// Return the output stream:
		return oStream;
	}; // end METHOD stream()


	// EXPORTS //

	module.exports = Transform;

})();