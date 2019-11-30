/* eslint no-undef: 0 */
const divForMessage = document.getElementById('status');

document.getElementById('upload').addEventListener('click', () => {
  const formData = new FormData(document.forms.addNewModel);
  const url = '/model-base';
  const options = {
    method: 'POST',
    body: formData
  };
  fetch(url, options)
    .then((response) => response.json())
    .then((result) => {
      divForMessage.innerText = result;
      divForMessage.style.display = 'block';
      setTimeout(() => {
        divForMessage.style.display = 'none';
      }, 3000);
    });
});
