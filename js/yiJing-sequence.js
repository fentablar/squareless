const listWrap = document.querySelector('ul');

fetch('https://fentablar.github.io/squareless/kan/yiJing-cards.json')
.then(response => response.json())
.then(json => {
	let cards = json.cards;
	
	for (let card of cards) {
		let guaItem = document.createElement('li');
		listWrap.append(guaItem);
		
		let yiItem = document.createElement('div');
		yiItem.classList.add('yiItem');
		guaItem.append(yiItem);
		
		let seqGua = document.createElement('div');
		seqGua.classList.add('seqGua');
		yiItem.append(seqGua);
		
		let seqNum = document.createElement('div');
		seqNum.classList.add('seqNum');
		seqNum.insertAdjacentHTML('afterbegin',
								'<p>' + card.number + '&nbsp;&middot;&nbsp;</p>');
		seqGua.append(seqNum);
		
		let seqHex = document.createElement('div');
		seqHex.classList.add('seqHex');
		seqHex.insertAdjacentHTML('afterbegin',
								'<p>' + card.guaCode + '</p>');
		seqGua.append(seqHex);
		
		let pinEng = document.createElement('div');
		pinEng.classList.add('pinEng');
		pinEng.insertAdjacentHTML('afterbegin',
								'<div><p>' + card.characters.traditional
								+ '&nbsp;' + card.name.pinyin
								+ '</p></div><div><p>'
								+ card.name.english
								+ '</p></div>');
		yiItem.append(pinEng);
	}
});