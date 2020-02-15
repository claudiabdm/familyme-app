function showModal(modalElem) {
		$(modalElem).toggleClass('modal--show');
		$('.modal__fade').toggleClass('modal__fade--show');
		$('.modal__container').toggleClass('modal__container--show');
}

$('#newMemberBtn').click(function(e){
	const modalElem = $('#newMemberModal');
	showModal(modalElem);
})

$('#settingsBtn').click(function(e){
	const modalElem = $('#settingsModal');
	showModal(modalElem);
})

$('.modal__close').click(() => {
	$('.modal').removeClass('modal--show');
})