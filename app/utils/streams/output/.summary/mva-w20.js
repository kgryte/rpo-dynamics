/**
*
*	STREAM: MVA (window: 20)
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
*		- 2014/05/28: Created. [AReines].
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

		// Flow streams:
		flow = require( 'flow.io' );


	// TRANSFORM //

	/**
	* FUNCTION: Transform()
	*	Transform constructor.
	*
	* @returns {object} Transform instance
	*/
	function Transform() {

		this.type = 'mva-w20';
		this.name = '';

		this._window = 20;

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
	*	Returns a JSON data transform stream for performing MVA.
	*
	* @param {array} data - array of data arrays
	* @returns {stream} output stream
	*/
	Transform.prototype.stream = function( data ) {
		var mva, dStream, transform, mStream, pStream, cStream, oStream, pipelines = [];

		// Create an MVA stream generator and configure:
		mva = flow.mva();
		mva.window( this._window );

		for ( var i = 0; i < data.length; i++ ) {

			// Create a readable data stream:
			dStream = eventStream.readArray( data[ i ] );

			// Create the input transform stream:
			transform = flow.transform( this.transform() );

			// Create an MVA stream:
			mStream = mva.stream();

			// Create a stream pipeline:
			pStream = eventStream.pipeline(
				dStream,
				transform,
				mStream
			);

			// Append the pipeline to our list of pipelines:
			pipelines.push( pStream );

		} // end FOR i

		// Create a single merged stream from pipeline output:
		cStream = eventStream.merge.apply( {}, pipelines );

		// Create the output stream:
		oStream = cStream.pipe( flow.stringify() );

		// Return the output stream:
		return oStream;
	}; // end METHOD stream()


	// EXPORTS //

	module.exports = Transform;

})();