#!/usr/bin/env node
/**
*
*	UTILS: calculate
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
*		- 2014/05/03: Created. [AReines].
*		- 2014/05/12: Made executable. [AReines].
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
*
*/

(function() {
	'use strict';

	// MODULES //

	var // Module to execute functions serially:
		queue = require( './../app/utils/queue.js' ),

		// Module to run output streams:
		stream = require( './../app/utils/streams/output' );

	
	// BUILD //

	/**
	* FUNCTION: build()
	*
	*/
	function build() {
		// Run the execution queue:
		queue([
			stream
		]);
	} // end FUNCTION build()
	

	// RUN //

	build();

})();