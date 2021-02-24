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
  console.log(objectId)
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
  let nowDate = new Date();
  let dateNow = nowDate.getDate().toString().padStart(2, '0') + '.' + (nowDate.getMonth() + 1).toString().padStart(2, '0') + '.' + nowDate.getFullYear();
  const storage = JSON.parse(localStorage.getItem(STORAGE_KEY));
  const reviewList = document.getElementById('reviewList');
  const reviewItem = document.createElement('div');
  reviewItem.setAttribute('id', 'reviewItem');
  reviewItem.innerHTML = `
  <div>
      <b>${storage[objectId].name}</b> ${storage[objectId].place} ${dateNow}
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