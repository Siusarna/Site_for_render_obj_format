/* eslint no-undef: 0 */
const render = document.getElementsByName('render')[0];
const socket = io();

const startTimer = (data, display) => {
  let timer = data.calculatedTime;
  let minutes, seconds;
  document.querySelector('#observationalError').textContent =
    data.observationalError;
  const interval = setInterval(() => {
    minutes = parseInt(timer / 60, 10);
    seconds = parseInt(timer % 60, 10);

    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    display.textContent = minutes + ':' + seconds;

    if (--timer <= 0) {
      clearInterval(interval);
      document.querySelector('#observationalError').textContent = '00:00';
    }
  }, 1000);
};

socket.on('timer', (data) => {
  const display = document.querySelector('#time');
  startTimer(data, display);
  console.log(data);
});

const createDataForBody = (formData) => {
  const data = {};

  for (const pair of formData.entries()) {
    data[pair[0]] = pair[1];
  }
  data.nameOfModel = window.localStorage.getItem('nameOfModel');
  return data;
};

render.addEventListener('click', () => {
  const formData = new FormData(document.forms.options);
  const url = '/model-base/render';

  const data = createDataForBody(formData);

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  };
  console.log(data);
  fetch(url, options)
    .then((response) => response.json())
    .then((result) => {
      const data = result.data;
      const image = new Image();
      image.src = 'data:image/bmp;base64,' + data;
      document.body.appendChild(image);
    });
});
