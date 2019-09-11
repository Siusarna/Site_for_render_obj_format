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