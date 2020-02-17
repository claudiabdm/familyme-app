// Show or hide password text

const pswd = document.getElementById('password');
const eye = document.getElementById('eye');

function showPswd() {
  if (pswd.type === 'password') {
    pswd.type = 'text';
    eye.classList = 'icon icon-red_eye icon--pswd icon--sm';
  } else {
    pswd.type = 'password';
    eye.classList = 'icon icon-red_eye_close icon--pswd icon--sm';
  }
}

eye.addEventListener('click', showPswd);
