// Check password are the same

let pswdConf = document.getElementById('passwordCreateConfirm');

pswdConf.addEventListener('blur', confPswd);

function confPswd(e) {
    const pswd = document.getElementById('passwordCreate');
    const conf = e.target;
    if (pswd.value !== conf.value ) {
        conf.className = 'form__control form__control--invalid';
    } else {
        conf.className = 'form__control';
    }
}

pswdConf = document.getElementById('passwordJoinConfirm');

pswdConf.addEventListener('blur', confPswd2);

function confPswd2(e) {
    const pswd = document.getElementById('passwordJoin');
    const conf = e.target;
    if (pswd.value !== conf.value ) {
        conf.className = 'form__control form__control--invalid';
    } else {
        conf.className = 'form__control';
    }
}


