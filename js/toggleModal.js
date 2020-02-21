function showModal(modalElem) {
  // $('.container').toggleClass('container--hidden');
  $(modalElem).toggleClass('modal--show');
  $('.modal__fade').toggleClass('modal__fade--show');
  $('.modal__container').toggleClass('modal__container--show');
}

// --- BUTTONS LISTENERS --- //

$('#newMemberBtn').click(() => {
  const modalElem = $('#newMemberModal');
  showModal(modalElem);
});

$('#settingsBtn').click(() => {
  const modalElem = $('#settingsModal');
  showModal(modalElem);
});

$('#imgBtn').click(() => {
  const modalElem = $('#editPhotoModal');
  showModal(modalElem);
});

$('#createBtn').click(() => {
  const modalElem = $('#createModal');
  showModal(modalElem);
});

$('#joinBtn').click(() => {
  const modalElem = $('#joinModal');
  showModal(modalElem);
});

$('#newEventBtn').click(() => {
  const modalElem = $('#newEventModal');
  showModal(modalElem);
});

$('#addInviteeBtn').click(() => {
  const modalElem = $('#addInviteeModal');
  showModal(modalElem);
});

$('#filterBtn').click(() => {
  const modalElem = $('#filterModal');
  showModal(modalElem);
});

$('.modal__close').click((e) => {
  const btn = $(e.currentTarget);
  const modal = btn.parent().parent().parent().parent();
  modal.removeClass('modal--show');
  // $('.container').removeClass('container--hidden');
});
