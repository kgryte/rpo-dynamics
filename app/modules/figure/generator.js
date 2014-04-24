/**
*
*	FIGURE: generator
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
*		- 2014/04/23: Created. [AReines].
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

	var // xfig figure library:
		xfig = require( './lib/xfig.js' );


	// GENERATOR //

	/**
	*
	*/
	var generator = function( document, selection, data, clbk ) {

		var figure, canvas, annotations, title, graph, histogram, edges, axes, text;

		// [1] Instantiate a new figure generator:
		figure = xfig.figure();

		// Create the figure:
		figure.create( document, selection );

		// [2] Instantiate a new canvas generator and configure:
		canvas = xfig.canvas( figure )
			.width( 1200 )
			.height( 2000 );

		// Create the canvas:
		canvas.create();

		// [3] Instantiate a new annotations generator and configure:
		annotations = xfig.annotations( canvas );

		// Create the annotations element:
		annotations.create();

		// [3.1] Instantiate a new title instance and configure:
		title = annotations.title()
			.position({
				'left': 600,
				'top': 10
			});

		// Create the title element:
		title.create( 'Title' );

		// [4] Instantiate a new graph generator and configure:
		graph = xfig.graph( canvas )
			.width( 500 )
			.height( 350 )
			.position({
				'left': 90,
				'top': 80
			})
			.xMin( 0 )
			.xMax( 1 )
			.yMin( 0 );

		// Create the graph:
		graph.create( 'histogram' );

		// [5] Instantiate a new data generator and configure:
		data = xfig.data( [ data[ '1' ] ] )
			.x( function ( d ) { return d.x; } )
			.y( function ( d ) { return d.y[1] / (d.y[0]+d.y[1]); } );

		// Create edges to define our histogram bins:
		edges = data.linspace( -0.025, 1.025, 0.05 );
		
		// Format the data and histogram the data:
		data.format( 2 )
			.histc( function ( d ) { return d[ 1 ]; }, edges );

		// Bind the data instance to the graph:
		graph.data( data )
			.yMax( data.max( function ( d ) {
				return d[ 1 ];
			}));

		// [6] Instantiate a new histogram generator and configure:
		histogram = xfig.histogram( graph )
			.labels( [ 'data 0' ] );

		// Create the histogram:
		histogram.create();

		// [7] Instantiate a new axes generator and configure:
		axes = xfig.axes( graph )
			.yLabel( 'counts' );

		// Create the axes:
		axes.create();

		// [8] Instantiate a new annotations generator and configure:
		annotations = xfig.annotations( graph );

		// Create the annotations element:
		annotations.create();

		// [8.1] Instantiate a new title instance and configure:
		title = annotations.title()
			.top( -30 )
			.left( 250 );

		// Add a (sub)title:
		title.create( 'Subtitle' );

		// [8.2] Instantiate a new text instance and configure:
		text = annotations.text()
			.width( 200 )
			.height( 100 )
			.top( 50 )
			.left( 310 );

		// Add a text annotation:
		text.create( 'This is another text annotation, which may run multiple lines.' );

		// Finished:
		clbk();

	}; // end GENERATOR


	// EXPORTS //

	module.exports = generator;

})();