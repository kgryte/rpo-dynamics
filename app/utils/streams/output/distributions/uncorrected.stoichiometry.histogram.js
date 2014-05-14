/**
*
*	STREAM: (uncorrected) stoichiometry histogram
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

	var // Module for creating sink streams:
		Sink = require( 'pipette' ).Sink,

		// JSON stream transform:
		transformer = require( './../../json/transform.js' ),

		// Module to determine bin location:
		getBin = require( './../../../histc/binarysearch.js' );


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

		this.name = 'uncorrected.stoichiometry';
		this.type = 'histogram';

		this._edges = linspace( -0.01, 1.01, 0.02 );

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
	* METHOD: edges( vector )
	*	Edges setter and getter. If a vector is supplied, sets edges. If no vector is supplied, returns the edges.
	*
	* @param {array} vector - edges
	* @returns {object|vector} instance object or edges
	*/
	Stream.prototype.edges = function ( vector ) {
		if ( !arguments.length ) {
			return this._edges;
		}
		this._edges = vector;
		return this;
	}; // end METHOD edges()

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
		* @returns {string} transformed data as a comma-delimited string. (note: the last-value is followed by a comma)
		*/
		return function transform( data ) {
			data = self.metric( data );
			return getBin( self._edges, data ) + ',';
		};
	}; // end METHOD transform()

	/**
	* METHOD: tabulate()
	*	Returns a data transformation function to tabulate bin counts.
	*
	* @returns {function} data transformation function
	*/
	Stream.prototype.tabulate = function() {
		var self = this,
			numBins = self._edges.length + 1, // include -/+ infinity bins
			counts = new Array( numBins );

		for ( var i = 0; i < numBins; i++ ) {
			counts[ i ] = [
				self._edges[ i-1 ],
				0,
				self._edges[ i ]
			];
		} // end FOR i

		/**
		* FUNCTION: transform( data )
		*	Defines the data transformation.
		*
		* @param {object} data - JSON stream data
		* @returns {array} transformed data
		*/
		return function transform( data ) {
			var idx;
			data = data.split( ',' );
			data.pop();
			for ( var i = 0; i < data.length; i++ ) {
				idx = parseInt( data[ i ], 10 ) + 1;
				counts[ idx ][ 1 ] += 1;
			}
			return JSON.stringify( counts );
		};
	}; // end METHOD transform()

	/**
	* METHOD: stream()
	*	Returns a JSON data transform stream for calculating the statistic.
	*/
	Stream.prototype.stream = function() {
		var iStream, sink, oStream;

		// Create the input transform stream:
		iStream = transformer( this.transform() );

		// Send the input stream to a sink, where the data is encoded as standard unicode data:
		sink = new Sink( iStream, { 'encoding': 'utf8' } );

		// Pipe the data collected in the sink to an output transform stream:
		oStream = sink.pipe( transformer( this.tabulate() ) );

		// Return the io streams:
		return [ iStream, oStream ];
	}; // end METHOD stream()


	// EXPORTS //

	module.exports = Stream;

})();