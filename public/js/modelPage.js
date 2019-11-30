/* eslint no-undef: 0 */
const divForMessage = document.getElementById('status');
const radios = document.getElementsByName('select');
const btnDelet = document.getElementById('delete');

document.getElementById('upload').addEventListener('click', () => {
  const formData = new FormData(document.forms.addNewModel);
  const url = '/model-base';
  const options = {
    method: 'POST',
    body: formData
  };
  fetch(url, options).then(async (response) => {
    const result = await response.json();
    if (result.msg === 'redirect') window.location = result.location;
    else {
      divForMessage.innerText = result;
      divForMessage.style.display = 'block';
      setTimeout(() => {
        divForMessage.style.display = 'none';
      }, 3000);
    }
  });
});

const getNameForDeletModel = () => {
  let row;
  for (const radio of radios) {
    if (radio.checked) {
      row = radio.parentElement.parentElement; // get row
      break;
    }
  }
  return row.children[2].innerText;
};

btnDelet.addEventListener('click', () => {
  const name = getNameForDeletModel();
  const search = `?nameOfModel=${name}`;
  const url = `/model-base/${search}`;
  const options = {
    method: 'DELETE'
  };
  fetch(url, options).then(async (response) => {
    const result = await response.json();
    if (result.msg === 'redirect') window.location = result.location;
    else {
      divForMessage.innerText = result;
      divForMessage.style.display = 'block';
      setTimeout(() => {
        divForMessage.style.display = 'none';
      }, 3000);
    }
  });
});

const addOnClickForRadio = () => {
  for (let i = 0; i < radios.length; i++) {
    radios[i].onchange = () => {
      btnDelet.disabled = false;
    };
  }
};

addOnClickForRadio();
