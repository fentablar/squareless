const cardWrapper = ;

let reqURL = 'kan/yiJing-cards.json';
let req = new XMLHttpRequest();

req.open('GET', reqURL);
req.responseType = 'text';
req.send();

req.onload = function() {
	const respTxt = req.response;
	const cards = JSON.parse(restTxt);
	printCards(cards);
}
