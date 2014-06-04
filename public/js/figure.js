



(function(){
	'use strict';

	// FIGURE //

	var figures = document.querySelectorAll( 'figure' );

	for ( var f = 0; f < figures.length; f++ ) {
		figures[ f ].classList.add( 'clearfix' );
	}

	// SORTABILITY //

	var selections = document.querySelectorAll( '[data-sortable="1"]' );

	for ( var i = 0; i < selections.length; i++ ) {
		$( selections[ i ] ).sortable({
			'delay': 150,
			'items': '.canvas'
		});
	} // end FOR i

})();