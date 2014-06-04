

(function() {
	'use strict';

	var rows = document.querySelectorAll( '.table .condition' );

	for ( var i = 0; i < rows.length; i++ ) {
		rows[ i ].addEventListener( 'click', onClick );
	}

	return;

	/**
	* FUNCTION: onClick( event )
	*	Event handler for clicking on rows in the condition table.
	*
	* @param {object} event - event object
	*/
	function onClick( event ) {
		var parent = event.target.parentNode,
			id = parent.getAttribute( 'data-id' ),

			// TODO: do not hardcode by extract baseurl from current url

			url = 'http://127.0.0.1:1337/summary/' + id;
		window.open( url, '_blank' );
		event.preventDefault();
	} // end FUNCTION onClick()

})();