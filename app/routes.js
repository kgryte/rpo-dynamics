/**
*
*	APP: routes
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
*
*	AUTHOR:
*		Athan Reines. athan@nodeprime.com. 2014.
*
*
*/


(function() {
	'use strict';

	// MODULES //

	var // Path module:
		path = require( 'path' ),

		// Lodash module which provides a swiss-army knife of JavaScript utility functions:
		_ = require( 'lodash' ),

		// Document partials:
		partials = require( './utils/partials.js' )( path.join( __dirname, 'partials' ) ),

		// Condition mapping:
		MAPPING = require( './utils/mapping.js' ),

		// Directory encoding model:
		model = require( './../public/data/encoding.json' );


	// INIT //

	var partial,
		ids = Object.keys( MAPPING ),
		id, name,
		headers = [],
		rows = [],
		total;

	for ( var i = 0; i < model.length; i++ ) {
		headers.push( model[ i ].name );
	}

	for ( var j = 0; j < ids.length; j++ ) {

		rows.push([]);
		id = ids[ j ];
		total = Math.min( id.length, model.length );

		rows[ j ].push( id );

		for ( var k = 0; k < total; k++ ) {
			name = model[ k ].options[ id[k] ].name;
			rows[ j ].push( name );
		}
	}

	partial = _.template( partials.index,{
		'headers': headers,
		'rows': rows
	});


	// ROUTES //

	var routes = function ( clbk ) {

		// NOTE: the 'this' context is the application.

		this.get( '/', function onRequest( request, response ) {
			response.writeHead( 200, {
				'Content-Type': 'text/html'
			});
			response.write( partial );
			response.end();
		});

		// Conditions:
		this.get( '/conditions', function onRequest( request, response ) {
			response.writeHead( 200, {
				'Content-Type': 'application/json'
			});
			response.write( JSON.stringify( MAPPING ) );
			response.end();
		});

		// Base route returns a description:
		this.get( '/conditions/:condition', function onRequest( request, response ) {

			var condition = request.params.condition;

			response.writeHead( 200, {
				'Content-Type': 'text/plain'
			});
			response.write( MAPPING[ condition ] );
			response.end();
		});

		// Conditions encoding:
		this.get( '/encoding', function onRequest( request, response ) {
			response.writeHead( 200, {
				'Content-Type': 'application/json'
			});
			response.write( JSON.stringify( model ) );
			response.end();
		});

		// Callback:
		clbk();

	}; // end ROUTES


	// EXPORTS //

	module.exports = routes;

})();