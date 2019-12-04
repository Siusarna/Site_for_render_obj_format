/* eslint no-undef: 0 */
const formForCheckToken = document.getElementsByClassName('checkToken')[0];
const formForResetPass = document.getElementsByClassName('resetPassword')[0];
const rePass = document.getElementById('re_pass');
const pass = document.getElementById('pass');

const createDataForBody = (formData) => {
  const data = {};

  for (const pair of formData.entries()) {
    data[pair[0]] = pair[1];
  }
  return JSON.stringify(data);
};

const createStatusMessage = (containerName, message) => {
  document.getElementById(containerName).innerText = message;
};

const createOptions = (formName, itemFromLocalStorage) => {
  const formData = new FormData(document.forms[formName]);
  if (itemFromLocalStorage) {
    formData.append(
      itemFromLocalStorage,
      window.localStorage.getItem(itemFromLocalStorage)
    );
  }

  const data = createDataForBody(formData);
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: data
  };
  return options;
};

document.getElementById('btnForgot').addEventListener('click', () => {
  const url = '/login/forgot';
  const options = createOptions('forgot');
  window.localStorage.setItem('email', JSON.parse(options.body).email);
  fetch(url, options).then(async (response) => {
    if (response.status === 200) {
      formForCheckToken.style.display = 'block';
      document.getElementsByClassName('login-form')[0].style.display = 'none';
    } else {
      const result = await response.json();
      createStatusMessage('errorEmail', result.message);
    }
  });
});

document.getElementById('btnSendAnswer').addEventListener('click', () => {
  const options = createOptions('sendToken', 'email');
  const url = '/login/checkToken';
  fetch(url, options).then(async (response) => {
    if (response.status === 200) {
      formForResetPass.style.display = 'block';
      formForCheckToken.style.display = 'none';
    } else {
      const result = await response.json();
      createStatusMessage('errorToken', result.message);
    }
  });
});

rePass.addEventListener('input', () => {
  if (rePass.value === pass.value) {
    errorRePass.innerText = '';
    errorRePass.className = 'error';
  }
});

const checkPass = () => {
  let flag = true;
  if (rePass.value !== pass.value) {
    createStatusMessage('errorRePass', 'Passwords must match.');
    flag = false;
  }
  if (pass.value.length < 6) {
    createStatusMessage('errorRePass', 'Password must be at least 6 characters long.');
    flag = false;
  }
  return flag;
};

document.getElementById('btnResetPassword').addEventListener('click', () => {
  if (!checkPass()) return;
  const url = '/login/resetPassword';
  const options = createOptions('resetPassword', 'email');
  fetch(url, options).then(async (response) => {
    if (response.status === 200) {
      window.location.pathname = '/login';
    }
  });
});
