/**
*
*	STREAM: moving mean
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
*		- 2014/05/27: Created. [AReines].
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

	var // Through module:
		through = require( 'through' );


	// FUNCTIONS //

	/**
	* FUNCTION: getBuffer( W )
	*	Returns a buffer array where each element is pre-initialized to zero.
	*
	* @param {number} W - buffer size
	* @returns {array} buffer
	*/
	function getBuffer( W ) {
		var buffer = new Array( W );
		for ( var i = 0; i < buffer.length; i++ ) {
			buffer[ i ] = 0;
		}
		return buffer;
	} // end FUNCTION getBuffer()


	// STREAM //

	/**
	* FUNCTION: Stream()
	*	Stream constructor.
	*
	* @returns {object} Stream instance
	*/
	function Stream() {
		this._window = 5;
		return this;
	} // end FUNCTION Stream()

	/**
	* METHOD: window( value )
	*	Setter and getter for window size. If a value is provided, sets the window size. If no value is provided, returns the window size.
	*
	* @param {number} value - window size
	* @returns {object|number} instance object or window size
	*/
	Stream.prototype.window = function( value ) {
		if ( !arguments.length ) {
			return this._window;
		}
		this._window = value;
	}; // end METHOD window()

	/**
	* METHOD: stream()
	*	Returns a through stream for calculating the moving mean.
	*/
	Stream.prototype.stream = function() {
		var W = this._window,
			buffer = getBuffer( W ),
			full = false,
			idx = 0,
			oldVal,
			mean = 0, N = 0, delta = 0;

		return through( onData );

		// FUNCTIONS //

		/**
		* FUNCTION: onData( newVal )
		*	Data event handler. Calculates a moving mean.
		*/
		function onData( newVal ) {
			// Fill the buffer:
			if ( !full ) {
				if ( ++idx <= W-1 ) {
					// Start at idx=1 to allow fall-through to moving mean calculation below. In the first calculation, we shift off a zero value and push the new value, filling our buffer.
					buffer[ idx ] = newVal;

					// Update the mean:
					N += 1;
					delta = newVal - mean;
					mean += delta / N;
					return;
				}
				full = true;
			}

			// Update our buffer:
			oldVal = buffer.shift();
			buffer.push( newVal );

			// Calculate the moving mean:
			delta = newVal - oldVal;
			mean += delta / W;

			// Queue the mean value:
			this.queue( mean );
		} // end FUNCTION onData()

	}; // end METHOD stream()


	// EXPORTS //

	module.exports = Stream;

})();