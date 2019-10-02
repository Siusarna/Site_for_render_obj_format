const first_input = document.getElementsByName('file-to-upload')[0];
const upload = document.getElementsByName('upload')[0];

function OBJfilter(str) {
  return str.includes('.obj');
}

first_input.addEventListener('input', () => {
  if (OBJfilter(first_input.value)) {
    upload.disabled = false;
    upload.style.background = "#327832";
  } else {
    upload.disabled = true;
  }
})

upload.addEventListener('click', () => {
  const formData = new FormData(document.forms.options);

  const req = new XMLHttpRequest();
  const url = '/upload';

  req.open('POST', url, true);
  req.addEventListener('load', onLoad);

  req.send(formData);

  function onLoad() {
    const response = this.responseText;
    const parsedResponse = JSON.parse(response);

    const data = parsedResponse['data'];
    console.log(atob(data));
    const image = new Image();
    image.src = 'data:image/bmp;base64,' + data;
    document.body.appendChild(image);
  }
})