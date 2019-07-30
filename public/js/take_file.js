const first_input = document.getElementsByName('file-to-upload')[0];
const upload = document.getElementsByName('upload')[0];

function OBJfilter ( str ){
  return (str.match(/\.obj$/m));
}

first_input.addEventListener('input', () => {
  if(OBJfilter(first_input.value)){
    upload.disabled = false;
  } else {
    upload.disabled = true;
  }
})
