/* eslint no-undef: 0 */
const rePass = document.getElementById('re_pass');
const pass = document.getElementById('password');
const divForMessage = document.getElementById('error');
const register = document.getElementById('register');
const email = document.getElementById('email');
const name = document.getElementById('name');
const errorName = document.getElementById('errorName');
const errorEmail = document.getElementById('errorEmail');
const errorRePass = document.getElementById('errorRePass');

const showMessage = (message) => {
  divForMessage.style.color = 'red';
  divForMessage.innerText = message;
  divForMessage.style.display = 'block';
  setTimeout(() => {
    divForMessage.style.display = 'none';
  }, 3000);
};

// valid name
name.addEventListener('input', () => {
  if (name.value.length > 2) {
    errorName.innerText = '';
    errorName.className = 'error';
  }
});
// valid email
email.addEventListener('input', () => {
  if (!email.validity.typeMismatch) {
    errorEmail.innerText = '';
    errorEmail.className = 'error';
  }
});
// valid repeat Password
rePass.addEventListener('input', () => {
  if (rePass.value === pass.value) {
    errorRePass.innerText = '';
    errorRePass.className = 'error';
  }
});

const createDataForBody = (formData) => {
  const data = {};

  for (const pair of formData.entries()) {
    data[pair[0]] = pair[1];
  }
  return JSON.stringify(data);
};

const checkValidAllInput = () => {
  let flag = true;
  if (rePass.value !== pass.value && !pass.validity.valid) {
    errorRePass.innerText = 'Passwords must match.';
    errorRePass.className = 'error active';
    flag = false;
  }
  if (!email.validity.valid) {
    errorEmail.innerText = 'Give me your real email';
    errorEmail.className = 'error active';
    flag = false;
  }
  if (name.value.length < 2) {
    errorName.innerText = 'Give me your real name';
    errorName.className = 'error active';
    flag = false;
  }
  return flag;
};

register.addEventListener('click', () => {
  const formData = new FormData(document.forms.signUp);
  const url = '/signUp/';
  if (!checkValidAllInput()) {
    return;
  }
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: createDataForBody(formData)
  };
  console.log(options);
  fetch(url, options)
    .then((response) => {
      if (response.status === 200) {
        window.location.href = '../login';
      } else {
        showMessage(e);
      }
    })
    .catch((e) => {
      showMessage(e);
    });
});
