const eye = document.querySelectorAll('.icon--pswd');

function showPswd(e) {
  const selectedEye = e.currentTarget;
  const elemInput = e.currentTarget.parentNode.children[0];

  if (elemInput.type === 'password') {
    elemInput.type = 'text';
    selectedEye.classList = 'icon icon-red_eye icon--pswd icon--sm';
  } else {
    elemInput.type = 'password';
    selectedEye.classList = 'icon icon-red_eye_close icon--pswd icon--sm';
  }
}

eye.forEach((elem) => elem.onclick = showPswd);
