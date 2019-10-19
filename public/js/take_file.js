const first_input = document.getElementsByName("file-to-upload")[0];
const upload = document.getElementsByName("upload")[0];
const socket = io();

socket.on("timer", (data)=>{
  console.log(data);
})

function OBJfilter(str) {
  return str.includes(".obj");
}

first_input.addEventListener("input", () => {
  if (OBJfilter(first_input.value)) {
    upload.disabled = false;
    upload.style.background = "#327832";
  } else {
    upload.disabled = true;
  }
});

upload.addEventListener("click", () => {
  const formData = new FormData(document.forms.options);
  const url = "/upload";
  const options = {
    method: "POST",
    body: formData
  };
  fetch(url, options)
    .then(response => response.json())
    .then(result => {
      const data = result["data"];
      const image = new Image();
      image.src = "data:image/bmp;base64," + data;
      document.body.appendChild(image);
    });
});
