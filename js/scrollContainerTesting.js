
const buildCards = () => {
  if (!front) return;

  let frontFrame = document.createElement('div');
  frontFrame.id = 'frontFrame';
  front.append(frontFrame);

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

const iteration = () => {
  if (frontFrame) frontFrame.remove();
  return buildCards();
}

const addControls = () => {
  let outerWrap = document.querySelector('.outerWrap');
  outerWrap.addEventListener('click', function () {
    this.classList.toggle('pivot');
  });
  iterate.addEventListener('click', iteration);
}

buildCards();
addControls();
