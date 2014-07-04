/**
*
*	STREAM: transform
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

	var // Flow map transform stream:
		transform = require( 'flow.io' ).map;

	// FUNCTIONS //

	/**
	* FUNCTION: map( x, y )
	*	Returns a data transformation function.
	*
	* @private
	* @param {function} x - x-value accessor
	* @param {function} y - y-value accessor
	* @returns {function} data transformation function
	*/
	function map( x, y ) {
		/**
		* FUNCTION: map( data )
		*	Defines the data transformation.
		*
		* @private
		* @param {*} data - JSON stream data
		* @returns {array} transformed data
		*/
		return function map( data ) {
			return [
				x( data ),
				y( data )
			];
		};
	} // end METHOD map()

	
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

		// ACCESSORS:
		this._xValue = function( d ) {
			return d.x;
		};
		this._yValue = function( d ) {
			return d.y;
		};

		return this;
	} // end FUNCTION Stream()

	/**
	* ATTRIBUTE: type
	*	Defines the stream type.
	*/
	Stream.prototype.type = 'timeseries';

	/**
	* METHOD: x( fcn )
	*	x-value accessor setter and getter. If a function is supplied, sets the x-value accessor. If no function is supplied, returns the x-value accessor.
	*
	* @param {function} fcn - x-value accessor
	* @returns {object|function} instance object or x-value accessor
	*/
	Stream.prototype.x = function ( fcn ) {
		if ( !arguments.length ) {
			return this._xValue;
		}
		this._xValue = fcn;
		return this;
	}; // end METHOD x()

	/**
	* METHOD: metric( metric )
	*	Metric setter and getter. If a metric instance is supplied, sets the metric. If no metric is supplied, returns the instance metric value function.
	*
	* @param {object} metric - an object with a 'value' method; see constructor for basic example. If the metric has a name property, sets the transform name.
	* @returns {object|object} instance object or instance metric
	*/
	Stream.prototype.metric = function ( metric ) {
		if ( !arguments.length ) {
			return this._yValue;
		}
		if ( !metric.value ) {
			throw new Error( 'metric()::invalid input argument. Metric must be an object with a \'value\' method.' );
		}
		// Extract the method to calculate the metric value and bind the metric context:
		this._yValue = metric.value.bind( metric );
		// If the metric has a name, set the transform name:
		this.name = ( metric.name ) ? metric.name : '';
		// Return the transform instance:
		return this;
	}; // end METHOD metric()

	/**
	* METHOD: stream()
	*	Returns a JSON data transform stream for calculating the timeseries transform.
	*
	* @returns {stream} transform stream
	*/
	Stream.prototype.stream = function() {
		var mapper = map( this._xValue, this._yValue );
		return transform().map( mapper )
			.stream();
	}; // end METHOD stream()


	// EXPORTS //

	module.exports = function createStream() {
		return new Stream();
	};

})();