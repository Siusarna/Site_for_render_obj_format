/* eslint no-undef: 0 */
const aWithIdForgot = document.getElementById('forgot');
const formForCheckToken = document.getElementsByClassName('checkToken')[0];
const formForResetPass = document.getElementsByClassName('resetPassword')[0];
const divForMessage = document.getElementById('status');

const storeToken = (name, token, time) => {
  const date = new Date(Date.now() + time * 1000);
  options = {
    path: '/',
    expires: date.toUTCString()
  };
  let updatedCookie =
    encodeURIComponent(name) + '=' + encodeURIComponent(token);
  for (const optionKey in options) {
    updatedCookie += '; ' + optionKey;
    const optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += '=' + optionValue;
    }
  }
  document.cookie = updatedCookie;
};

document.getElementById('cancel').addEventListener('click', () => {
  window.location.pathname = '/';
});

const createDataForBody = (formData) => {
  const data = {};

  for (const pair of formData.entries()) {
    data[pair[0]] = pair[1];
  }
  return JSON.stringify(data);
};

const processingError = () => {
  const pForError = document.getElementById('error');
  pForError.textContent = result.message;
  pForError.style.color = 'red';
  pForError.style.size = 25;
};

const processingStatusOk = (result) => {
  const payloadAccessToken = JSON.parse(
    window.atob(result.accessToken.split('.')[1])
  );
  const payloadRefreshToken = JSON.parse(
    window.atob(result.refreshToken.split('.')[1])
  );
  const timeForAccess = payloadAccessToken.exp - payloadAccessToken.iat;
  const timeForRefresh = payloadRefreshToken.exp - payloadRefreshToken.iat;
  storeToken('accessToken', result.accessToken, timeForAccess);
  storeToken('refreshToken', result.refreshToken, timeForRefresh);
  window.location.pathname = '/user/';
};

document.getElementById('login').addEventListener('click', async () => {
  const formData = new FormData(document.forms.login);
  const url = '/login/';

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: createDataForBody(formData)
  };
  fetch(url, options).then(async (response) => {
    const result = await response.json();
    if (response.status === 200) {
      processingStatusOk(result);
    } else {
      processingError();
    }
  });
});

aWithIdForgot.addEventListener('click', () => {
  aWithIdForgot.style.display = 'none';
  const forgotElements = Array.from(document.getElementsByName('forgot'));
  forgotElements.forEach((el) => {
    el.style.display = 'block';
  });
});

const createStatusMessage = (message) => {
  divForMessage.innerText = message;
  divForMessage.style.display = 'block';
  setTimeout(() => {
    divForMessage.style.display = 'none';
  }, 3000);
};

document.getElementById('btnForgot').addEventListener('click', () => {
  const formData = new FormData(document.forms.forgot);
  const url = '/login/forgot';
  const data = createDataForBody(formData);
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: data
  };
  window.localStorage.setItem('email', JSON.parse(data).emailForResetPassword);
  fetch(url, options).then((response) => {
    console.log(response);
    if (response.status === 200) {
      formForCheckToken.style.display = 'block';
      document.getElementsByClassName('forgot')[0].style.display = 'none';
    } else {
      createStatusMessage(response.json());
    }
  });
});

document.getElementById('btnSendAnswer').addEventListener('click', () => {
  const formData = new FormData(document.forms.sendToken);
  const url = '/login/checkToken';
  formData.append('email', window.localStorage.getItem('email'));
  console.log(formData);
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: createDataForBody(formData)
  };
  fetch(url, options).then((response) => {
    console.log(response);
    if (response.status === 200) {
      formForResetPass.style.display = 'block';
      formForCheckToken.style.display = 'none';
    } else {
      createStatusMessage(response.json());
    }
  });
});

document.getElementById('btnResetPassword').addEventListener('click', () => {
  const formData = new FormData(document.forms.resetPassword);
  const url = '/login/resetPassword';
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: createDataForBody(formData)
  };
  fetch(url, options).then(async (response) => {
    const json = await response.json();
    console.log(json);
    createStatusMessage(json);
    if (response.status === 200) {
      formForResetPass.style.display = 'none';
    }
  });
});
