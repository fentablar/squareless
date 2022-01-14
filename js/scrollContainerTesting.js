
const shuffleArray = arr => {
  const len = arr.length;
  let shuffled = [];
  while (shuffled.length < len) {
    let rnd = Math.floor(Math.random() * len);
    if (!shuffled.includes(arr[rnd])) shuffled.push(arr[rnd]);
  }
  return shuffled;
}

const addElement = (parent, elem, ...classes) => {
  const newElem = document.createElement(elem);
  if (classes.length) newElem.classList.add(...classes);
  if (parent) parent.append(newElem);
  return newElem;
}

const showMeToggle = element => {
  return document.querySelector(element).classList.toggle('showMe');
}

const stakePanes = (side, paneArr) => {
  const parent = document.querySelector(side);
  parent.innerHTML = '';
  const panelFrame = addElement(parent, 'div', 'panelFrame');
  const panelWrap = addElement(panelFrame, 'div', 'panelWrap');
  for (pane of paneArr) {
    const panel = addElement(panelWrap, 'div', 'panel')
    const p = addElement(panel, 'div', 'pane');
    p.innerHTML = pane;
  }
}

// kan

const kan = {
  set cards(src) { this._deck = src; },
  get cards() { return this._deck; },
  set shuffle(arr) { this._mix = shuffleArray(arr); },
  get shuffle() { return this._mix; },
  set idx(val) { if (typeof val == 'number') this._mark = val; },
  get idx() { return this._mark; },
  get card() { return this.shuffle[this.idx]; }
}

// tong

const tong = {
  dealCard() {
    const card = kan.card;
    if (card.front.shuffle) {
      stakePanes('.front', shuffleArray(card.front.panes));
    } else stakePanes('.front', card.front.panes);
    if (card.back.shuffle) {
      stakePanes('.back', shuffleArray(card.back.panes));
    } else stakePanes('.back', card.back.panes);
  },
  iterate() {
    document.querySelector('.content > .outerWrap').classList.remove('pivot');
    showMeToggle('.content');
    this.dealCard();
    setTimeout(() => { showMeToggle('.content') }, 400);
  },
  reset() {
    kan.idx = 0;
    kan.shuffle = kan.cards;
    tong.iterate();
  },
  prev() {
    const n = kan.idx - 1;
    if (n >= 0) {
      kan.idx = n;
      tong.iterate();
    } else alert('No prior cards to show');
  },
  next() {
    const n = kan.idx + 1;
    if (n < kan.cards.length) {
      kan.idx = n;
      tong.iterate();
    } else alert('No more cards to show');
  },
  initialize(src) {
    kan.cards = src;
    kan.idx = 0;
    kan.shuffle = kan.cards;
    const findAdd = (elem, func) => {
      document.querySelector(elem).addEventListener('click', func);
    };
    findAdd('button.prev', this.prev);
    findAdd('button.next', this.next);
    findAdd('button.reset', this.reset);
    findAdd('.content > .outerWrap', function () {
      this.classList.toggle('pivot');
    });
    setTimeout(() => { showMeToggle('.controls') }, 250);
    this.dealCard();
    setTimeout(() => { showMeToggle('.content') }, 500);
  }
}

// retrieve and process data

function genericCards() {
  let cards = [];
  let len = Math.floor(Math.random() * 12) + 7;
  for (let i = 0; i <= len; i++) {
    let card = {
      id: i,
      front: { panes: [], shuffle: true },
      back: { panes: [], shuffle: false }
    };
    let len2 = Math.floor(Math.random() * 5) + 5;
    for (let j = 0; j < len2; j++) {
      let pane = '<p>Card &#' + (i+65) + '</p>'
                + '<p>Pane ' + j + '</p>';
      card.front.panes.push(pane);
    }
    let back = '<p>id = ' + i + '</p>'
              + '<p>no. of panes = ' + len2 + '</p>';
    card.back.panes.push(back);
    cards.push(card);
  }
  tong.initialize(cards);
}

function horticultureFlashCards() {
  const src = 'https://fentablar.github.io/squareless/kan/horticultureFlashCards.json';
  fetch(src)
  .then(resp => resp.json())
  .then(json => {
    let cards = [];
    for (plant of json.plants) {
      let card = {
        front: { panes: [], shuffle: true },
        back: { panes: [], shuffle: false }
      };
    }
  });
}

genericCards();
