const kan =
  'https://fentablar.github.io/squareless/kan/horticultureFlashCards.json';
const imgRoot =
  'https://res.cloudinary.com/fentablar/image/upload/v1632844188/horticultureFlashCards/'

let plants = [];
let cardOrder = [];
let plant = {
    'commonName': '',
    'botanicalName': '',
    'group': '',
    'images': [],
    'note': ''
  }

const shuffle = arr => {
  let shuffled = [];
  while (shuffled.length < arr.length) {
    let rnd = Math.floor(Math.random() * arr.length);
    if (!shuffled.includes(arr[rnd])) shuffled.push(arr[rnd]);
  }
  return shuffled;
}

const getNextPlant = () => {
  if (!cardOrder.length) cardOrder = shuffle(plants);
  return plant = cardOrder.shift();
}

const buildMain = () => {
  const body = document.querySelector('body');
  const main = document.createElement('main');

  return body.append(main);
}

const buildContentWraps = () => {
  const main = document.querySelector('main');
  const content = document.createElement('section');
  content.classList.add('content');

  const outerWrap = document.createElement('div');
  outerWrap.classList.add('outerWrap');
  outerWrap.addEventListener('click', function () {
    this.classList.toggle('pivot');
  });
  content.append(outerWrap);

  const innerWrap = document.createElement('div');
  innerWrap.classList.add('innerWrap');
  outerWrap.append(innerWrap);

  return main.append(content);
}

const buildFront = () => {
  const innerWrap = document.querySelector('.innerWrap');
  const front = document.createElement('div');
  front.classList.add('side', 'front');

  return innerWrap.append(front);
}

const buildFrontFrame = () => {
  const front = document.querySelector('.front');
  const frontFrame = document.createElement('div');
  frontFrame.classList.add('frontFrame');

  const cardWrap = document.createElement('div');
  cardWrap.classList.add('cardWrap');
  frontFrame.append(cardWrap);

  return front.append(frontFrame);
}

const populateCardWrap = () => {
  const cardWrap = document.querySelector('.cardWrap');
  const cards = shuffle(plant.images);
  for (card of cards) {
    const cardFrame = document.createElement('div');
    cardFrame.classList.add('cardFrame');
    cardWrap.append(cardFrame);

    const cardImg = document.createElement('img');
    cardImg.classList.add('card');
    cardImg.setAttribute('src', imgRoot.concat(card));
    cardFrame.append(cardImg);
  }
  return;
}

const paintFrontSide = () => {
  buildFront();
  buildFrontFrame();
  populateCardWrap();
  return;
}

const buildBack = () => {
  const innerWrap = document.querySelector('.innerWrap');
  const back = document.createElement('div');
  back.classList.add('side', 'back');

  return innerWrap.append(back);
}

const populateBack = () => {

  const back = document.querySelector('.back');

  const plantPropGrp = document.createElement('div');
  plantPropGrp.classList.add('plantProp');
  plantPropGrp.innerText = 'Group';
  back.append(plantPropGrp);

  const plantValGrp = document.createElement('div');
  plantValGrp.classList.add('plantValue');
  plantValGrp.innerText = plant.group;
  back.append(plantValGrp);

  const plantPropBot = document.createElement('div');
  plantPropBot.classList.add('plantProp');
  plantPropBot.innerText = 'Botanical Name';
  back.append(plantPropBot);

  const plantValBot = document.createElement('div');
  plantValBot.classList.add('plantValue');
  plantValBot.innerText = plant.botanicalName;
  back.append(plantValBot);

  const plantPropCom = document.createElement('div');
  plantPropCom.classList.add('plantProp');
  plantPropCom.innerText = 'Common Name';
  back.append(plantPropCom);

  const plantValCom = document.createElement('div');
  plantValCom.classList.add('plantValue');
  plantValCom.innerText = plant.commonName;
  back.append(plantValCom);

  if (plant.note) {
    const plantPropNote = document.createElement('div');
    plantPropNote.classList.add('plantProp', 'noteProp');
    plantPropNote.innerText = 'Nota Bene';
    back.append(plantPropNote);

    const plantValNote = document.createElement('div');
    plantValNote.classList.add('plantValue', 'noteVal');
    plantValNote.innerText = plant.note;
    back.append(plantValNote);
  }

  return;
}

const paintBackSide = () => {
  buildBack();
  populateBack();
  return;
}

const iteration = () => {
  const front = document.querySelector('.front');
  const back = document.querySelector('.back');
  if (front) front.remove();
  if (back) back.remove();
  getNextPlant();
  paintFrontSide();
  paintBackSide();

  return;
}

const buildControls = () => {
  const main = document.querySelector('main');
  const controls = document.createElement('section');
  controls.classList.add('controls');

  const iterate = document.createElement('button');
  iterate.classList.add('iterate');
  iterate.setAttribute('type', 'button');
  iterate.textContent = 'Next';
  iterate.addEventListener('click', iteration);
  controls.append(iterate);

  return main.append(controls);
}

const fetchPlants = fetch(kan)
                    .then(resp => resp.json())
                    .then(json => {
                      plants = json.plants;
                      buildMain();
                      buildContentWraps();
                      buildControls();
                      iteration();

                      return;
                    });
