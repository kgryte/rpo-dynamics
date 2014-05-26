/**
*
*	STREAM: kurtosis
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

	var // Stream-combiner:
		pipeline = require( 'stream-combiner' ),

		// JSON stream transform:
		transformer = require( './../../json/transform.js' ),

		// JSON stream reducer:
		reducer = require( './../../json/reduce.js' );


	// STREAM //

	/**
	* FUNCTION: Stream()
	*	Stream constructor.
	*
	* @returns {object} Stream instance
	*/
	function Stream() {
		// Default accumulator values:
		this._values = [ 0, 0, 0, 0 ];
		this._mean = 0;
		this._N = 0;

		return this;
	} // end FUNCTION stream()

	/**
	* METHOD: values( seeds )
	*	Setter and getter for initial values from which to begin accumulation. If a value array is provided, sets the initial values. If no array is provided, returns the initial values.
	*
	* @param {array} seeds - 4-element array with the following differences raised to powers: [ M1, M2, M3, M4 ]. E.g., M1 = x-mu; M2 = (x-mu)^2; M3 = (x-mu)^3; M4 = (x-mu)^4.
	* @returns {object|array} instance object or initial values
	*/
	Stream.prototype.values = function( values ) {
		var arr;
		if ( !arguments.length ) {
			// Return a copy:
			values = this._values;
			arr = new Array( values.length );
			for ( var i = 0; i < values; i++ ) {
				arr[ i ] = values[ i ];
			}
			return arr;
		}
		this._values = values;
	}; // end METHOD values()

	/**
	* METHOD: mean( value )
	*	Setter and getter for initial mean value used during accumulation. If a value is provided, sets the initial mean value. If no value is provided, returns the mean value.
	*
	* @param {number} value - initial mean value
	* @returns {object|number} instance object or initial value
	*/
	Stream.prototype.mean = function( value ) {
		if ( !arguments.length ) {
			return this._mean;
		}
		this._mean = value;
	}; // end METHOD mean()

	/**
	* METHOD: numValues( value )
	*	Setter and getter for the total number of values the initial value for accumulation represents. If a value is provided, sets the number of values. If no value is provided, returns the number of values.
	*
	* @param {number} value - initial value number
	* @returns {object|number} instance object or initial value number
	*/
	Stream.prototype.numValues = function( value ) {
		if ( !arguments.length ) {
			return this._N;
		}
		this._N = value;
	}; // end METHOD numValues()

	/**
	* METHOD: reduce()
	*	Returns a data reduction function.
	*
	* @returns {function} data reduction function
	*/
	Stream.prototype.reduce = function() {
		var self = this,
			N = this._N,
			mean = this._mean,
			M = this._values,
			M1 = M[ 0 ],
			M2 = M[ 1 ],
			M3 = M[ 2 ],
			delta = 0,
			delta_n = 0,
			delta_n2 = 0,
			term1 = 0,
			val = 0;
		/**
		* FUNCTION: reduce( acc, data )
		*	Defines the data reduction.
		*
		* @param {number} acc - the value accumulated
		* @param {number} data - numeric stream data
		* @returns {number} reduced data
		*/
		return function reduce( M4, x ) {
			N += 1;

			delta = x - mean;
			delta_n = delta / N;
			delta_n2 = delta_n * delta_n;

			term1 = delta * delta_n * (N-1);

			M4 += term1*delta_n2*(N*N - 3*N + 3 ) + 6*delta_n2*M2 - 4*delta_n*M3;
			M3 += term1*delta_n*(N-2) - 3*delta_n*M2;
			M2 += term1;
			M1 += delta;
			mean += delta_n;

			self._N = N;
			self._mean = mean;
			self._values = [ M1, M2, M3, M4 ];

			return M4;
		};
	}; // end METHOD reduce()

	/**
	* METHOD: transform()
	*	Returns a data transformation function to calculate the kurtosis.
	*
	* @returns {function} data transformation function
	*/
	Stream.prototype.transform = function() {
		var self = this;
		/**
		* FUNCTION: transform( data )
		*	Defines the data transformation.
		*
		* @param {object} data - stream data
		* @returns {value} transformed data
		*/
		return function transform( M4 ) {
			var M = self._values;
			return self._N*M4 / ( M[1]*M[1] ) - 3;
		};
	}; // end METHOD transform()

	/**
	* METHOD: stream()
	*	Returns a JSON data reduction stream for calculating the statistic.
	*/
	Stream.prototype.stream = function() {
		var rStream, pStream;

		// Get the reduction stream:
		rStream = reducer( this.reduce(), this._values[ 3 ] );

		pStream = pipeline(
			rStream,
			transformer( this.transform() )
		);

		return pStream;
	}; // end METHOD stream()


	// EXPORTS //

	module.exports = Stream;

})();