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
			
			let seqGuaNum = document.createElement('div');
			seqGuaNum.classList.add('seq', 'gua-num');
			seqGuaNum.insertAdjacentHTML('afterbegin',
				'<span>' + card.number + '</span>'
				+ '<span>&#160;</span>'
				+ '<span>' + card.guaCode + '</span>');
			sequence.append(seqGuaNum);
			
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
			charTrad.classList.add('char', 'trad');
			for (let tradImg of card.characters.traditional) {
				charTrad.insertAdjacentHTML('beforeend',
					'<span>' + tradImg + '</span>');
			}
			sideFront.append(charTrad);
			
			let sideBack = document.createElement('div');
			sideBack.classList.add('side', 'back');
			sideBack.insertAdjacentHTML('afterbegin',
				'<span>' + card.symbolText.traditional + '</span>' + 
				'<span>' + card.symbolText.english + '</span>');
			cardWrap.append(sideBack);
		}
	});