$('#addMemBtn, .modal__close').on('click', function(e){
	$('.modal').toggleClass('modal--show')
	$('.modal__fade').toggleClass('modal__fade--show')
	$('.modal__container').toggleClass('modal__container--show')
}
)