/**
*
*	STREAM: outliers
*
*
*
*	DESCRIPTION:
*		- Computes mean values for each condition set and finds outliers among the conditions.
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
*		- 2014/06/14: Created. [AReines].
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

	var // Event emitter:
		eventEmitter = require( 'events' ).EventEmitter,

		// Event stream module:
		eventStream = require( 'event-stream' ),

		// Flow streams:
		flow = require( 'flow.io' );


	// INIT //

	// FIXME: find a better way than to change global state.
	setMaxListeners();


	// FUNCTIONS //

	/**
	* FUNCTION: setMaxListeners()
	*	Sets the maximum number of event emitter listeners.
	*/
	function setMaxListeners() {
		// WARNING: this may have unintended side-effects. Dangerous, as this temporarily changes the global state for all modules, not just this module.
		eventEmitter.prototype._maxListeners = 100;
	} // end FUNCTION setMaxListeners()

	/**
	* FUNCTION: resetMaxListeners()
	*	Resets the maximum number of event emitter listeners.
	*/
	function resetMaxListeners() {
		eventEmitter.prototype._maxListeners = 11;
	} // end FUNCTION resetMaxListeners()

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
	* FUNCTION: keyify( key )
	*	Returns a JSON transform stream to create a key-value string.
	*
	* @param {string} key - key name
	* @returns {stream} JSON transform stream
	*/
	function keyify( key ) {
		return flow.transform( onData );
		/**
		* FUNCTION: onData( value )
		*	Event handler. Creates a key-value string; .e.g, "key": value,
		*
		* @param {number|string} value - value to be assigned to key
		* @returns {string} key-value string
		*/
		function onData( value ) {
			return '"' + key + '": ' + value + ',';
		}
	} // end FUNCTION keyify()

	/**
	* FUNCTION: objectify()
	*	Returns a JSON transform stream to create valid JSON from a comma-delimited sequence of key-value strings.
	*
	* @returns {stream} JSON transform stream
	*/
	function objectify() {
		return flow.transform( onData );
		/**
		* FUNCTION: onData( keyvalstr )
		*	Event handler. Wraps a key-value string in {} to create a stringified object.
		*
		* @param {string} keyvalstr - key-value string; e.g., "key1": value, "key2": value, ...
		* @returns {string} key-value string wrapped in {} to create a stringified object
		*/
		function onData( keyvalstr ) {
			// Valid JSON:
			if ( keyvalstr[ keyvalstr.length-1 ] === ',' ) {
				keyvalstr = keyvalstr.slice( 0, -1 );
			}
			return '{' + keyvalstr + '}';
		}
	} // end FUNCTION objectify()


	// STREAM //

	/**
	* FUNCTION: Stream()
	*	Stream constructor.
	*
	* @returns {object} Stream instance
	*/
	function Stream() {
		this.type = 'outliers-means';
		this.name = '';

		// Create stats and filter stream generators:
		this._streams = {
			'median': flow.median(),
			'quartiles': flow.quantiles().quantiles( 4 ),
			'iqr': flow.iqr(),
			'mild_outliers': flow.mOutliers().index( true ),
			'extreme_outliers': flow.eOutliers().index( true )
		};

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
	* METHOD: transform()
	*	Returns a data transformation function.
	*
	* @returns {function} data transformation function
	*/
	Stream.prototype.transform = function() {
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
	*	Returns a stream pipeline for extracting outliers.
	*
	* @param {array} data - array of data arrays
	* @returns {stream} output stream
	*/
	Stream.prototype.stream = function( data ) {
		var flows = this._streams,
			mean,
			dStream, transform, mStream, iStream,
			mPipeline, mPipelines = [],
			cStream1, rStream, aStream,
			keys, name,
			fStream,
			fPipeline, fPipelines = [],
			cStream2, oStream;

		// Instantiate a new mean instance and configure:
		mean = flow.mean();

		// For each dataset, compute its mean...
		for ( var i = 0; i < data.length; i++ ) {

			// [1] Create a readable data stream:
			dStream = eventStream.readArray( data[ i ] );

			// Create an input transform stream:
			transform = flow.transform( this.transform() );

			// [2] Create a mean reduction stream:
			mStream = mean.stream();

			// [3] Create a transform stream to index the reduced stream:
			iStream = flow.transform( indexify( i ) );

			// [4] Create a stream pipeline:
			mPipeline = eventStream.pipeline(
				dStream,
				transform,
				mStream,
				iStream
			);

			// Append the pipeline to our list of pipelines:
			mPipelines.push( mPipeline );

		} // end FOR i

		// [5] Create a single merged stream from pipeline output:
		cStream1 = eventStream.merge.apply( {}, mPipelines );

		// [6] Create a stream to reorder (sort) the merged output:
		rStream = flow.reduce( reorderify(), new Array( data.length ) );

		// [7] Create an array stream from the ordered output:
		aStream = cStream1.pipe( rStream )
			.pipe( flow.array() );

		// Get the flow stream names:
		keys = Object.keys( flows );

		// Create stream pipelines...
		for ( var j = 0; j < keys.length; j++ ) {
			name = keys[ j ];

			// [8] Create a new flow stream:
			fStream = flows[ name ].stream();

			// [9] Create a new flow stream pipeline:
			fPipeline = eventStream.pipeline(
				aStream,
				fStream,
				keyify( name )
			);

			// Append the pipeline to a list:
			fPipelines.push( fPipeline );

		} // end FOR j

		// [10] Create a single merged stream from pipelined output:
		cStream2 = eventStream.merge.apply( {}, fPipelines );

		// [11] Wait for all streams to finish before making an object:
		oStream = cStream2.pipe( eventStream.wait() )
			.pipe( objectify() );

		// Return the output stream:
		return oStream;
	}; // end METHOD stream()


	// EXPORTS //

	module.exports = Stream;

})();