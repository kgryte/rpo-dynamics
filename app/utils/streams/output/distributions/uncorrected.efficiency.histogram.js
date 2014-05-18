/**
*
*	STREAM: (uncorrected) efficiency histogram
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
*		- 2014/05/12: Created. [AReines].
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

		// Module to calculate the histsogram counts:
		Histc = require( './../../stats/histc' );


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


	// STREAM //

	/**
	* FUNCTION: Stream()
	*	Stream constructor.
	*
	* @returns {object} Stream instance
	*/
	function Stream() {

		// INSTANCE ATTRIBUTES:

		this.name = 'uncorrected.efficiency';
		this.type = 'histogram';

		// this._edges = linspace( -0.01, 1.01, 0.02 );

		// ACCESSORS:
		this._xValue = function( d ) {
			return d.x;
		};
		this._yValue0 = function( d ) {
			return d.y[ 0 ];
		};
		this._yValue1 = function( d ) {
			return d.y[ 1 ];
		};

		return this;
	} // end FUNCTION stream()

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
	* METHOD: y0( fcn )
	*	y-value (donor excitation, donor emission) accessor setter and getter. If a function is supplied, sets the y-value accessor. If no function is supplied, returns the y-value accessor.
	*
	* @param {function} fcn - y-value accessor
	* @returns {object|function} instance object or y-value accessor
	*/
	Stream.prototype.y0 = function ( fcn ) {
		if ( !arguments.length ) {
			return this._yValue0;
		}
		this._yValue0 = fcn;
		return this;
	}; // end METHOD y0()

	/**
	* METHOD: y1( fcn )
	*	y-value (donor excitation, acceptor emission) accessor setter and getter. If a function is supplied, sets the y-value accessor. If no function is supplied, returns the y-value accessor.
	*
	* @param {function} fcn - y-value accessor
	* @returns {object|function} instance object or y-value accessor
	*/
	Stream.prototype.y1 = function ( fcn ) {
		if ( !arguments.length ) {
			return this._yValue1;
		}
		this._yValue1 = fcn;
		return this;
	}; // end METHOD y1()

	/**
	* METHOD: metric( data )
	*	Calculates the (uncorrected) transfer efficiency between donor and acceptor fluorophores.
	*
	* @see [Journal Paper]{@link http://www.ncbi.nlm.nih.gov/pmc/articles/PMC1282518/}
	*
	* @param {object} data - data object containing intensity values
	* @returns {number} (uncorrected) calculated transfer efficiency
	*/
	Stream.prototype.metric = function ( data ) {
		var // Donor-excitation donor-emission intensity: 
			dexdem = this._yValue0( data ),
			// Donor-excitation acceptor-emission intensity: 
			dexaem = this._yValue1( data ),
			// Total donor-excitation emission intensity:
			total = dexdem + dexaem;
		// Calculated transfer efficiency:
		return dexaem / total;
	}; // end METHOD metric()

	/**
	* METHOD: transform()
	*	Returns a data transformation function.
	*
	* @returns {function} data transformation function
	*/
	Stream.prototype.transform = function() {
		var self = this;
		/**
		* FUNCTION: transform( data )
		*	Defines the data transformation.
		*
		* @param {object} data - JSON stream data
		* @returns {number} transformed data value
		*/
		return function transform( data ) {
			return self.metric( data );
		};
	}; // end METHOD transform()

	/**
	* METHOD: stream()
	*	Returns a JSON data transform stream for calculating the statistic.
	*/
	Stream.prototype.stream = function() {
		var transform, histc, ioStreams;

		// Create the input transform stream:
		transform = transformer( this.transform() );

		// Create a histogram counts stream generator and configure:
		histc = new Histc();

		// Get the histogram input/output streams:
		ioStreams = histc.stream();

		// Pipe the transform output into the histogram input stream:
		transform.pipe( ioStreams[ 0 ] );

		// Return the start and end streams:
		return [ transform, ioStreams[ 1 ] ];
	}; // end METHOD stream()


	// EXPORTS //

	module.exports = Stream;

})();