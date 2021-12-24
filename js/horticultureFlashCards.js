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
  card.addEventListener('click', function () {
    this.classList.toggle('flip');
  });
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

  let plntPropGrp = document.createElement('div');
  plntPropGrp.classList.add('plantProp');
  plntPropGrp.insertAdjacentHTML('afterbegin', '<p>Group</p>');
  sideBack.append(plntPropGrp);

  let plantValGrp = document.createElement('div');
  plantValGrp.classList.add('plantValue');
  plantValGrp.insertAdjacentHTML('afterbegin',
    '<p>' + plant.group + '</p>');
  sideBack.append(plantValGrp);

  let plntPropBot = document.createElement('div');
  plntPropBot.classList.add('plantProp');
  plntPropBot.insertAdjacentHTML('afterbegin', '<p>Botanical Name</p>');
  sideBack.append(plntPropBot);

  let plntValBot = document.createElement('div');
  plntValBot.classList.add('plantValue');
  plntValBot.insertAdjacentHTML('afterbegin',
    '<p>' + plant.botanicalName + '</p>');
  sideBack.append(plntValBot);

  let plntPropCom = document.createElement('div');
  plntPropCom.classList.add('plantProp');
  plntPropCom.insertAdjacentHTML('afterbegin', '<p>Common Name</p>');
  sideBack.append(plntPropCom);

  let plntValCom = document.createElement('div');
  plntValCom.classList.add('plantValue');
  plntValCom.insertAdjacentHTML('afterbegin',
    '<p>' + plant.commonName + '</p>');
  sideBack.append(plntValCom);

  if (plant.note) {
    let plntPropNote = document.createElement('div');
    plntPropNote.classList.add('plantProp', 'noteProp');
    plntPropNote.insertAdjacentHTML('afterbegin', '<p>Nota Bene</p>');
    sideBack.append(plntPropNote);

    let plntValNote = document.createElement('div');
    plntValNote.classList.add('plantValue', 'noteVal');
    plntValNote.insertAdjacentHTML('afterbegin',
      '<p>' + plant.note + '</p>');
    sideBack.append(plntValNote);
  }

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
