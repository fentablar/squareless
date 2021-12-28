
const buildCards = () => {
  if (!frontFrame) return;

  let cardWrap = document.createElement('div');
  cardWrap.id = 'cardWrap';
  frontFrame.append(cardWrap);

  let rnd = Math.floor(Math.random() * 10) + 3;

  for (let i = 0; i < rnd; i++) {
    let cardFrame = document.createElement('div');
    cardFrame.classList.add('cardFrame');
    cardWrap.append(cardFrame);

    let card = document.createElement('div');
    let crdTxt = '<p>Card</p><p>' + i + '</p>';
    card.classList.add('card');
    card.insertAdjacentHTML('afterbegin', crdTxt);
    cardFrame.append(card);
  }
}

const addControls = () => {
  outerWrap.addEventListener('click', function () {
    this.classList.toggle('pivot');
  });
}

buildCards();
addControls();
