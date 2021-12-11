let divBuild = (wrapper, classes, content) => {
	let div = document.createElement('div');
	if (classes) div.classList.add(...classes);
	if (content) content(div);
	wrapper.append(div);
}

let symTxt = (wrapper, txtClass, txt) => {
	divBuild(wrapper, ['symTxt', txtClass], div => {
		div.insertAdjacentHTML('afterbegin', txt);
	});
}

let symTxtWrap = (wrapper, txt) => {
	divBuild(wrapper, ['symbolTextWrap'], div => {
		symTxt(div, 'symTrad', txt.traditional);
		symTxt(div, 'symEng', txt.english);
	});
}

let charBronze = (wrapper, imgRoot, chars) => {
	divBuild(wrapper, ['char', 'bronze'], div => {
		for (let c of chars) {
			div.insertAdjacentHTML('beforeend',
			'<img src="' + imgRoot + c + '" >');
		}
	});
}

let charGua = (wrapper, code) => {
	divBuild(wrapper, ['char', 'gua'], div => {
		div.insertAdjacentHTML('afterbegin',
		'<span>' + code + '</span>');
	});
}

let seqNumTrad = (wrapper, num, txt) => {
	divBuild(wrapper, ['seq', 'num-trad'], div => {
		div.insertAdjacentHTML('afterbegin',
		'<span>' + num + '</span>'
		+ '<span>&#160;&#183;&#160;</span>'
		+ '<span>' + txt + '</span>');
	});
}

let seqLang = (wrapper, txtClass, txt) => {
	divBuild(wrapper, ['seq', txtClass], div => {
		div.insertAdjacentHTML('afterbegin',
		'<span>' + txt + '</span>');
	});
}

let sequence = (wrapper, card) => {
	divBuild(wrapper, ['sequence'], div => {
		seqNumTrad(div, card.number, card.characters.traditional);
		seqLang(div, 'pinyin', card.name.pinyin);
		seqLang(div, 'eng', card.name.english);
	});
}

let cardBuild = (wrapper, imgRoot, card) => {
	divBuild(wrapper, ['card'], div => {
		div.setAttribute('id', card.number);
		divBuild(div, ['card-wrap'], div => {
			divBuild(div, ['side', 'front'], div => {
				charBronze(div, imgRoot, card.characters.bronze);
				sequence(div, card);
				charGua(div, card.guaCode);
			});
			divBuild(div, ['side', 'back'], div => {
				symTxtWrap(div, card.symbolText);
			});
		});
	});
}

fetch('https://fentablar.github.io/squareless/kan/yiJing-cards.json')
.then(response => response.json())
.then(json => {
	const imgRoot = json.imgRoot, cards = json.cards;
	const wrapperSupreme = document.querySelector('#wrapper-supreme');
	for (let card of cards) cardBuild(wrapperSupreme, imgRoot, card);
});