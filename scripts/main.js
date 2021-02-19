let myMap;
let coords;
let storage = localStorage;
let li = document.createElement('li');
let form = document.getElementById('reviewForm');
const modal = document.getElementById('modal');
const list = document.querySelector('#list');
const userName = document.querySelector('#name');
const place = document.querySelector('#place');
const review = document.querySelector('#review');
const line = document.querySelector('#line');
const btn = document.querySelector('#btn');

ymaps.ready(init);

function init() {
  myMap = new ymaps.Map('map', {
    center: [55.76, 37.64],
    zoom: 10
  });
  addListeners();
}

function addListeners() {
  myMap.events.add('click', function (event) {
    openModal(event);
  });

  // Обработка сабмита
  form = document.getElementById('reviewForm');
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    formValidate(form);
    modal.style.display = 'none';
    addHint();
  })



  // Валидация формы
  function formValidate(form) {
    let error = 0;
    let formReq = document.querySelectorAll('._req');

    for (let i = 0; i < formReq.length; i++) {
      const input = formReq[i];
      formRemoveError(input);

      if (input.value === '') {
        formAddError(input);
        error++;
      }
    }

    if (error === 0) {
      storage.data = JSON.stringify({
        name: userName.value,
        place: place.value,
        review: review.value
      });

      listUpdate();
    } else {
      btn.addEventListener('click', () => {
        popup.classList.remove('open');
      })
    }
  }

  function formAddError(input) {
    input.classList.add('_error');
  }

  function formRemoveError(input) {
    input.classList.remove('_error');
  }

  const closeBtn = document.querySelector('.modal__close');
  closeBtn.addEventListener('click', function () {
    modal.style.display = 'none';
  });
}

function openModal(event) {
  let posY = event.getSourceEvent().originalEvent.domEvent.originalEvent.clientY;
  let posX = event.getSourceEvent().originalEvent.domEvent.originalEvent.clientX;
  coords = event.get('coords');

  // const modal = document.getElementById('modal');
  modal.style.display = 'block';
  modal.style.left = `${posX}px`;
  modal.style.top = `${posY}px`;
}

// Добавление пунктов в список отзывов
function listUpdate() {
  const data = JSON.parse(storage.data || '{}');
  let nowDate = new Date();
  let dateNow = nowDate.getDate().toString().padStart(2, '0') + '.' + (nowDate.getMonth() + 1).toString().padStart(2, '0') + '.' + nowDate.getFullYear();


  const nameOnList = document.createElement('span');
  const placeOnList = document.createElement('span');
  const dateOnList = document.createElement('span');
  const reviewOnList = document.createElement('span');
  const br = document.createElement('br');

  li.classList.add('modal-list__item');
  nameOnList.classList.add('modal-list__user-name');
  placeOnList.classList.add('modal-list__place');
  dateOnList.classList.add('modal-list__date');
  reviewOnList.classList.add('modal-list__review');

  nameOnList.textContent = data.name + ' ';
  placeOnList.textContent = data.place + ' ';
  dateOnList.textContent = dateNow;
  reviewOnList.textContent = data.review;

  li.append(nameOnList, placeOnList, dateOnList, br, reviewOnList);

  userName.value = '';
  place.value = '';
  review.value = '';
}

function addHint() {
  myPlacemark = new ymaps.Placemark(coords, {
    balloonContentHeader: '<ul class="modal-list">' + li.outerHTML + '</ul>',
    balloonContentBody:
      '<hr noshade size="1px">' +
      '<div class="modal__contant">' +
      '<h3 class="modal__title">Отзыв:</h3>' +
      '<form action="#" class="modal__form" id="reviewForm">' +
      '<input type="text" placeholder="Укажите ваше имя" id="name" class="modal__form-input _req">' +
      '<input type="text" placeholder="Укажите место" id="place" class="modal__form-input _req">' +
      '<textarea id="review" placeholder="Оставить отзыв" class="modal__form-review _req"></textarea>' +
      '<button type="submit" class="hintBtn">Добавить</button>' +
      '</form>' +
      '</div>'
  });

  myMap.geoObjects.add(myPlacemark);
}

