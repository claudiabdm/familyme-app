const pswd = document.getElementById('password');
const confirm = document.getElementById('pswd-confirm');
const eye = document.getElementById('eye');
const eyeConf = document.getElementById('eyeConf');

function showPswd() {
    if (pswd.type === 'password') {
        pswd.type = 'text';
        confirm.type = 'text';
        eye.classList = "icon icon-color-red_eye icon--pswd icon--sm";
        eyeConf.classList = "icon icon-color-red_eye icon--pswd icon--sm";
    } else {
        pswd.type = 'password';
        confirm.type = 'password';
        eye.classList = "icon icon-color-red_eye_close icon--pswd icon--sm";
        eyeConf.classList = "icon icon-color-red_eye_close icon--pswd icon--sm";
    }
}

eye.onclick = showPswd;
eyeConf.onclick = showPswd;
