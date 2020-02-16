function showModal(modalElem) {
		// $('.container').toggleClass('container--hidden');
		$(modalElem).toggleClass('modal--show');
		$('.modal__fade').toggleClass('modal__fade--show');
		$('.modal__container').toggleClass('modal__container--show');
}

//--- BUTTONS LISTENERS ---//
$('#newMemberBtn').click(function(e){
	const modalElem = $('#newMemberModal');
	showModal(modalElem);
})

$('#settingsBtn').click(function(e){
	const modalElem = $('#settingsModal');
	showModal(modalElem);
})

$('#createBtn').click(function(e){
	const modalElem = $('#createModal');
	showModal(modalElem);
})

$('#joinBtn').click(function(e){
	const modalElem = $('#joinModal');
	showModal(modalElem);
})

$('#newEventBtn').click(function(e){
	const modalElem = $('#newEventModal');
	showModal(modalElem);
})

$('.modal__close').click(() => {
	$('.modal').removeClass('modal--show');
	// $('.container').removeClass('container--hidden');
})