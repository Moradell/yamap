let myMap;
let coords;
let storage = localStorage;
let li = document.createElement('li');
const formTemlate = document.querySelector('#addFormTemlate').innerHTML;
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
    coords = event.get('coords');
    onClick(coords);
    clickOnBtn();
  });
}

function onClick(coords) {
  const form = this.createForm(coords);
  openBalloon(coords, form.innerHTML);
}

function openBalloon(coords, content) {
  myMap.balloon.open(coords, content);
}

function setBalloonContent(content) {
  myMap.balloon.setData(content);
}

function closeBalloon() {
  myMap.balloon.close();
}

function createForm(coords) {
  const root = document.createElement('div');
  root.innerHTML = formTemlate;
  const reviewList = root.querySelector('.review-list');
  const reviewForm = root.querySelector('[data-role=review-form]');
  reviewForm.dataset.coords = JSON.stringify(coords);

  return root;
}

function createPlacemark(coords) {
  const placemark = new ymaps.Placemark(coords, {
    balloonContentHeader: '',
    balloonContentBody: createForm(coords).outerHTML
  });
  myMap.geoObjects.add(placemark);

  // placemark.events.add('click', function () {
  //   console.log(123456)
  // })
}

function clickOnBtn() {
  document.body.addEventListener('click', function (e) {
    if (e.target.dataset.role === 'review-add') {
      createPlacemark(coords);

      const reviewForm = document.querySelector('[data-role=review-form]');
      const coord = JSON.parse(reviewForm.dataset.coords);
      const data = {
        coord,
        name: document.querySelector('[data-role=review-name]').value,
        place: document.querySelector('[data-role=review-place]').value,
        text: document.querySelector('[data-role=review-text]').value,
      };
      const value = JSON.stringify(data)
      storage.setItem(coord, value);

      closeBalloon();
    }
  })
}
