document.getElementById('login').addEventListener("click", () => {
  const formData = new FormData(document.forms.signUp);
  const url = "/signUp/";
  const options = {
    method: "POST",
    body: formData
  };
  fetch(url, options)
    .then(response => response.json())
    .then(result => {
      console.log(result);
    });
});
