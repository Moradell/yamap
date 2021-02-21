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

  objectManager = new ymaps.ObjectManager({
    clusterize: true,
    gridSize: 32,
    clusterDisableClickZoom: true
  });

  myMap.geoObjects.add(objectManager);

  const storage = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (storage) {
    Array.from(storage).forEach((item, index) => {
      let featuresObj = {
        'type': 'Feature',
        'id': index,
        'geometry': {
          'type': 'Point',
          'coordinates': item.coords
        },
        'properties': {
          hintContent: place.value,
        }
      };

      reviews.push({
        objectId: index,
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
  }
  addListeners();
}

function addListeners() {
  myMap.events.add('click', function (event) {
    coords = event.get('coords');
    delRev();
    showModal(event);
  });

  objectManager.objects.events.add('click', (event) => onObjectEvent(event));
  objectManager.clusters.events.add('click', (event) => onClusterEvent(event));

  const form = document.getElementById('reviewForm');
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    createPlacemark();
    clearInputs();
    closeModal();
  })
}

function clearInputs() {
  userName.value = '';
  place.value = '';
  review.value = '';
}

function onObjectEvent(event) {
  const objectId = event.get('objectId');
  delRev();
  showModal(event);
  updateReviews(objectId);
}

function onClusterEvent(event) {

}

function showModal(event) {
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
    'type': 'Feature',
    'id': objectId,
    'geometry': {
      'type': 'Point',
      'coordinates': coords
    },
    'properties': {
      hintContent: place.value,
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
  let date = new Date();
  const year = (date.getFullYear());
  const mounth = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = (date.getDate()).toString().padStart(2, '0');
  const newDate = day + '.' + mounth + '.' + year;
  const storage = JSON.parse(localStorage.getItem(STORAGE_KEY));
  const reviewList = document.getElementById('reviewList');
  const reviewItem = document.createElement('div');
  reviewItem.setAttribute('id', 'reviewItem');
  reviewItem.innerHTML = `
  <div>
      <b>${storage[objectId].name}</b> ${storage[objectId].place} ${newDate}
    </div>
    <div>${storage[objectId].review}</div>
  `;
  reviewList.appendChild(reviewItem);
}

function delRev() {
  const reviewItem = document.getElementById("reviewItem")
  if (reviewItem) {
    reviewItem.remove();
  }
}

closeBtn.addEventListener('click', function () {
  closeModal();
})