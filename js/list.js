
// DOM ELEM VARIABLES
// -------------------------------------------------------------------
const list = document.getElementById('shoppingList');
const addBtn = document.getElementById('addItemBtn');


// LINE THROUGH LABEL WHEN ITEM HAS BEEN CHECKED HANDLER FUNCTION
// -------------------------------------------------------------------

function itemChecked(e) {
  const itemId = e.target.getAttribute('id');
  const listProduct = document.querySelector(`[for="${itemId}"]`).firstElementChild;
  
  if (listProduct.className === 'list__product list__done') {
    listProduct.classList.remove('list__done');
  } else if (listProduct.className === 'list__product') {
    listProduct.classList.add('list__done');
  }
}




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

  // Remove btn
  const removeBtn = createRemoveBtn();

  // Append to list
  liElem.appendChild(checkbox);
  liElem.appendChild(label);
  liElem.appendChild(removeBtn);
  ulElem.appendChild(liElem);
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
  setTimeout(() => {input.focus()}, 100);

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


// CREATE REMOVE ITEM BTN
// -------------------------------------------------------------------
function createRemoveBtn () {
  const removeBtn = document.createElement('button');
  const text = document.createTextNode('×')
  removeBtn.className = 'list__remove btn btn--close';
  removeBtn.appendChild(text);
  return removeBtn;
}

// REMOVE ITEM HANDLER FUNCTION
// -------------------------------------------------------------------
function removeItem(target) {
  const liElem = target.parentNode;
  const list = liElem.parentNode;
  list.removeChild(liElem);
}


// ADD EVENTS TO BUTTONS
// -------------------------------------------------------------------

// Even delegation
// -------------------------
list.onclick = function(e) {
  const target = e.target;
  if (target.className === 'list__remove btn btn--close'){
    return removeItem(target);
  } else if (target.className === 'checkbox__box'){
    return itemChecked(e);
  }
};

addBtn.addEventListener('click', createListItem.bind(this, list));

function addItemOnEnter(ulElem, liElem, input, plusBtn, userName, event) {
  if (event.keyCode === 13) {
    addItem(list, liElem, input, plusBtn, userName);
  }
}
