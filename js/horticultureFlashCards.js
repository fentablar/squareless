const kan = 'https://fentablar.github.io/squareless/kan/horticultureFlashCards.json';
const imgRoot = 'https://res.cloudinary.com/fentablar/image/upload/v1632844188/horticultureFlashCards/'

let plants = [];
let cardOrder = [];
let plant = {
    'commonName': '',
    'botanicalName': '',
    'group': '',
    'images': [],
    'note': ''
  }

const shuffleCards = arr => {
  let nums = [];
  let shuffled = [];
  while (nums.length < arr.length) {
    let rnd = Math.floor(Math.random() * arr.length);
    if (!nums.includes(rnd)) nums.push(rnd);
  }
  for (num of nums) {
    shuffled.push(arr[num]);
  }
  return cardOrder = shuffled;
}

const iterate = () => {
  if (!cardOrder.length) shuffleCards(plants);
  return plant = cardOrder.shift();
}

const buildCard = () => {
  let card = document.createElement('div');
  card.setAttribute('id', 'card');
  flashcardWrap.append(card);

  let cardWrap = document.createElement('div');
  cardWrap.classList.add('cardWrap');
  card.append(cardWrap);

  let sideFront = document.createElement('div');
  sideFront.classList.add('side', 'front');
  cardWrap.append(sideFront);

  let rnd = Math.floor(Math.random() * plant.images.length);
  let cardImg = document.createElement('div');
  cardImg.classList.add('cardImg');
  cardImg.insertAdjacentHTML('afterbegin',
    '<img src="' + imgRoot + plant.images[rnd] + '" >');
  sideFront.append(cardImg);

  let sideBack = document.createElement('div');
  sideBack.classList.add('side', 'back');
  cardWrap.append(sideBack);

  let cardInfo = document.createElement('div');
  cardInfo.classList.add('cardInfo');
  cardInfo.insertAdjacentHTML('afterbegin',
    '<p>' + plant.commonName + '</p>' +
    '<p>' + plant.botanicalName + '</p>' +
    '<p>' + plant.group + '</p>' +
    '<p>' + (plant.note ? plant.note : '') + '</p>');
  sideBack.append(cardInfo);

  return;
}

const nextCard = () => {
  if (card) card.remove();
  iterate();
  return buildCard();
};

const fetchPlants = fetch(kan)
                    .then(resp => resp.json())
                    .then(json => {
                      plants = json.plants;
                      shuffleCards(plants);
                      iterate(cardOrder, plant);
                      buildCard();
                      next.addEventListener('click', nextCard);
                      return;
                    });
