
// reusable formulae

  // take existing array, return new array with items in random order
const shuffleArray = arr => {
  const len = arr.length;
  let shuffled = [];
  while (shuffled.length < len) {
    let rnd = Math.floor(Math.random() * len);
    if (!shuffled.includes(arr[rnd])) shuffled.push(arr[rnd]);
  }
  return shuffled;
}

  // random number, multiply by X and offset by Y
const rndNum = (x, y=0) => {
  return Math.floor(Math.random() * x) + y;
}

  // n lengh, x multiply, y offset
const rndNumArr = (n, x, y) => {
  let arr = [];
  while (arr.length < n) {
    const rnd = rndNum(x, y);
    if (!arr.includes(rnd)) arr.push(rnd);
  }
  return arr;
}

  // create DOM element, add classes and append to parent
const addElement = (parent, elem, ...classes) => {
  const newElem = document.createElement(elem);
  if (classes.length) newElem.classList.add(...classes);
  if (parent) parent.append(newElem);
  return newElem;
}

  // pretty much the same as addElement, but with querySelector for parent
const qrySelAddElem = (qrySel, elem, ...classes) => {
  const parent = document.querySelector(qrySel);
  return addElement(parent, elem, ...classes);
}

  // wrapped button element
const addWrappedButton = (parent, buttType, label, ...classes) => {
  const buttonWrap = addElement(parent, 'div', 'buttonWrap');
  const button = addElement(buttonWrap, 'button', ...classes);
  button.setAttribute('type', buttType);
  button.innerHTML = label;
  return button;
}


// build html structure

const addMainSections = () => {
  const main = qrySelAddElem('body', 'main');
  addElement(main, 'section', 'content');
  addElement(main, 'section', 'controls');
}

const content = {
  cards: [],
  shuffled: [],
  get card() {
    return this.shuffled[controls.queue];
  },
  set deck(src) {
    this.cards = src;
  },
  shuffleCards() {
    this.shuffled = shuffleArray(this.cards);
  },
  initialize() {
    const wrapRemove = document.querySelector('.content > .outerWrap');
    if (wrapRemove) wrapRemove.remove();

    const outerWrap = qrySelAddElem('.content', 'div', 'outerWrap');
    const innerWrap = addElement(outerWrap, 'div', 'innerWrap');
    const frontSide = addElement(innerWrap, 'div', 'side', 'front');
    const backSide = addElement(innerWrap, 'div', 'side', 'back');

    outerWrap.addEventListener('click', function () {
      this.classList.toggle('pivot');
    });

    const panelFrame = addElement(frontSide, 'div', 'panelFrame');
    const panelWrap = addElement(panelFrame,'div', 'panelWrap');
    const panes = this.card.panes;
    for (pane of panes) {
      const panel = addElement(panelWrap, 'div', 'panel');
      const p = addElement(panel, pane.elem, 'pane');
      p.innerHTML = pane.content;
    }

    const infoWrap = addElement(backSide, 'div', 'infoWrap');
    const props = Object.keys(this.card).filter(a => a != 'panes');
    for (prop of props) {
      if (prop != 'note') {
        const infoProp = addElement(infoWrap, 'div', 'infoProp');
        infoProp.innerHTML = prop;
        const infoValue = addElement(infoWrap, 'div', 'infoValue');
        infoValue.innerHTML = this.card[prop];
      }
      if (prop == 'note') {
        const noteProp = addElement(infoWrap, 'div','infoProp', 'noteProp');
        noteProp.innerHTML = this.card[prop].displayProp;
        const noteVal = addElement(infoWrap, 'div', 'infoValue', 'noteVal');
        noteVal.innerHTML = this.card[prop].value;
      }
    }
  }
}

const controls = {
  queue: 0,
  set deal(num) {
    if (num === 0) this.queue = 0;
    else {
      let sum = this.queue + num;
      if (sum < 0) alert('No prior cards to show');
      if (sum >= content.shuffled.length) alert('No more cards to show');
      if (sum >= 0 && sum < content.shuffled.length) this.queue = sum;
    }
  },
  sewButtons() {
    const outerWrap = qrySelAddElem('.controls', 'div', 'outerWrap');
    const innerWrap = addElement(outerWrap, 'div', 'innerWrap');

    const prvIco = '<svg xmlns="http://www.w3.org/2000/svg" '
      + 'width="24" height="24" viewBox="0 0 24 24" stroke-width="2" '
      + 'stroke="currentColor" fill="none" stroke-linecap="round" '
      + 'stroke-linejoin="round">'
      + '<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>'
      + '<path d="M21 5v14l-8 -7z"></path><path d="M10 5v14l-8 -7z"></path></svg>';
    const prev = addWrappedButton(innerWrap, 'button', prvIco, 'iterate', 'prev');

    const nxtIco = '<svg xmlns="http://www.w3.org/2000/svg" '
      + 'width="24" height="24" viewBox="0 0 24 24" stroke-width="2" '
      + 'stroke="currentColor" fill="none" stroke-linecap="round" '
      + 'stroke-linejoin="round">'
      + '<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>'
      + '<path d="M3 5v14l8 -7z"></path><path d="M14 5v14l8 -7z"></path></svg>';
    const next = addWrappedButton(innerWrap, 'button', nxtIco, 'iterate', 'next');

    const rstIco = '<svg xmlns="http://www.w3.org/2000/svg" '
      + 'width="24" height="24" viewBox="0 0 24 24" stroke-width="2" '
      + 'stroke="currentColor" fill="none" stroke-linecap="round" '
      + 'stroke-linejoin="round">'
      + '<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>'
      + '<path d="M3 17h5l1.67 -2.386m3.66 -5.227l1.67 -2.387h6"></path>'
      + '<path d="M18 4l3 3l-3 3"></path><path d="M3 7h5l7 10h6"></path>'
      + '<path d="M18 20l3 -3l-3 -3"></path></svg>';
    const reset = addWrappedButton(innerWrap, 'button', rstIco, 'iterate', 'reset');

    prev.addEventListener('click', function () {
      controls.deal = -1;
      return content.initialize();
    });
    next.addEventListener('click', function() {
      controls.deal = 1;
      return content.initialize();
    });
    reset.addEventListener('click', function() {
      controls.deal = 0;
      content.shuffleCards();
      return content.initialize();
    });
  }
}


// generic, random set of cards
const genericCards = elem => {
  let cards = [];
  const numArr = rndNumArr(rndNum(12, 3), 26, 65);
  for (num of numArr) {
    const paneArr = rndNumArr(rndNum(7, 5), 12, 3);
    let paneObjArr = [];
    for (let i = 0; i < paneArr.length; i++) {
      const obj = {
        elem: elem,
        content: 'Card &#' + num + '<br>Pane ' + paneArr[i] 
      }
      paneObjArr.push(obj);
    }
    let cardObj = {
      panes: paneObjArr,
      paneCount: paneObjArr.length,
      card: '&#' + num,
      note: {
        displayProp: 'gibberish',
        value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit,'
                + ' sed do eiusmod tempor incididunt ut labore et dolore magna'
                + ' aliqua. Ut enim ad minim veniam, quis nostrud exercitation'
                + ' ullamco laboris nisi ut aliquip ex ea commodo consequat.'
      }
    }
    cards.push(cardObj);
  }
  return cards;
}


const launch = () => {
  addMainSections();
  content.deck = genericCards('p');
  content.shuffleCards();
  content.initialize();
  controls.sewButtons();
}


// do the stuff

launch();
