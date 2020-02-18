function showModal(modalElem) {
  // $('.container').toggleClass('container--hidden');
  $(modalElem).toggleClass('modal--show');
  $('.modal__fade').toggleClass('modal__fade--show');
  $('.modal__container').toggleClass('modal__container--show');
}

// --- BUTTONS LISTENERS --- //

$('#newMemberBtn').click(function () {
  const modalElem = $('#newMemberModal');
  showModal(modalElem);
})

$('#settingsBtn').click(function () {
  const modalElem = $('#settingsModal');
  showModal(modalElem);
})

$('#imgBtn').click(function () {
  const modalElem = $('#editPhotoModal');
  showModal(modalElem);
})

$('#createBtn').click(function () {
  const modalElem = $('#createModal');
  showModal(modalElem);
})

$('#joinBtn').click(function () {
  const modalElem = $('#joinModal');
  showModal(modalElem);
})

$('#newEventBtn').click(function () {
  const modalElem = $('#newEventModal');
  showModal(modalElem);
})

$('#addInviteeBtn').click(function () {
  const modalElem = $('#addInviteeModal');
  showModal(modalElem);
})

$('.modal__close').click(() => {
  $('.modal').removeClass('modal--show');
  // $('.container').removeClass('container--hidden');
})