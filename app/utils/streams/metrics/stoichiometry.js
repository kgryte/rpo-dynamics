/**
*
*	STREAM: stoichiometry
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
*		- 2014/05/11: Created. [AReines].
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
		transformer = require( './../json_transform.js' );


	// STREAM //

	/**
	* FUNCTION: Stream()
	*	Stream constructor.
	*
	* @returns {object} Stream instance
	*/
	function Stream() {

		this.name = 'uncorrected.stoichiometry';
		this.type = 'timeseries';

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
		this._yValue2 = function( d ) {
			return d.y[ 2 ];
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
	* METHOD: y2( fcn )
	*	y-value (acceptor excitation, acceptor emission) accessor setter and getter. If a function is supplied, sets the y-value accessor. If no function is supplied, returns the y-value accessor.
	*
	* @param {function} fcn - y-value accessor
	* @returns {object|function} instance object or y-value accessor
	*/
	Stream.prototype.y2 = function ( fcn ) {
		if ( !arguments.length ) {
			return this._yValue2;
		}
		this._yValue2 = fcn;
		return this;
	}; // end METHOD y2()

	/**
	* METHOD: metric( data )
	*	Calculates the (uncorrected) stoichiometric ratio between donor and acceptor fluorophores.
	*
	* @see [Journal Paper]{@link http://www.ncbi.nlm.nih.gov/pmc/articles/PMC1282518/}
	*
	* @param {object} data - data object containing intensity values
	* @returns {number} (uncorrected) calculated stoichiometry
	*/
	Stream.prototype.metric = function ( data ) {
		var // Donor-excitation donor-emission intensity: 
			dexdem = this._yValue0( data ),
			// Donor-excitation acceptor-emission intensity: 
			dexaem = this._yValue1( data ),
			// Acceptor-excitation acceptor-emission intensity: 
			aexaem = this._yValue2( data ),
			// Total donor-excitation emission intensity:
			num = dexdem + dexaem,
			// Total emission intensity:
			denom = num + aexaem;
		// Calculated stoichiometry ratio:
		return num / denom;
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
		* @returns {array} transformed data
		*/
		return function transform( data ) {
			return [
				self._xValue( data ),
				self.metric( data )
			];
		};
	}; // end METHOD transform()

	/**
	* METHOD: stream()
	*	Returns a JSON data transform stream for calculating the stoichiometry.
	*/
	Stream.prototype.stream = function() {
		return transformer( this.transform() );
	}; // end METHOD stream()


	// EXPORTS //

	module.exports = Stream;

})();