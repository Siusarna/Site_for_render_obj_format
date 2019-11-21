/* eslint no-undef: 0 */
const firstInput = document.getElementsByName('file-to-upload')[0];
const upload = document.getElementsByName('upload')[0];
const socket = io();

function startTimer (data, display) {
  let timer = data.calculatedTime;
  let minutes, seconds;
  document.querySelector('#observationalError').textContent =
    data.observationalError;
  const interval = setInterval(function () {
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
}

socket.on('timer', (data) => {
  const display = document.querySelector('#time');
  startTimer(data, display);
  console.log(data);
});

function OBJfilter (str) {
  return str.includes('.obj');
}

firstInput.addEventListener('input', () => {
  if (OBJfilter(firstInput.value)) {
    upload.disabled = false;
    upload.style.background = '#327832';
  } else {
    upload.disabled = true;
  }
});

upload.addEventListener('click', () => {
  const formData = new FormData(document.forms.options);
  const url = '/upload';
  const options = {
    method: 'POST',
    body: formData
  };
  fetch(url, options)
    .then((response) => response.json())
    .then((result) => {
      const data = result.data;
      const image = new Image();
      image.src = 'data:image/bmp;base64,' + data;
      document.body.appendChild(image);
    });
});
