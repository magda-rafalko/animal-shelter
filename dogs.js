let editMode = false;
let editRowNumber;

function onLoad() {
    getDogs();
    document.getElementById('addDate').valueAsDate = new Date();

    const table = document.getElementById('table');
    table.onclick = function (event) {
        if (event.target.tagName !== 'TH') return;

        let th = event.target;
        sortTable(th.cellIndex, th.dataset.type);
    };
}

function addOrEditDog() {
    const formValid = validateForm();
    if (formValid && editMode)
        editDog();
    else if (formValid)
        addDog();
    hideAlerts();
}

function startEditRow(row) {
    editMode = true;
    
    changeLegendText('Zmień dane psa:');
    changeButtonText('Zmień');
    
    editRowNumber = row.parentNode.parentNode.rowIndex;

    const editRow = document.getElementById('table').rows[editRowNumber];
    document.getElementById('dogName').value = editRow.cells[0].innerHTML;
    document.getElementById('dogAge').value = editRow.cells[1].innerHTML;
    const checkedValSize = editRow.cells[2].innerHTML;
    const checkedButSize = document.querySelector(`input[value=${checkedValSize}]`);
    checkedButSize.checked = true;
    const checkedValSex = editRow.cells[3].innerHTML;
    const checkedButSex = document.querySelector(`input[value=${checkedValSex}]`);
    checkedButSex.checked = true;
    document.querySelector('input[name="dogSex"]:checked').value = editRow.cells[3].innerHTML;
    document.getElementById('dogSubscribe').value = editRow.cells[4].innerHTML;
    document.getElementById('addDate').value = editRow.cells[5].innerHTML;
    editRow.style.color = 'red';
}

function deleteDog(id) {
    deleteDogFromApi(id)
        .then(() => {
            const row = document.getElementById(id);
            const i = row.rowIndex;

            const table = document.getElementById('table');
            table.deleteRow(i);
        })

}

function getDogs() {
    getDogsFromApi()
        .then(response => {
            const obj = response.data;
            for (let i = 0; i < obj.length; i++) {
                insertDog(obj[i]);
            }
        });
}

function addDog() {
    const dog = {
        age: parseAge(),
        dateInserted: document.getElementById('addDate').value,
        description: document.getElementById('dogSubscribe').value,
        keeperEmail: document.getElementById('addEmail').value,
        name: document.getElementById('dogName').value,
        sex: parseSex(),
        size: parseSize(),
    };

    addDogToApi(dog)
        .then(() => {
            insertDog(dog);
        });
}

function editDog() {
    const editRow = document.getElementById('table').rows[editRowNumber];
    editRow.cells[0].innerHTML = document.getElementById('dogName').value;
    editRow.cells[1].innerHTML = document.getElementById('dogAge').value;
    editRow.cells[2].innerHTML = document.querySelector('input[name="dogSize"]:checked').value;
    editRow.cells[3].innerHTML = document.querySelector('input[name="dogSex"]:checked').value;
    editRow.cells[4].innerHTML = document.getElementById('dogSubscribe').value;
    editRow.cells[5].innerHTML = document.getElementById('addDate').value;
    
    editMode = false;
    editRow.style.color = 'black';
    
    changeButtonText('Prześlij dane');
    changeLegendText('Dodaj nowego psa:');
}

function validateForm() {
    const consentChecked = document.querySelector('input[name="rules"]').checked;
    const validEmail = document.getElementById('addEmail').value.includes('@');

    if (!consentChecked)
        showConsentAlert();

    if (!validEmail)
        showEmailAlert();

    return consentChecked && validEmail;
}

function hideAlerts() {
    Array.from(document.getElementsByClassName('validation-alert'))
        .forEach(alert => {
            alert.remove();
        })


}
//TODO pomyśleć o znikaniu
function showEmailAlert() {
    const div = document.createElement('div');
    const myForm = document.getElementById('myForm');
    div.className = 'validation-alert';
    div.innerHTML = '<strong>Ups!</strong> Sprawdź czy mail jest prawidłowy.';
    myForm.before(div);
}

function showConsentAlert() {
    const div = document.createElement('div');
    const myForm = document.getElementById('myForm');
    div.className = 'validation-alert';
    div.innerHTML = '<strong>Ups!</strong> Musisz zaakceptować dodanie psa.';
    myForm.before(div);
}

function insertDog(dog) {
    const table = document.getElementById('table').querySelector('tbody');
    const newRow = table.insertRow(table.rows.length);
    newRow.setAttribute('id', dog.id);
    newRow.insertCell(0).innerHTML = dog.name;
    newRow.insertCell(1).innerHTML = dog.age;
    newRow.insertCell(2).innerHTML = dog.size;
    newRow.insertCell(3).innerHTML = dog.sex;
    newRow.insertCell(4).innerHTML = dog.description;
    newRow.insertCell(5).innerHTML = dog.dateInserted;
    newRow.insertCell(6).innerHTML = dog.keeperEmail;
    const editButton = document.createElement('button');
    editButton.setAttribute('id', 'editButton');
    editButton.setAttribute('class', 'smallButton');
    editButton.setAttribute('onclick', 'startEditRow(this)');
    editButton.innerHTML = '<i class="fa fa-pencil-square-o" aria-hidden="true"></i>';
    newRow.insertCell(7).appendChild(editButton);
    const deleteButton = document.createElement('button');
    deleteButton.setAttribute( 'class', 'smallButton');
    deleteButton.innerHTML = '<i class="fa fa-trash icon" aria-hidden="true"></i>';
    deleteButton.setAttribute('onclick', `deleteDog(${dog.id})`);
    newRow.insertCell(8).appendChild(deleteButton);
}

function changeLegendText(text) {
    const legend = document.querySelector('legend');
    legend.textContent = text;
}

function changeButtonText(text) {
    const changeButton = document.getElementById('addDog');
    changeButton.value = text;
}

function parseSex() {
    if (document.querySelector('input[name="dogSex"]:checked').value === 'Samiec') {
        return 'MALE';
    }
    return 'FEMALE';
}
function parseSize() {
    const dogSize = document.querySelector('input[name="dogSize"]:checked').value;
    if (dogSize === 'Mały') {
        return 'SMALL';
    } else if (dogSize === 'Średni') {
        return 'MEDIUM';
    } else {
    return 'LARGE';
    }
}
function parseAge() {
    const dogAge = document.querySelector('input[name="dogAge"]:checked').value;
    if (dogAge === 'brak informacji') {
        return '-';
    } else if (dogAge === 'Więcej niż 10'){
        return '>10';
    } return dogAge;
}


function sortTable(colNum, type) {
  const tbody = table.querySelector('tbody');
  const rowsArray = Array.from(tbody.rows);
  let compare;

  switch (type) {
    case 'number':
      compare = function( rowA, rowB) {
        return rowA.cells[colNum].innerHTML - rowB.cells[colNum].innerHTML;
      };
      break;
    case 'string':
      compare = function(rowA, rowB) {
        return rowA.cells[colNum].innerHTML > rowB.cells[colNum].innerHTML ? 1 : -1;
      };
      break;
  }
  rowsArray.sort(compare);
  tbody.append(...rowsArray);
}
