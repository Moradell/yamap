let myMap;
let coords;
let objectId = 0;
let reviews = [];
const formTemlate = document.getElementById('reviewForm');
const modal = document.getElementById('modal');
const userName = document.getElementById('name');
const place = document.getElementById('place');
const review = document.getElementById('review');
const STORAGE_KEY = 'reviews_content';

ymaps.ready(init);

function init() {
  myMap = new ymaps.Map('map', {
    center: [55.76, 37.64],
    zoom: 10
  });

  const reviews = JSON.parse(localStorage.getItem(STORAGE_KEY));
  for (const item of reviews) {
    myMap.geoObjects.add(new ymaps.Placemark(item.coords));
  }

  objectManager = new ymaps.ObjectManager({
    clusterize: true,
    gridSize: 32,
    clusterDisableClickZoom: true
  });

  myMap.geoObjects.add(objectManager);

  addListeners();
}

function addListeners() {
  myMap.events.add('click', function (event) {
    coords = event.get('coords');
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
  showModal(event);
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