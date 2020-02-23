function showModal(modalElem) {
  $('body').css('overflow', 'hidden');
  $(modalElem).toggleClass('modal--show');
}

// --- BUTTONS LISTENERS --- //


$('#signUpBtn').click(() => {
  const modalElem = $('#signUpModal');
  showModal(modalElem);
});

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
  $('body').css('overflow', 'auto');
});
