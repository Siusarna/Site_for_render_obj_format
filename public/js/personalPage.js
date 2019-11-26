/* eslint no-undef: 0 */
const logoutButton = document.getElementById('Logout');

logoutButton.addEventListener('click', () => {
  const url = '/logout/';
  const options = {
    method: 'GET'
  };
  fetch(url, options).then((response) => {
    if (response.status !== 200) {
      console.log(response.json());
    }
    console.log('cool');
    window.location.pathname = '';
  });
});

logoutButton.addEventListener('focus', () => {});
