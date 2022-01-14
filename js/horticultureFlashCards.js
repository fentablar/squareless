
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

const qrySel = element => document.querySelector(element);

const cssToggle = (element, css) => element.classList.toggle(css);

const stakePanes = (side, paneArr) => {
  const parent = document.querySelector(side);
  parent.innerHTML = '';
  const panelFrame = addElement(parent, 'div', 'panelFrame');
  const panelWrap = addElement(panelFrame, 'div', 'panelWrap');
  for (pane of paneArr) {
    const panel = addElement(panelWrap, 'div', 'panel');
    panel.innerHTML = pane;
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
    const contentWrap = qrySel('.content > .outerWrap');
    contentWrap.classList.remove('pivot');
    cssToggle(contentWrap, 'hideMe');
    this.dealCard();
    setTimeout(() => { cssToggle(contentWrap, 'hideMe'); }, 200);
  },
  reset() {
    const content = qrySel('.content');
    cssToggle(content, 'showMe');
    kan.idx = 0;
    kan.shuffle = kan.cards;
    tong.iterate();
    setTimeout(() => { cssToggle(content, 'showMe'); }, 300);
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
    const content = qrySel('.content');
    const controls = qrySel('.controls');
    const contentWrap = qrySel('.content > .outerWrap');
    kan.cards = src;
    kan.idx = 0;
    kan.shuffle = kan.cards;
    const addClick = (element, func) => {
      element.addEventListener('click', func);
    };
    addClick(qrySel('.darkMode'), function () {
      cssToggle(document.body, 'dark');
    });
    addClick(qrySel('button.prev'), this.prev);
    addClick(qrySel('button.next'), this.next);
    addClick(qrySel('button.reset'), this.reset);
    addClick(contentWrap, function () {
      cssToggle(contentWrap, 'pivot');
    });
    setTimeout(() => { cssToggle(controls, 'showMe'); }, 250);
    this.dealCard();
    setTimeout(() => { cssToggle(content, 'showMe'); }, 400);
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
    const iWrap = '<div class="pane infoWrap">';
    let len2 = Math.floor(Math.random() * 5) + 5;
    for (let j = 0; j < len2; j++) {
      let pane = '<p>Card &#' + (i+65) + '</p>'
                + '<p>Pane ' + j + '</p></div>';
      card.front.panes.push(iWrap.concat(pane));
    }
    let back = '<p>id = ' + i + '</p>'
              + '<p>no. of panes = ' + len2 + '</p></div>';
    card.back.panes.push(iWrap.concat(back));
    cards.push(card);
  }
  tong.initialize(cards);
}

function horticultureFlashCards() {
  const src = 'https://fentablar.github.io/squareless/kan/horticultureFlashCards.json';
  fetch(src)
  .then(resp => resp.json())
  .then(json => {
    const imgRoot = json.imgRoot;
    let cards = [];
    for (plant of json.plants) {
      let card = {
        front: { panes: [], shuffle: true },
        back: { panes: [], shuffle: false }
      };
      for (image of plant.images) {
        let pane = '<img class="pane" src=' + imgRoot.concat(image) + '>';
        card.front.panes.push(pane);
      }
      let infoPane = '<div class="pane infoWrap">';
      let displayNames = {
        group: 'Group',
        botanicalName: 'Botanical Name',
        commonName: 'Common Name',
        note: 'Nota Bene'
      }
      for (key of Object.keys(displayNames)) {
        if (plant[key]) {
          if (key != 'note') {
            let txt = '<p class="infoProp">' + displayNames[key] + '</p>'
                    + '<p class="infoValue">' + plant[key] + '</p>';
            infoPane = infoPane.concat(txt);
          } else {
            let txt = '<p class="infoProp noteProp">' + displayNames[key] + '</p>'
                    + '<p class="infoValue noteVal">' + plant[key] + '</p>';
            infoPane = infoPane.concat(txt);
          }
        }
      }
      infoPane = infoPane.concat('</div>');
      card.back.panes.push(infoPane);
      cards.push(card);
    }
    tong.initialize(cards);
  });
}

horticultureFlashCards();
