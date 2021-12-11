const wrapperSupreme = document.querySelector('#wrapperSupreme');
let plants, imgRoot;

fetch('https://fentablar.github.io/squareless/kan/horticultureFlashCards.json')
.then(response => response.json())
.then(json => {
  plants = json.plants;
  imgRoot = json.imgRoot;
});
