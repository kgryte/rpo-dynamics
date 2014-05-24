/**
*
*	STREAM: stats
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
*		- 2014/05/22: Created. [AReines].
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

		// Stream combiner:
		pipeline = require( 'stream-combiner' ),

		// JSON stream transform:
		transformer = require( './../../json/transform.js' ),

		// Stats reduce streams:
		Count = require( './../../stats/count' ),
		Min = require( './../../stats/min' ),
		Max = require( './../../stats/max' ),
		Mean = require( './../../stats/mean' ),
		Variance = require( './../../stats/variance' );


	// FUNCTIONS //

	/**
	* FUNCTION: keyify( key )
	*
	*/
	function keyify( key ) {
		/**
		* FUNCTION: onData( value )
		*
		*/
		function onData( value ) {
			return '"' + key + '": ' + value + ',';
		}
		return transformer( onData );
	} // end FUNCTION keyify()

	/**
	* FUNCTION: objectify()
	*
	*/
	function objectify() {
		/**
		* FUNCTION: onData( keyvalstr )
		*
		*/
		function onData( keyvalstr ) {
			// Valid JSON:
			if ( keyvalstr[ keyvalstr.length-1 ] === ',' ) {
				keyvalstr = keyvalstr.slice( 0, -1 );
			}
			return '{' + keyvalstr + '}';
		}
		return transformer( onData );
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
			'count': new Count(),
			'min': new Min(),
			'max': new Max(),
			'mean': new Mean(),
			'variance': new Variance()
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
	* METHOD: reduce( name, reducer )
	*	Reduce stream generator setter and getter. If no arguments are supplied, returns a list of reduce stream generators. If a name and reducer are supplied, adds the reducer to a reduce stream generator dictionary.
	*
	* @param {string} name - reduce stream generator name; e.g., correlation
	* @param {object} reducer - reduce stream generator. Generator should have a 'stream' method.
	* returns {object|array} instance object or reduce generator list
	*/
	Stream.prototype.reduce = function( name, reducer ) {
		if ( !arguments.length ) {
			return Object.keys( this._reducers );
		}
		if ( arguments.length < 2 ) {
			throw new Error( 'insufficient input arguments. Must supply both a generator name and an object having a \'stream\' method.' );
		}
		this._reducers[ name ] = reducer;
		return this;
	}; // end METHOD reduce()

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
	* METHOD: stream()
	*	Returns a JSON data reduce stream for calculating stats reductions.
	*/
	Stream.prototype.stream = function() {
		var transform, rStream, pStream, mStream, oStream,
			reducers = this._reducers,
			keys, name,
			pipelines = [];

		// Create the input transform stream:
		transform = transformer( this.transform() );

		// Get the reduce stream names:
		keys = Object.keys( reducers );

		// Create stream pipelines...
		for ( var i = 0; i < keys.length; i++ ) {
			name = keys[ i ];

			// Create a new reduce stream:
			rStream = reducers[ name ].stream();

			// Create a stream pipeline:
			pStream = pipeline(
				transform,
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

		// Return the input and output streams:
		return [ transform, oStream ];
	}; // end METHOD stream()


	// EXPORTS //

	module.exports = Stream;

})();