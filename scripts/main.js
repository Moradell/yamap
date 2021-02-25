let myMap;
let coords;
let objectId = 0;
let reviews = [];
const formTemlate = document.getElementById('reviewForm');
const modal = document.getElementById('modal');
const userName = document.getElementById('name');
const place = document.getElementById('place');
const review = document.getElementById('review');
const closeBtn = document.getElementById('closeBtn');
const STORAGE_KEY = 'reviews_content';

ymaps.ready(init);

function init() {
  myMap = new ymaps.Map('map', {
    center: [55.76, 37.64],
    zoom: 10
  });

  let customItemContentLayout = ymaps.templateLayoutFactory.createClass(
    '<div class=balloon-content>' +
    '<h2 class=balloon-header>{{ properties.balloonContentHeader|raw }}</h2>' +
    '<div class=balloon-body>{{ properties.balloonContentBody|raw }}</div>' +
    '<div class=balloon-footer>{{ properties.balloonContentFooter|raw }}</div>' +
    '</div>'
  );

  objectManager = new ymaps.ObjectManager({
    clusterize: true,
    clusterBalloonItemContentLayout: customItemContentLayout,
    geoObjectOpenBalloonOnClick: false,
    clusterOpenBalloonOnClick: true,
    clusterDisableClickZoom: true,
    clusterBalloonContentLayout: 'cluster#balloonCarousel',
  });

  myMap.geoObjects.add(objectManager);

  const storage = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (storage) {
    Array.from(storage).forEach((item) => {
      let featuresObj = {
        type: 'Feature',
        id: item.objectId,
        geometry: {
          type: 'Point',
          coordinates: item.coords
        },
        properties: {
          'balloonContentHeader': `${item.place}`,
          'balloonContentBody': `${item.review}`,
          'balloonContentFooter': `${item.name} ${new Date().toLocaleDateString()}`,
        }
      };

      reviews.push({
        objectId: item.objectId,
        name: item.name,
        place: item.place,
        review: item.review,
        coords: item.coords
      });

      objectManager.add({
        'type': 'FeatureCollection',
        'features': [featuresObj]
      });

      objectId++;
    })
    // objectId = Math.max.apply(Math, storage.map(function (e) { return e.objectId; }));
  }
  addListeners();
}

function addListeners() {
  myMap.events.add('click', function (event) {
    coords = event.get('coords');
    delRev();
    showModal(event);
  });

  const form = document.getElementById('reviewForm');
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    formValidate();
  });

  objectManager.objects.events.add('click', (event) => onObjectEvent(event));
  objectManager.clusters.events.add('click', (event) => onClusterEvent(event));
}

function clearInputs() {
  userName.value = '';
  place.value = '';
  review.value = '';
}

function onObjectEvent(event) {
  const objectId = event.get('objectId');
  coords = reviews[objectId].coords;
  showModal(event);
  updateReviews(objectId);
}

function onClusterEvent(event) {

}

function showModal(event) {
  delRev();
  let posY = event.getSourceEvent().originalEvent.domEvent.originalEvent.clientY;
  let posX = event.getSourceEvent().originalEvent.domEvent.originalEvent.clientX;
  modal.style.display = 'block';
  modal.style.left = `${posX}px`;
  modal.style.top = `${posY}px`;
}

function closeModal() {
  modal.style.display = 'none';
}

function createPlacemark() {
  let featuresObj = {
    type: 'Feature',
    id: objectId,
    geometry: {
      type: 'Point',
      coordinates: coords
    },
    properties: {
      'balloonContentHeader': `${place.value}`,
      'balloonContentBody': `${review.value}`,
      'balloonContentFooter': `${userName.value} ${new Date().toLocaleDateString()}`,
    }
  };

  reviews.push({
    objectId: objectId,
    name: userName.value,
    place: place.value,
    review: review.value,
    coords: coords
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));

  objectManager.add({
    'type': 'FeatureCollection',
    'features': [featuresObj]
  });

  objectId++;
}

function updateReviews(objectId) {
  let dateNow = new Date().toLocaleDateString();
  const storage = reviews.find(x => x.objectId === objectId);
  if (!storage && !storage.review) {
    return;
  }
  const reviewList = document.getElementById('reviewList');
  const reviewItem = document.createElement('div');
  reviewItem.setAttribute('id', 'reviewItem');
  reviewItem.innerHTML = `
  <div>
      <b>${storage.name}</b> ${storage.place} ${dateNow}
    </div>
    <div>${storage.review}</div>
  `;
  reviewList.appendChild(reviewItem);
}

function delRev() {
  const reviewItem = document.getElementById("reviewItem")
  if (reviewItem) {
    reviewItem.remove();
  }
  let formReq = document.querySelectorAll('._req');
  for (let i = 0; i < formReq.length; i++) {
    const input = formReq[i];
    formRemoveError(input);
  }
}

closeBtn.addEventListener('click', function () {
  closeModal();
})

function formValidate() {
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
    createPlacemark();
    clearInputs();
    closeModal();
  }
}

function formAddError(input) {
  input.classList.add('_error');
}

function formRemoveError(input) {
  input.classList.remove('_error');
}