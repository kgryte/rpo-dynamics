#!/usr/bin/env node
/**
*
*	SERVER
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
*		- 2014/04/21: Created. [AReines].
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
*	AUTHOR:
*		Athan Reines. athan@nodeprime.com. 2014.
*
*
*/

(function() {
	'use strict';

	// MODULES //

	var // Package information:
		pkginfo = require( 'pkginfo' ),

		// Express middleware:
		express = require( 'express' ),

		// Main application:
		main = require( './../app' );


	// PROCESS //

	process.title = pkginfo.read( require.main ).package.name;
	console.info( 'INFO:' + process.title + ':node process id: ' + process.pid + '...' );

	
	// VIRTUAL HOST SERVER //

	var app = express();

	app.use( express.vhost( 'r.po', main ) )
		.listen( 8000 );

	console.info( 'INFO:' + process.title + ':server initialized. Virtual host server is listening for requests on port: 8000...' );

})();



