function getAxios() {axios.get('EXAMPLE_URL')
    .then(function(response) {
        const obj = response.data;
            for ( let i = 0; i<obj.length; i++) {
                insertDog(obj[i]);
            }
    }

    )
    .catch(error => console.log(error))
    }


function insertDog(dog) {

    const table = document.getElementById('table').querySelector('tbody');
    const newRow = table.insertRow(table.rows.length);

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
    deleteButton.innerHTML = `<i class="fa fa-trash icon" aria-hidden="true"></i>`;
    editButton.setAttribute('onclick', 'deteteRow(this)');
    newRow.insertCell(8).appendChild(deleteButton);
}

const editMode = false;
const editRowNumber = 0;
const editTable = document.getElementById("table");
const changeButton = document.getElementById("addDog");
const legend = document.querySelector('legend');
const tbody = table.querySelector('tbody');


document.getElementById('addDate').valueAsDate = new Date();

function addOrEditDog() {
  if (editMode)
    editDog();
  else
    checkbox()
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
}
    axios.post('EXAMPLE_URL', dog)
        .then(function(response) {
            console.log(response.data.id);
            insertDog(dog);
        })
        .catch(error => console.log(error));
}

// funkcja na sex i size i age

function parseSex() {
    if (document.querySelector('input[name="dogSex"]:checked').value === "Samiec") {
        return 'MALE';
    }
    return 'FEMALE';
}
function parseSize() {
    if (document.querySelector('input[name="dogSize"]:checked').value === "Mały") {
        return 'SMALL';
    } else if (document.querySelector('input[name="dogSize"]:checked').value === "Średni") {
        return 'MEDIUM';
    } else {
    return 'LARGE';
}}
function parseAge() {
    if (document.getElementById('dogAge').value === "brak informacji") {
        return '-';
    } else if (document.getElementById('dogAge').value === "Więcej niż 10"){
        return '>10';
    } return document.getElementById('dogAge').value;
    }

// funkcja usuwająca wiersz

function deleteRow(row) {
    let i = row.parentNode.parentNode.rowIndex;
    document.getElementById('table').deleteRow(i);
}


// zmienić na takie jak edycja
tbody.onclick = function(e) {
  if (e.target.className !== "remove-button") return;

  const i = e.target.closest('tr');
  console.log(i);
  i.remove();
}

// funkcja zaczynająca edycję

function startEditRow(row) {
 editMode = true;
 legend.textContent = "Zmień dane psa:";
 changeButton.value = "Zmień";
 editRowNumber = row.parentNode.parentNode.rowIndex;

      document.getElementById("dogName").value = editTable.rows[editRowNumber].cells[0].innerHTML;
      document.getElementById("dogAge").value = editTable.rows[editRowNumber].cells[1].innerHTML;
      const checkedValSize = editTable.rows[editRowNumber].cells[2].innerHTML;
      const checkedButSize = document.querySelector(`input[value=${checkedValSize}]`);
      checkedButSize.checked = true;
      const checkedValSex = editTable.rows[editRowNumber].cells[3].innerHTML;
      const checkedButSex = document.querySelector(`input[value=${checkedValSex}]`);
      checkedButSex.checked = true;
      document.querySelector('input[name="dogSex"]:checked').value = editTable.rows[editRowNumber].cells[3].innerHTML;
      document.getElementById("dogSubscribe").value = editTable.rows[editRowNumber].cells[4].innerHTML;
      document.getElementById("addDate").value = editTable.rows[editRowNumber].cells[5].innerHTML;
      editTable.rows[editRowNumber].style.color = "red";
}

// funkcja edycja psa

function editDog() {
    editTable.rows[editRowNumber].cells[0].innerHTML = document.getElementById("dogName").value;
    editTable.rows[editRowNumber].cells[1].innerHTML = document.getElementById("dogAge").value;
    editTable.rows[editRowNumber].cells[2].innerHTML = document.querySelector('input[name="dogSize"]:checked').value;
    editTable.rows[editRowNumber].cells[3].innerHTML = document.querySelector('input[name="dogSex"]:checked').value;
    editTable.rows[editRowNumber].cells[4].innerHTML = document.getElementById("dogSubscribe").value;
    editTable.rows[editRowNumber].cells[5].innerHTML = document.getElementById("addDate").value;
    editMode = false;
    editTable.rows[editRowNumber].style.color = "black";
    changeButton.value = "Prześlij dane";
    legend.textContent = "Dodaj nowego psa:";
}

// alert 1 : zły mail

function showAlert1() {
  const div = document.createElement('div');
  div.className = "mailAlert";
  div.innerHTML = "<strong>Ups!</strong> Sprawdź czy mail jest prawidłowy.";
  myForm.before(div);
  // setTimeout( () => div.remove(), 2000);
}

// alert 2 : niezaakceptowane

function showAlert2() {
  const div = document.createElement('div');
  div.className = "addAlert";
  div.innerHTML = "<strong>Ups!</strong> Musisz zaakceptować dodanie psa.";
  myForm.before(div);
  // setTimeout( () => div.remove(), 2000);
}

function checkbox() {
  if (document.querySelector('input[name="rules"]').checked && document.getElementById('addEmail').value.includes("@"))  {
      addDog();
  }
  if (!document.querySelector('input[name="rules"]').checked && !document.getElementById('addEmail').value.includes("@"))  {
      showAlert1();
      showAlert2();
  }
  if (!document.querySelector('input[name="rules"]').checked && document.getElementById('addEmail').value.includes("@")) {
      showAlert2();
  }
  if (document.querySelector('input[name="rules"]').checked && !document.getElementById('addEmail').value.includes("@"))  {
      showAlert1();
  }
}

// podświetlanie komórek nad którymi jeździmy myszą (zmienić na podświetlenie rowa)

let selectedTh;

editTable.onmouseover = function(event) {
  let target = event.target;
    while (target !== this) {
      if (target.tagName === 'TR' && target.id !== 'head') {
        highlight(target);
        return;
      }
      target = target.parentNode;
    }
  }

function highlight(node) {
  if (selectedTh) {
    selectedTh.classList.remove('highlight');
  }
  selectedTh = node;
  selectedTh.classList.add('highlight');
}

//sortowanie po kliknieciu nazwy wiesza

table.onclick = function (event) {
  if (event.target.tagName !== 'TH') return;

  let th = event.target;
  sortTable(th.cellIndex, th.dataset.type);
};

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
