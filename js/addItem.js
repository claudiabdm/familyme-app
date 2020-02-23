// ADD EVENT LISTENER TO CHECKBOX TO LINE THROUGH LABEL
// -------------------------------------------------------------------

function itemChecked(e) {
  const id = e.currentTarget.getAttribute('id');
  const listProduct = document.querySelector(`[for="${id}"]`).firstElementChild;
  if (listProduct.className === 'list__product list__done') {
    listProduct.className = 'list__product';
  } else if (listProduct.className === 'list__product') {
    listProduct.className = 'list__product list__done';
  }
}

const checkboxContainer = document.querySelectorAll('input');
checkboxContainer.forEach((elem) => elem.addEventListener('click', itemChecked));

const listElem = document.getElementById('shoppingList');
const addBtn = document.getElementById('addItemBtn');


// ADD ITEM TO LIST (to be broken into smaller functions)
// --------------------------------------------------------------
function addItem(ulElem, liElem, inputElem, plusBtn, userName) {
  // Remove children from li elem
  liElem.removeChild(inputElem);
  liElem.removeChild(plusBtn);

  // Label Elem
  const label = document.createElement('label');
  const itemNameElem = document.createElement('span');
  const itemName = document.createTextNode(inputElem.value);
  const addedByElem = document.createElement('span');
  const addedBy = document.createTextNode(`Added by ${userName}`);
  label.className = 'list__label';
  itemNameElem.className = 'list__product';
  addedByElem.className = 'list__addedby';
  label.setAttribute('for', inputElem.value.toLowerCase());
  // Append to label
  itemNameElem.appendChild(itemName);
  addedByElem.appendChild(addedBy);
  label.appendChild(itemNameElem);
  label.appendChild(addedByElem);

  // Checkbox
  const checkbox = document.createElement('div');
  const box = document.createElement('input');
  const checkmark = document.createElement('span');
  checkbox.className = 'list__checkbox checkbox checkbox--lg';
  box.className = 'checkbox__box';
  checkmark.className = 'checkbox__checkmark';
  box.setAttribute('type', 'checkbox');
  box.setAttribute('id', inputElem.value.toLowerCase());
  // Append to checkbox
  checkbox.appendChild(box);
  checkbox.appendChild(checkmark);
  box.addEventListener('click', itemChecked);

  // Append to list
  liElem.appendChild(label);
  liElem.appendChild(checkbox);
  ulElem.appendChild(liElem);
}


function addItemOnEnter(ulElem, liElem, input, plusBtn, userName, event) {
  if (event.keyCode === 13) {
    addItem(ulElem, liElem, input, plusBtn, userName);
  }
}


// CREATE INPUT ITEM TO BE ADDED (to be broken into smaller functions)
// -------------------------------------------------------------------
function createListItem(ulElem) {
  // Li Elem
  const liElem = document.createElement('li');
  liElem.className = 'list__item';

  // Input Elem
  const input = document.createElement('input');
  input.className = 'list__input list__label';
  input.setAttribute('type', 'text');
  input.focus();

  // Plus Btn
  const plusBtn = document.createElement('button');
  plusBtn.className = 'list__add';

  // APPEND
  plusBtn.addEventListener('click', addItem.bind(this, ulElem, liElem, input, plusBtn, 'Claudia Benito'));
  input.addEventListener('keydown', addItemOnEnter.bind(input, ulElem, liElem, input, plusBtn, 'Claudia Benito'));
  liElem.appendChild(input);
  liElem.appendChild(plusBtn);
  ulElem.appendChild(liElem);
}

addBtn.addEventListener('click', createListItem.bind(this, listElem));
