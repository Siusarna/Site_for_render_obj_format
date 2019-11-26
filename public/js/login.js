/* eslint no-undef: 0 */

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

document.getElementById('login').addEventListener('click', async () => {
  const formData = new FormData(document.forms.login);
  const url = '/login/';
  const data = {};

  for (const pair of formData.entries()) {
    data[pair[0]] = pair[1];
  }

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };

  fetch(url, options).then(async (response) => {
    const result = await response.json();
    if (response.status === 200) {
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
    } else {
      const pForError = document.getElementById('error');
      pForError.textContent = result.message;
      pForError.style.color = 'red';
      pForError.style.size = 25;
    }
  });
});
