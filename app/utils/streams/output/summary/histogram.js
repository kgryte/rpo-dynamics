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
		flow = require( 'flow.io' );


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


	// TRANSFORM //

	/**
	* FUNCTION: Transform()
	*	Transform constructor.
	*
	* @returns {object} Transform instance
	*/
	function Transform() {

		this.type = 'histogram';
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
		var dStream, transform, histc, hStream, pStream;

		// Concatenate all datasets:
		data = concat( data );

		// Create a readable data stream:
		dStream = eventStream.readArray( data );

		// Create the input transform stream:
		transform = flow.transform( this.transform() );

		// Create a histogram counts stream generator and configure:
		histc = flow.histc();

		// Create a histogram stream:
		hStream = histc.stream();

		// Create a stream pipeline:
		pStream = eventStream.pipeline(
			dStream,
			transform,
			hStream
		);

		// Return the pipeline:
		return pStream;
	}; // end METHOD stream()


	// EXPORTS //

	module.exports = Transform;

})();