console.log($('#addMemBtn'));

$('#addMemBtn, .modal__close').on('click', function(e){
	$('.modal').toggleClass('modal--show')
	$('.modal__container').toggleClass('modal__container--show')
}
)