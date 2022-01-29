
const jing = {
  shuffleArray(array) {
    const len = array.length;
    let shuffled = [];
    while (shuffled.length < len) {
      let rnd = Math.floor(Math.random() * len);
      if (!shuffled.includes(array[rnd])) shuffled.push(array[rnd]);
    }
    return shuffled;
  },
  addElement(parent, element, ...classes) {
    const newElement = document.createElement(element);
    if (classes.length) newElement.classList.add(...classes);
    if (parent) parent.append(newElement);
    return newElement;
  }
}


const kan = {
  set cards(src) { this._deck = src; },
  get cards() { return this._deck; },
  set shuffle(arr) { this._mix = jing.shuffleArray(arr); },
  get shuffle() { return this._mix; },
  set idx(num) { if (typeof num == 'number') this._mark = num; },
  get idx() { return this._mark; },
  get card() { return this.shuffle[this.idx]; },
  set frontPanel(panel) { this._fp = panel; },
  get frontPanel() { return this._fp; },
  set backPanel(panel) { this._bp = panel; },
  get backPanel() { return this._bp; },
  set scrolling(bool) { this._lock = bool; },
  get scrolling() { return this._lock; }
}


const jie = {
  get portOrient() { return window.matchMedia('(orientation: portrait)'); },
  get content() { return {
    section: jie.qSel('.content'),
    outerWrap: jie.qSel('.content > .outerWrap'),
    front: {
      frame: jie.qSel('.front > .panelFrame'),
      wrap: jie.qSel('.front .panelWrap'),
      panels: document.querySelectorAll('.front .panel')
    },
    back: {
      frame: jie.qSel('.back > .panelFrame'),
      wrap: jie.qSel('.back .panelWrap'),
      panels: document.querySelectorAll('.back .panel')
    },
    oneImgPanes: document.querySelectorAll('.imgSingle')
  }},
  get controls() { return {
    section: jie.qSel('.controls'),
    buttons: {
      prev: jie.qSel('button.prev'),
      next: jie.qSel('button.next'),
      reset: jie.qSel('button.reset')
    },
    darkMode: jie.qSel('.darkMode')
  }},
  qSel(element) { return document.querySelector(element); },
  toggle(element, cssClass) { return element.classList.toggle(cssClass); },
  scaleImg(img, container) {
    const cWidth = container.offsetWidth * 0.92,
          cHeight = container.offsetHeight * 0.92,
          iWidth = img.naturalWidth,
          iHeight = img.naturalHeight,
          cRatio = cWidth / cHeight,
          iRatio = iWidth / iHeight;

    if (cRatio > iRatio) {
      img.width = cHeight * iRatio;
      img.height = cHeight;
    } else {
      img.width = cWidth;
      img.height = cWidth /iRatio;
    }
  },
  scaleImgPanes() {
    const imgArr = jie.content.oneImgPanes,
          panel = jie.qSel('.panel');
    for (img of imgArr) jie.scaleImg(img, panel);
  },
  promisePanes(wrap, paneArr) {
    const promArr = [];
    for (pane of paneArr) {
      const panel = jing.addElement(wrap, 'div', 'panel');
      switch (pane.type) {
        case 'imgSingle': {
          const imgSingle = new Image();
          imgSingle.src = pane.data;
          imgSingle.classList.add('pane', 'imgSingle');
          promArr.push(imgSingle.decode()
            .then(() => { jie.scaleImg(imgSingle, panel); })
            .then(() => { panel.append(imgSingle); }));
          break;
        }
        case 'txtProps': {
          const txtProps = jing.addElement(panel, 'div', 'pane', 'txtProps');
          for (prop of pane.data) {
            const txtProp = jing.addElement(txtProps, 'p', 'txtProp');
            const txtVal = jing.addElement(txtProps, 'p', 'txtVal');
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
  },
  clearCard() {
    jie.content.front.wrap.innerHTML = '';
    jie.content.back.wrap.innerHTML = '';
    jie.content.front.frame.scrollLeft = 0;
    jie.content.back.frame.scrollLeft = 0;
  },
  dealCard() {
    const card = kan.card, frPanes = card.front.panes, bkPanes = card.back.panes,
          frWrap = jie.content.front.wrap, bkWrap = jie.content.back.wrap,
          frArr = card.front.shuffle ? jing.shuffleArray(frPanes) : frPanes,
          bkArr = card.back.shuffle ? jing.shuffleArray(bkPanes) : bkPanes;
    return Promise.all([jie.promisePanes(frWrap, frArr),
                        jie.promisePanes(bkWrap, bkArr)]);
  },
  panelScrollTarget(side) {
    const port = jie.portOrient.matches,
          frame = side.frame, panels = side.panels,
          pos = port ? frame.scrollLeft : frame.scrollTop;
    let tgtIdx = 0, tgtDist = 999999;
    for (let i = 0; i < panels.length; i++) {
      const panel = panels[i],
            offset = port ? panel.offsetLeft : panel.offsetTop,
            dist = Math.abs(offset - pos);
      if (dist < tgtDist) {
        tgtIdx = i;
        tgtDist = dist;
      }
    }
    return panels[tgtIdx];
  },
  frPanelTgt() { kan.frontPanel = jie.panelScrollTarget(jie.content.front); },
  bkPanelTgt() { kan.backPanel = jie.panelScrollTarget(jie.content.back); },
  changeOrient() {
    const fp = kan.frontPanel;
    const bp = kan.backPanel;
    const frFrame = jie.content.front.frame,
          bkFrame = jie.content.back.frame;
    if (jie.portOrient.matches) {
      if (fp) frFrame.scrollLeft = fp.offsetLeft;
      if (bp) bkFrame.scrollLeft = bp.offsetLeft;
    } else {
      if (fp) frFrame.scrollTop = fp.offsetTop;
      if (bp) bkFrame.scrollTop = bp.offsetTop;
    }
  }
}


const tong = {
  addScrollEvents() {
    const front = jie.content.front, back = jie.content.back;
    front.frame.addEventListener('scroll', jie.frPanelTgt, { passive: true });
    back.frame.addEventListener('scroll', jie.bkPanelTgt, { passive: true });
  },
  rmvScrollEvents() {
    const front = jie.content.front, back = jie.content.back;
    front.frame.removeEventListener('scroll', jie.frPanelTgt, { passive: true });
    back.frame.removeEventListener('scroll', jie.bkPanelTgt, { passive: true });
  },
  iterate() {
    tong.rmvScrollEvents();
    const contentWrap = jie.content.outerWrap;
    contentWrap.classList.remove('pivot');
    jie.toggle(contentWrap, 'hideMe');
    jie.clearCard();
    kan.frontPanel = null;
    kan.backPanel = null;
    kan.scrolling = false;
    jie.dealCard().then(() => {
      setTimeout(() => { jie.toggle(contentWrap, 'hideMe'); }, 200);
      tong.addScrollEvents();
    });
  },
  reset() {
    const content = jie.content.section;
    jie.toggle(content, 'showMe');
    kan.idx = 0;
    kan.shuffle = kan.cards;
    tong.iterate();
    setTimeout(() => { jie.toggle(content, 'showMe'); }, 300);
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
  awaitUserAction() {
    const controls = jie.controls, contentWrap = jie.content.outerWrap;
    for (btn of Object.keys(controls.buttons)) {
      controls.buttons[btn].onclick = tong[btn];
    }
    const toggleDarkMode = () => jie.toggle(document.body, 'dark');
    const flipCard = () => jie.toggle(contentWrap, 'pivot');
    controls.darkMode.onclick = toggleDarkMode;
    contentWrap.onclick = flipCard;
    jie.portOrient.onchange = jie.changeOrient;
  },
  initialize() {
    const content = jie.content.section;
    const controls = jie.controls.section;
    const contentWrap = jie.content.outerWrap;
    const deck = [];

    // hoisted custom function is referenced here
    horticultureFlashCards(deck).then(() => {

      // resume abstraction
      kan.idx = 0;
      kan.cards = deck;
      kan.shuffle = kan.cards;
      kan.scrolling = false;
      tong.awaitUserAction();
      setTimeout(() => { jie.toggle(controls, 'showMe'); }, 250);
      jie.dealCard().then(() => {
        setTimeout(() => { jie.toggle(content, 'showMe'); }, 400);
        window.onresize = jie.scaleImgPanes;
        tong.addScrollEvents();
      });
    });
  }
}

// fire it up

tong.initialize();


// hoisted custom function is below
// push formatted cards into predetermined array 

function horticultureFlashCards(arr) {
  const src = 'https://fentablar.github.io/squareless/kan/horticultureFlashCards.json';
  return fetch(src).then(resp => resp.json()).then(json => {
    const imgRoot = json.imgRoot;
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
      arr.push(card);
    }
  });
}
