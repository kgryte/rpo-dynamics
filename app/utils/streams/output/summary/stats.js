/**
*
*	STREAM: stats
*
*
*
*	DESCRIPTION:
*		- Calculates descriptive statistics, including count, min, max, sum, mean, median, variance.
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
*		- 2014/05/25: Created. [AReines].
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

		// Event-stream module:
		eventStream = require( 'event-stream' ),

		// Flow streams:
		flow = require( 'flow.io' ),

		// Element-wise dataset concatentation:
		concat = require( './../../../concat.js' );


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


	// REDUCE //

	/**
	* FUNCTION: Stream()
	*	Stream constructor.
	*
	* @returns {object} Stream instance
	*/
	function Stream() {
		this.type = 'stats';
		this.name = '';

		// Create stats reduce stream generators:
		this._reducers = {
			'count': flow.count(),
			'min': flow.min(),
			'max': flow.max(),
			'sum': flow.sum(),
			'median': flow.median(),
			'quantiles': flow.quantiles(),
			'mean': flow.mean(),
			'variance': flow.variance(),
			'skewness': flow.skewness(),
			'kurtosis': flow.kurtosis(),
		};

		// ACCESSORS:
		this._value = function( d ) {
			return d.y;
		};

		return this;
	} // end FUNCTION stream()

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
	* METHOD: reducer( name, reducer )
	*	Reduce stream generator setter and getter. If no arguments are supplied, returns a list of reduce stream generators. If a name and reducer are supplied, adds the reducer to a reduce stream generator dictionary.
	*
	* @param {string} name - reduce stream generator name; e.g., correlation
	* @param {object} reducer - reduce stream generator. Generator should have a 'stream' method.
	* returns {object|array} instance object or reduce generator list
	*/
	Stream.prototype.reducer = function( name, reducer ) {
		if ( !arguments.length ) {
			return Object.keys( this._reducers );
		}
		if ( arguments.length < 2 ) {
			throw new Error( 'insufficient input arguments. Must supply both a generator name and an object having a \'stream\' method.' );
		}
		this._reducers[ name ] = reducer;
		return this;
	}; // end METHOD reducer()

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
		* @returns {value} transformed data
		*/
		return function transform( data ) {
			return val( data );
		};
	}; // end METHOD transform()

	/**
	* METHOD: stream( data )
	*	Returns a JSON data reduce stream for calculating stats reductions.
	*
	* @param {array} data - array of data arrays
	* @returns {stream} output stream
	*/
	Stream.prototype.stream = function( data ) {
		var dStream, transform, tStream, rStream, pStream, mStream, oStream,
			reducers = this._reducers,
			keys, name,
			pipelines = [];

		// Concatenate all datasets:
		data = concat( data );

		// Create a readable data stream:
		dStream = eventStream.readArray( data );

		// Create the input transform stream:
		transform = flow.transform( this.transform() );

		// Pipe the data stream to the transform:
		tStream = dStream.pipe( transform );

		// Get the reduce stream names:
		keys = Object.keys( reducers );

		// Create stream pipelines...
		for ( var i = 0; i < keys.length; i++ ) {
			name = keys[ i ];

			// Create a new reduce stream:
			rStream = reducers[ name ].stream();

			// Create a stream pipeline:
			pStream = eventStream.pipeline(
				tStream,
				rStream,
				keyify( name )
			);

			// Append the pipeline to a list:
			pipelines.push( pStream );

		} // end FOR i

		// Create a single merged stream from pipeline output:
		mStream = eventStream.merge.apply( {}, pipelines );

		// Wait for all streams to finish before making an object:
		oStream = mStream.pipe( eventStream.wait() )
			.pipe( objectify() );

		// Return the output stream:
		return oStream;
	}; // end METHOD stream()


	// EXPORTS //

	module.exports = Stream;

})();