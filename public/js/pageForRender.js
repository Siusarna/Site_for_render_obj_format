/* eslint no-undef: 0 */
const cameraPos = document.getElementsByName('camera_pos')[0];
const width = document.getElementsByName('width')[0];
const height = document.getElementsByName('height')[0];
const fov = document.getElementsByName('fov')[0];
const lightPos = document.getElementsByName('light_pos')[0];
const lightIntensity = document.getElementsByName('light_intensity')[0];
const errorCameraPos = document.getElementById('errorCameraPos');
const errorWidth = document.getElementById('errorWidth');
const errorHeight = document.getElementById('errorHeight');
const errorFov = document.getElementById('errorFov');
const errorLightPos = document.getElementById('errorLightPos');
const errorLightIntensity = document.getElementById('errorLightIntensity');
const render = document.getElementById('render');

const containerForImage = document.getElementById('image');

const socket = io();

const startTimer = (data, display) => {
  document.getElementsByClassName('time')[0].style.display = 'block';
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
});

// valid

const isVector = (str) => {
  const re = /-?\d+\s-?\d+\s-?\d+/;
  if (str.match(re)) return true;
  return false;
};

cameraPos.addEventListener('input', () => {
  if (isVector(cameraPos.value)) {
    errorCameraPos.innerText = '';
    errorCameraPos.className = 'error';
  }
});

width.addEventListener('input', () => {
  if (width.value >= 50 && width.value <= 900) {
    errorWidth.innerText = '';
    errorWidth.className = 'error';
  }
});

height.addEventListener('input', () => {
  if (height.value >= 50 && height.value <= 900) {
    errorHeight.innerText = '';
    errorHeight.className = 'error';
  }
});

fov.addEventListener('input', () => {
  if (fov.value >= 50 && fov.value <= 170) {
    errorFov.innerText = '';
    errorFov.className = 'error';
  }
});

lightPos.addEventListener('input', () => {
  if (isVector(lightPos.value)) {
    errorLightPos.innerText = '';
    errorLightPos.className = 'error';
  }
});

lightIntensity.addEventListener('input', () => {
  if (lightIntensity.value > 0 && lightIntensity.value <= 5) {
    errorLightIntensity.innerText = '';
    errorLightIntensity.className = 'error';
  }
});

const checkAllfields = () => {
  let flag = true;
  if (!isVector(cameraPos.value)) {
    errorCameraPos.innerText = 'Enter the value as in the example';
    errorCameraPos.className = 'error active';
    flag = false;
  }
  if (width.value < 50 || width.value > 900) {
    errorWidth.innerText = 'Width can be from 50 to 900';
    errorWidth.className = 'error active';
    flag = false;
  }
  if (height.value < 50 || height.value > 900) {
    errorHeight.innerText = 'Height can be from 50 to 900';
    errorHeight.className = 'error active';
    flag = false;
  }
  if (fov.value < 50 || fov.value > 170) {
    errorFov.innerText = 'Fov can be from 50 to 170';
    errorFov.className = 'error active';
    flag = false;
  }
  if (!isVector(lightPos.value)) {
    errorLightPos.innerText = 'Enter the value as in the example';
    errorLightPos.className = 'error active';
    flag = false;
  }
  if (lightIntensity.value <= 0 || lightIntensity.value > 5) {
    errorLightIntensity.innerText = 'Light intensity can be from 0 to 5';
    errorLightIntensity.className = 'error active';
    flag = false;
  }
  return flag;
};

const createDataForBody = (formData) => {
  const data = {};

  for (const pair of formData.entries()) {
    data[pair[0]] = pair[1];
  }
  data.nameOfModel = window.localStorage.getItem('nameOfModel');
  return data;
};

render.addEventListener('click', () => {
  if (!checkAllfields()) return;
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
  fetch(url, options)
    .then((response) => response.json())
    .then((result) => {
      const data = result.data;
      const image = new Image();
      image.src = 'data:image/bmp;base64,' + data;
      containerForImage.appendChild(image);
      containerForImage.style.display = 'block';
    });
});
