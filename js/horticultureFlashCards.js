const wrapperSupreme = document.querySelector('#wrapperSupreme');
let plants, imgRoot;

fetch('https://fentablar.github.io/squareless/kan/horticultureFlashCards.json')
.then(response => response.json())
.then(json => {
  plants = json.plants;
  imgRoot = json.imgRoot;
});

function initRandom(arr) {
  let output = [], rnd;

  while (arr.length) {
    rnd = Math.floor(Math.random() * arr.length);
    output.push(arr[rnd]);
    arr = arr.filter(a => a.botanicalName != arr[rnd].botanicalName);
    console.log(output);
    console.log(arr);
  }

  return output;

}
