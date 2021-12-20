const wrapperSupreme = document.querySelector('#wrapper-supreme');

fetch('https://fentablar.github.io/squareless/kan/yiJing-cards.json')
.then(response => response.json())
.then(json => {
	let imgRoot = json.imgRoot;
	let cards = json.cards;

	for (let card of cards) {
		let cardSection = document.createElement('div');
		cardSection.classList.add('card');
		cardSection.setAttribute('id', card.number);
		cardSection.addEventListener('click', function() {
			this.classList.toggle('flip');
		});
		wrapperSupreme.append(cardSection);

		let cardWrap = document.createElement('div');
		cardWrap.classList.add('card-wrap');
		cardSection.append(cardWrap);

		let sideFront = document.createElement('div');
		sideFront.classList.add('side', 'front');
		cardWrap.append(sideFront);

		let charBronze = document.createElement('div');
		charBronze.classList.add('char', 'bronze');
		for (let brnzImg of card.characters.bronze) {
			charBronze.insertAdjacentHTML('beforeend',
			'<img src="' + imgRoot + brnzImg + '" >');
		}
		sideFront.append(charBronze);

		let sequence = document.createElement('div');
		sequence.classList.add('sequence');

		let seqNumTrad = document.createElement('div');
		seqNumTrad.classList.add('seq', 'num-trad');
		seqNumTrad.insertAdjacentHTML('afterbegin',
			'<span>' + card.number + '</span>'
			+ '<span>&#160;&#183;&#160;</span>'
			+ '<span>' + card.characters.traditional + '</span>');
		sequence.append(seqNumTrad);

		let seqPinyin = document.createElement('div');
		seqPinyin.classList.add('seq', 'pinyin');
		seqPinyin.insertAdjacentHTML('afterbegin',
			'<span>' + card.name.pinyin + '</span>');
		sequence.append(seqPinyin);

		let seqEng = document.createElement('div');
		seqEng.classList.add('seq', 'eng');
		seqEng.insertAdjacentHTML('afterbegin',
			'<span>' + card.name.english + '</span>');
		sequence.append(seqEng);

		sideFront.append(sequence);

		let charTrad = document.createElement('div');
		charTrad.classList.add('char', 'gua');
		charTrad.insertAdjacentHTML('afterbegin',
			'<span>' + card.guaCode + '</span>');
		sideFront.append(charTrad);

		let sideBack = document.createElement('div');
		sideBack.classList.add('side', 'back');
		cardWrap.append(sideBack);

		let symbolTextWrap = document.createElement('div');
		symbolTextWrap.classList.add('symbolTextWrap');
		sideBack.append(symbolTextWrap);

		let symTxtTrad = document.createElement('span');
		symTxtTrad.classList.add('symTxt', 'symTrad');
		symTxtTrad.insertAdjacentHTML('afterbegin', card.symbolText.traditional);
		symbolTextWrap.append(symTxtTrad);

		let symTxtEng = document.createElement('span');
		symTxtEng.classList.add('symTxt', 'symEng');
		symTxtEng.insertAdjacentHTML('afterbegin', card.symbolText.english);
		symbolTextWrap.append(symTxtEng);
	}
});
