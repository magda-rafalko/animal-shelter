let editMode = false;
let editRowNumber = 0;
let editTable = document.getElementById("table");
let changeButton = document.getElementById("addDog");
let legend = document.querySelector('legend');
let tbody = table.querySelector('tbody');


document.getElementById('addDate').valueAsDate = new Date();

function addOrEditDog() {
  if (editMode)
    editDog()
  else
    checkbox()
}

function addDog() {

  let table = document.getElementById('table').querySelector('tbody');
  let newRow = table.insertRow(table.rows.length);

  let cell1 = newRow.insertCell(0);
  let name = document.getElementById('dogName').value;
  cell1.innerHTML = name;

  let cell2 = newRow.insertCell(1);
  let age = document.getElementById('dogAge').value;
  cell2.innerHTML = age;

  let cell3 = newRow.insertCell(2);
  let size = document.querySelector('input[name="dogSize"]:checked').value;
  cell3.innerHTML = size;

  let cell4 = newRow.insertCell(3);
  let sex = document.querySelector('input[name="dogSex"]:checked').value;
  cell4.innerHTML = sex;

  let cell5 = newRow.insertCell(4);
  let subscribe = document.getElementById('dogSubscribe').value;
  cell5.innerHTML = subscribe;

  let cell6 = newRow.insertCell(5);
  let date = document.getElementById('addDate').value;
  cell6.innerHTML = date;

  let cell7 = newRow.insertCell(6);
  let email = document.getElementById('addEmail').value;
  cell7.innerHTML = email;

  let cell8 = newRow.insertCell(7);
  let btn2 = document.createElement('input');
  btn2.type = "button";
  btn2.className = "smallButton";
  btn2.value = "Edytuj";
  btn2.id = "editButton";
  btn2.onclick = function() {startEditRow(this)};
  cell8.appendChild(btn2);

  let cell9 = newRow.insertCell(8);
  let btn = document.createElement('button');
  btn.className = "remove-button";
  btn.innerHTML = "[X]";
  cell9.appendChild(btn);
}

tbody.onclick = function(e) {
  if (e.target.className != "remove-button") return;

  let i = e.target.closest('tr');
  console.log(i);
  i.remove();
}

function startEditRow(row) {
 editMode = true;
 legend.textContent = "Zmień dane psa:";
 changeButton.value = "Zmień";
 editRowNumber = row.parentNode.parentNode.rowIndex;

      document.getElementById("dogName").value = editTable.rows[editRowNumber].cells[0].innerHTML;
      document.getElementById("dogAge").value = editTable.rows[editRowNumber].cells[1].innerHTML;
      let checkedValSize = editTable.rows[editRowNumber].cells[2].innerHTML;
      let checkedButSize = document.querySelector(`input[value=${checkedValSize}]`);
      checkedButSize.checked = true;
      let checkedValSex = editTable.rows[editRowNumber].cells[3].innerHTML;
      let checkedButSex = document.querySelector(`input[value=${checkedValSex}]`);
      checkedButSex.checked = true;
      document.querySelector('input[name="dogSex"]:checked').value = editTable.rows[editRowNumber].cells[3].innerHTML;
      document.getElementById("dogSubscribe").value = editTable.rows[editRowNumber].cells[4].innerHTML;
      document.getElementById("addDate").value = editTable.rows[editRowNumber].cells[5].innerHTML;
      editTable.rows[editRowNumber].style.color = "red";
}

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

function showAlert1() {
  let div = document.createElement('div');
  div.className = "mailAlert";
  div.innerHTML = "<strong>Ups!</strong> Sprawdź czy mail jest prawidłowy.";
  myForm.before(div);
  setTimeout( () => div.remove(), 2000);
}

function showAlert2() {
  let div = document.createElement('div');
  div.className = "addAlert";
  div.innerHTML = "<strong>Ups!</strong> Musisz zaakceptować dodanie psa.";
  myForm.before(div);
  setTimeout( () => div.remove(), 2000);
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

// podświetlanie komórek nad którymi jeździmy myszą

let selectedTh;

editTable.onmouseover = function(event) {
  let target = event.target;
    while (target != this) {
      if (target.tagName == 'TD' || target.tagName == 'TH' ) {
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
  if (event.target.tagName != 'TH') return;

  let th = event.target;
  sortTable(th.cellIndex, th.dataset.type);
};

function sortTable(colNum, type) {
  let tbody = table.querySelector('tbody');
  let rowsArray = Array.from(tbody.rows);
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
