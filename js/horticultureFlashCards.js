
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

const scaleImage = (img, parent) => {
  const pstyle = window.getComputedStyle(parent);
  const pw = pstyle.getPropertyValue('width');
  const ph = pstyle.getPropertyValue('height');
  const pWidth = pw.slice(0, pw.length - 2);
  const pHeight = ph.slice(0, ph.length - 2);
  const pRatio = pWidth / pHeight;
  const iRatio = img.naturalWidth / img.naturalHeight;
  if (pRatio > iRatio) {
    img.width = pHeight * iRatio;
    img.height = pHeight;
  } else {
    img.width = pWidth;
    img.height = pWidth / iRatio;
  }
  return img;
}

const promisePanes = (wrap, paneArr) => {
  const promArr = [];
  for (pane of paneArr) {
    const panel = addElement(wrap, 'div', 'panel');
    switch (pane.type) {
      case 'imgSingle': {
        const imgSingle = new Image();
        imgSingle.src = pane.data;
        imgSingle.classList.add('pane', 'imgSingle');
        promArr.push(imgSingle.decode()
          .then(() => { scaleImage(imgSingle, panel); })
          .then(() => { panel.append(imgSingle); }));
        break;
      }
      case 'txtProps': {
        const txtProps = addElement(panel, 'div', 'pane', 'txtProps');
        for (prop of pane.data) {
          const txtProp = addElement(txtProps, 'p', 'txtProp');
          const txtVal = addElement(txtProps, 'p', 'txtVal');
          txtProp.innerText = prop.prop;
          txtVal.innerText = prop.val;
          if (prop.prop == 'Nota Bene') {
            txtProp.classList.add('noteProp');
            txtVal.classList.add('noteVal');
          }
        }
        promArr.push(Promise.resolve(txtProps));
        break;
      }
    }
  }
  return Promise.all(promArr);
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
    const card = kan.card, frPanes = card.front.panes, bkPanes = card.back.panes;
    const frWrap = qrySel('.front .panelWrap'), bkWrap = qrySel('.back .panelWrap');
    frWrap.innerHTML = '';
    bkWrap.innerHTML = '';
    qrySel('.front > .panelFrame').scrollLeft = 0;
    qrySel('.back > .panelFrame').scrollLeft = 0;
    const frArr = card.front.shuffle ? shuffleArray(frPanes) : frPanes;
    const bkArr = card.back.shuffle ? shuffleArray(bkPanes) : bkPanes;
    return Promise.all([promisePanes(frWrap, frArr), promisePanes(bkWrap, bkArr)]);
  },
  iterate() {
    const contentWrap = qrySel('.content > .outerWrap');
    contentWrap.classList.remove('pivot');
    cssToggle(contentWrap, 'hideMe');
    Promise.resolve(this.dealCard())
    .then(() => setTimeout(() => { cssToggle(contentWrap, 'hideMe'); }, 200));
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

function horticultureFlashCards() {
  const src = 'https://fentablar.github.io/squareless/kan/horticultureFlashCards.json';
  fetch(src)
  .then(resp => resp.json())
  .then(json => {
    const imgRoot = json.imgRoot;
    const cards = [];
    for (plant of json.plants) {
      const card = {
        front: { panes: [], shuffle: true },
        back: { panes: [], shuffle: false }
      };
      for (image of plant.images) {
        const pane = { type: 'imgSingle', data: imgRoot.concat(image) };
        card.front.panes.push(pane);
      }
      const infoPane = { type: 'txtProps', data: [] };
      const displayNames = {
        group: 'Group',
        botanicalName: 'Botanical Name',
        commonName: 'Common Name',
        note: 'Nota Bene'
      }
      for (key of Object.keys(displayNames)) {
        if (plant[key]) {
          const prop = { prop: displayNames[key], val: plant[key] };
          infoPane.data.push(prop);
        }
      }
      card.back.panes.push(infoPane);
      cards.push(card);
    }
    tong.initialize(cards);
  });
}

horticultureFlashCards();
