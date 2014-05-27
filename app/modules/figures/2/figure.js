/**
*
*	FIGURE: 2
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

		// Module to create a server-side DOM:
		DOM = require( './../../../utils/dom.js' ),

		// Document partials:
		partials = require( './../../../utils/partials.js' )( path.resolve( __dirname, '../../../partials' ) ),

		// Module to get data:
		getData = require( './../../../utils/data.js' ),

		// Module to generate the figure:
		generator = require( './generator.js' );


	// FIGURE //

	/**
	* FUNCTION: figure( clbk )
	*
	*/
	function figure( clbk ) {

		var ids = [ '00001000', '00001100' ];

		// Initialize a DOM:
		DOM( partials.index, function onWindow( error, window ) {
			var document = window.document,
				selection,
				counter = 0,
				Data = new Array( 4 );

			// Any errors?
			if ( error ) {
				clbk({
					'status': 500,
					'message': 'Internal server error. Unable to generate server-side DOM.'
				});
				console.error( error.stack );
				return;
			} // end IF (error)

			// Get the selection:
			selection = document.querySelector( '.main' );

			// Get data:
			getData( 'raw', [ ids[ 0 ] ], null, null, function onData( error, data ) {
				if ( error ) {
					clbk( error );
					return;
				}
				Data[ 0 ] = data;
				next();
			});
			getData( 'timeseries', [ ids[ 0 ] ], 'uncorrected.efficiency', 'timeseries', function onData( error, data ) {
				if ( error ) {
					clbk( error );
					return;
				}
				Data[ 1 ] = data;
				next();
			});
			getData( 'summary', [ ids[ 0 ] ], 'uncorrected.efficiency', 'kde', function onData( error, data ) {
				if ( error ) {
					clbk( error );
					return;
				}
				Data[ 2 ] = data;
				next();
			});
			getData( 'summary', [ ids[ 1 ] ], 'uncorrected.efficiency', 'kde', function onData( error, data ) {
				if ( error ) {
					clbk( error );
					return;
				}
				Data[ 3 ] = data;
				next();
			});

			return;

			/**
			* FUNCTION: next()
			*
			*/
			function next() {
				if ( ++counter === 4 ) {
					// Generate the figure:
					generator( document, selection, Data, onFigure );
				}
			} // end FUNCTION next()

			/**
			* FUNCTION: onFigure()
			*
			*/
			function onFigure() {
				// Return the document contents to the callback:
				clbk( null, document.innerHTML );

				// Close the DOM window:
				window.close();
			} // end FUNCTION onFigure()
		});
	} // end FIGURE
		

	// EXPORTS //

	module.exports = figure;

})();