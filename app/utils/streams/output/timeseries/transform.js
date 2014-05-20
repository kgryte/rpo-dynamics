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

	var // JSON stream transform:
		transformer = require( './../../json/transform.js' );


	// TRANSFORM //

	/**
	* FUNCTION: Transform()
	*	Transform constructor.
	*
	* @returns {object} Transform instance
	*/
	function Transform() {

		this.type = 'timeseries';

		this._metric = {
			value: function( d ) {
				return d.y;
			}
		};

		// ACCESSORS:
		this._xValue = function( d ) {
			return d.x;
		};

		return this;
	} // end FUNCTION transform()

	/**
	* METHOD: x( fcn )
	*	x-value accessor setter and getter. If a function is supplied, sets the x-value accessor. If no function is supplied, returns the x-value accessor.
	*
	* @param {function} fcn - x-value accessor
	* @returns {object|function} instance object or x-value accessor
	*/
	Transform.prototype.x = function ( fcn ) {
		if ( !arguments.length ) {
			return this._xValue;
		}
		this._xValue = fcn;
		return this;
	}; // end METHOD x()

	/**
	* METHOD: metric( metric )
	*	Metric setter and getter. If a metric instance is supplied, sets the metric. If no metric is supplied, returns the instance metric.
	*
	* @param {object} metric - an object with a 'value' method; see constructor for basic example
	* @returns {object|object} instance object or instance metric
	*/
	Transform.prototype.metric = function ( metric ) {
		if ( !arguments.length ) {
			return this._metric;
		}
		if ( !metric.hasOwnProperty( 'value' ) ) {
			throw new Error( 'metric()::invalid input argument. Metric must be an object with a \'value\' method.' );
		}
		this._metric = metric;
		return this;
	}; // end METHOD metric()

	/**
	* METHOD: transform()
	*	Returns a data transformation function.
	*
	* @returns {function} data transformation function
	*/
	Transform.prototype.transform = function() {
		var x = this._xValue,
			y = this._metric.value;
		/**
		* FUNCTION: transform( data )
		*	Defines the data transformation.
		*
		* @param {object} data - JSON stream data
		* @returns {array} transformed data
		*/
		return function transform( data ) {
			return [
				x( data ),
				y( data )
			];
		};
	}; // end METHOD transform()

	/**
	* METHOD: stream()
	*	Returns a JSON data transform stream for calculating the timeseries transform.
	*/
	Transform.prototype.stream = function() {
		return transformer( this.transform() );
	}; // end METHOD stream()


	// EXPORTS //

	module.exports = Stream;

})();