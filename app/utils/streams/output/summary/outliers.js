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
		this.type = 'outliers';
		this.name = '';

		// Create stats and filter stream generators:
		this._streams = {
			'median': flow.median(),
			'quartiles': flow.quantiles(),
			'iqr': flow.iqr(),
			'mild_outliers': flow.mOutliers(),
			'extreme_outliers': flow.eOutliers()
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
			dStream, transform, mStream,
			mPipeline, mPipelines = [],
			cStream1,
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

			// [3] Create a stream pipeline:
			mPipeline = eventStream.pipeline(
				dStream,
				transform,
				mStream
			);

			// Append the pipeline to our list of pipelines:
			mPipelines.push( mPipeline );

		} // end FOR i

		// [4] Create a single merged stream from pipeline output:
		cStream1 = eventStream.merge.apply( {}, mPipelines );

		// Get the flow stream names:
		keys = Object.keys( flows );

		// Create stream pipelines...
		for ( var j = 0; j < keys.length; j++ ) {
			name = keys[ j ];

			// [5] Create a new flow stream:
			fStream = flows[ name ].stream();

			// [6] Create a new flow stream pipeline:
			fPipeline = eventStream.pipeline(
				cStream1,
				fStream,
				keyify( name )
			);

			// Append the pipeline to a list:
			fPipelines.push( fPipeline );

		} // end FOR j

		// [7] Create a single merged stream from pipelined output:
		cStream2 = eventStream.merge.apply( {}, fPipelines );

		// [8] Wait for all streams to finish before making an object:
		oStream = cStream2.pipe( eventStream.wait() )
			.pipe( objectify() );

		// Return the output stream:
		return oStream;
	}; // end METHOD stream()


	// EXPORTS //

	module.exports = Stream;

})();