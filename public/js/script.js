



(function(){
	'use strict';

	var selections = document.querySelectorAll( '[data-sortable="1"]' );

	for ( var i = 0; i < selections.length; i++ ) {
		$( selections[ i ] ).sortable({
			'delay': 150,
			'items': '.canvas'
		});
	} // end FOR i

})();