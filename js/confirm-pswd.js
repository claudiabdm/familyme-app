const pswdConf = document.getElementById('pswd-confirm');

pswdConf.addEventListener('blur', confPswd);

function confPswd(e) {
    const pswd = document.getElementById('password');
    const conf = e.target;
    if (pswd.value !== conf.value ) {
        conf.className = 'form__control form__control--invalid';
    } else {
        conf.className = 'form__control';
    }
}