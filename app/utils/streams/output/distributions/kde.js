/**
*
*	STREAM: kernel density estimate (KDE)
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

	var // JSON stream transform:
		transformer = require( './../../json/transform.js' ),

		// Module to calculate the KDE:
		KDE = require( './../../stats/kde' );


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

		this.type = 'kde';
		this.name = '';

		// TODO: include these methods here, in the histogram, and in the KDE stream.

		// this._min = 0;
		// this._max = 1;
		// this._pts = 256;

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
	* METHOD: stream()
	*	Returns a JSON data transform stream for calculating the statistic.
	*/
	Transform.prototype.stream = function() {
		var transform, kde, ioStreams;

		// Create the input transform stream:
		transform = transformer( this.transform() );

		// Create a KDE stream generator and configure:
		kde = new KDE();

		// Get the KDE input/output streams:
		ioStreams = kde.stream();

		// Pipe the transform output into the KDE input stream:
		transform.pipe( ioStreams[ 0 ] );

		// Return the start and end streams:
		return [ transform, ioStreams[ 1 ] ];
	}; // end METHOD stream()


	// EXPORTS //

	module.exports = Transform;

})();