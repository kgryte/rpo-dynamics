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
	*
	* @private
	*/
	function setMaxListeners() {
		// WARNING: this may have unintended side-effects. Dangerous, as this temporarily changes the global state for all modules, not just this module.
		eventEmitter.prototype._maxListeners = 100;
	} // end FUNCTION setMaxListeners()

	/**
	* FUNCTION: resetMaxListeners()
	*	Resets the maximum number of event emitter listeners.
	*
	* @private
	*/
	function resetMaxListeners() {
		eventEmitter.prototype._maxListeners = 11;
	} // end FUNCTION resetMaxListeners()

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
	* FUNCTION: keyify( key )
	*	Returns a JSON transform stream to create a key-value string.
	*
	* @private
	* @param {string} key - key name
	* @returns {stream} JSON transform stream
	*/
	function keyify( key ) {
		return flow.map().map( onData ).stream();
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
	* @private
	* @returns {stream} JSON transform stream
	*/
	function objectify() {
		return flow.map().map( onData ).stream();
		/**
		* FUNCTION: onData( keyvalstr )
		*	Event handler. Wraps a key-value string in {} to create a stringified object.
		*
		* @private
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

	/**
	* FUNCTION: stringify( data )
	*	Defines a data transformation. Converts an array to string format.
	*
	* @private
	* @param {array} data - stream data
	* @returns {string} transformed data
	*/
	function stringify( data ) {
		return '[' + data.toString() + ']';
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
	* @returns {object} Stream instance
	*/
	function Stream() {
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
	} // end FUNCTION Stream()

	/**
	* ATTRIBUTE: type
	*	Defines the stream type.
	*/
	Stream.prototype.type = 'outliers-means';

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
	*	Returns a stream pipeline for extracting outliers.
	*
	* @param {array} data - array of data arrays
	* @returns {stream} output stream
	*/
	Stream.prototype.stream = function( data ) {
		var flows = this._streams,
			mean,
			mTransform, rTransform, aTransform,
			dStream, mapStream, mStream, iStream,
			mPipeline, mPipelines = [],
			cStream1, rStream, aStream,
			keys, name,
			fStream,
			fPipeline, fPipelines = [],
			cStream2, sStream, oStream;

		// Instantiate new stream generators:
		mean = flow.mean();
		mTransform = flow.map();
		rTransform = flow.reduce();
		aTransform = flow.array();

		// For each dataset, compute its mean...
		for ( var i = 0; i < data.length; i++ ) {

			// [1] Create a readable data stream:
			dStream = eventStream.readArray( data[ i ] );

			// Create an input transform stream:
			mapStream = mTransform
				.map( map( this._value ) )
				.stream();

			// [2] Create a mean reduction stream:
			mStream = mean.stream();

			// [3] Create a transform stream to index the reduced stream:
			iStream = mTransform
				.map( indexify( i ) )
				.stream();

			// [4] Create a stream pipeline:
			mPipeline = eventStream.pipeline(
				dStream,
				mapStream,
				mStream,
				iStream
			);

			// Append the pipeline to our list of pipelines:
			mPipelines.push( mPipeline );

		} // end FOR i

		// [5] Create a single merged stream from pipeline output:
		cStream1 = eventStream.merge.apply( {}, mPipelines );

		// [6] Create a stream to reorder (sort) the merged output:
		rStream = rTransform
			.reduce( reorderify )
			.acc( new Array( data.length ) )
			.stream();

		// [7] Create an array stream from the ordered output:
		aStream = cStream1
			.pipe( rStream )
			.pipe( aTransform.stream() );

		// Get the flow stream names:
		keys = Object.keys( flows );

		// Create stream pipelines...
		for ( var j = 0; j < keys.length; j++ ) {
			name = keys[ j ];

			// [8] Create a new flow stream:
			fStream = flows[ name ].stream();

			// [9] Create a stringify stream:
			sStream = mTransform
				.map( stringify )
				.stream();

			// [10] Create a new flow stream pipeline:
			fPipeline = eventStream.pipeline(
				aStream,
				fStream,
				sStream,
				keyify( name )
			);

			// Append the pipeline to a list:
			fPipelines.push( fPipeline );

		} // end FOR j

		// [11] Create a single merged stream from pipelined output:
		cStream2 = eventStream.merge.apply( {}, fPipelines );

		// [12] Wait for all streams to finish before making an object:
		oStream = cStream2
			.pipe( eventStream.wait() )
			.pipe( objectify() );

		// Return the output stream:
		return oStream;
	}; // end METHOD stream()


	// EXPORTS //

	module.exports = function createStream() {
		return new Stream();
	};

})();