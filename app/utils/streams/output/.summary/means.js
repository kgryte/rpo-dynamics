/**
*
*	STREAM: means
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
*		- 2014/05/23: Created. [AReines].
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
		flow = require( 'flow.io' );


	// FUNCTIONS //

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
		this.type = 'means';
		this.name = '';

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
		var mean, dStream, transform, mStream, iStream, pStream, rStream, sStream, cStream, oStream, pipelines = [];

		// Instantiate a new mean instance and configure:
		mean = flow.mean();

		// For each dataset, compute its mean...
		for ( var i = 0; i < data.length; i++ ) {

			// Create a readable data stream:
			dStream = eventStream.readArray( data[ i ] );

			// Create an input transform stream:
			transform = flow.transform( this.transform() );

			// Create a mean reduction stream:
			mStream = mean.stream();

			// Create a transform stream to index the reduced stream:
			iStream = flow.transform( indexify( i ) );

			// Create a stream pipeline:
			pStream = eventStream.pipeline(
				dStream,
				transform,
				mStream,
				iStream
			);

			// Append the pipeline to our list of pipelines:
			pipelines.push( pStream );

		} // end FOR i

		// Create a single merged stream from pipeline output:
		cStream = eventStream.merge.apply( {}, pipelines );

		// Create a stream to reorder (sort) the merged output:
		rStream = flow.reduce( reorderify(), new Array( data.length ) );

		// Create a stream to stringify reordered data:
		sStream = flow.transform( stringify() );

		// Sort and convert merged output to a stringified object:
		oStream = cStream.pipe( rStream )
			.pipe( sStream );

		// Return the output stream:
		return oStream;
	}; // end METHOD stream()


	// EXPORTS //

	module.exports = Transform;

})();