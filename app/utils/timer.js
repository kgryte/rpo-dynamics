/**
*
*	UTILS: timer
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
*		- 2014/05/26: Created. [AReines].
*
*
*	DEPENDENCIES:
*		[1] 
*
*
*	LICENSE:
*		
*
*	Copyright (c) 2014. Athan Reines.
*
*
*	AUTHOR:
*		Athan Reines. athan@nodeprime.com. 2014.
*
*
*/

(function() {
	'use strict';

	// TIMER //

	/**
	* FUNCTION: Timer()
	*	Constructor.
	*/
	function Timer() {
		this._start = null;
		this._end = null;
		this._splits = {};
		return this;
	} // end FUNCTION timer()

	/**
	* METHOD: start()
	*	Starts the timer.
	*
	* @returns {number} start time in milliseconds
	*/
	Timer.prototype.start = function() {
		this._start = Date.now();
		return this._start;
	}; // end METHOD start()

	/**
	* METHOD: split( id )
	*	Returns the time elapsed since instance instantiation.
	*
	* @param {string} id - split identifier; e.g., build step name
	* @returns {number} elapsed time in seconds
	*/
	Timer.prototype.split = function( id ) {
		var now = Date.now();
		this._splits[ id ] = ( now-this._start ) / 1000;
		return this._splits[ id ];
	}; // end METHOD split()

	/**
	* METHOD: splits()
	*	Returns split times.
	*
	* @returns {string} stringified object where split times are in seconds.
	*/
	Timer.prototype.splits = function() {
		return JSON.stringify( this._splits );
	}; // end METHOD splits()

	/**
	* METHOD: stop()
	*	Returns the time elapsed since instance instantiation.
	*
	* @returns {number} elapsed time in seconds
	*/
	Timer.prototype.stop = function() {
		this._end = Date.now();
		return this._end;
	}; // end METHOD stop()

	/**
	* METHOD: total()
	*	Returns the time elapsed since instance instantiation.
	*
	* @returns {number} elapsed time in seconds
	*/
	Timer.prototype.total = function() {
		return ( this._end-this._start ) / 1000;
	}; // end METHOD total()


	// EXPORTS //

	module.exports = Timer;

})();