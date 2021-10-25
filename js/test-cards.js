const wrapperSupreme = document.querySelector('wrapper-supreme');

fetch('https://fentablar.github.io/squareless/kan/test-cards.json')
	.then(response => response.json())
	.then(json => console.log(json));
	