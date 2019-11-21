/* eslint no-undef: 0 */
document.getElementById('login').addEventListener('click', () => {
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

  fetch(url, options)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
    });
});
