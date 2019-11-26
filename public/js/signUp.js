/* eslint no-undef: 0 */
document.getElementById('login').addEventListener('click', () => {
  const formData = new FormData(document.forms.signUp);
  const url = '/signUp/';
  const data = {};

  const keyIndex = 0;
  const dataIndex = 1;
  for (const pair of formData.entries()) {
    data[pair[keyIndex]] = pair[dataIndex];
  }

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };

  fetch(url, options)
    .then((response) => {
      window.location.href = '../login';
    }).catch(e => {
      console.log(e);
    });
});
