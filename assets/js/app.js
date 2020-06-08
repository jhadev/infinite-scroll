// DOM refs
const scroller = document.querySelector("#scroller");
const sentinel = document.querySelector("#sentinel");

// array of data
const dataArr = [];

// fill array with 0-99
function fillArray(arr) {
  for (let i = 0; i <= 99; i++) {
    arr.push(i);
  }
}

fillArray(dataArr);

// copy array
const dataCopy = [...dataArr];

// scroll counter
let countStart = 0;
// batch of items to load
const loadAmount = 10;
// counter for how many times function loadItems func has run
let runCounter = 0;

console.log(dataArr);

function loadItems(loadAmount, data) {
  // this function has been run at least once, trim first 10 entries off of the array
  if (runCounter >= 1) {
    data = data.splice(0, loadAmount);
  }

  // if the end of the unmutated array has been reached
  if (countStart > dataArr[dataArr.length - 1]) {
    const newItem = document.createElement("div");
    newItem.classList.add("item");
    newItem.textContent = `no more items`;
    scroller.appendChild(newItem);
    // stop IntersectionObserver
    observer.unobserve(sentinel);
    return console.log("no more items");
  }

  // loop over first 10 items in cloned array and print them to the page
  for (let i = 0; i < loadAmount; i += 1) {
    const newItem = document.createElement("div");
    newItem.classList.add("item");
    newItem.textContent = `Item ${countStart + dataArr[i]}`;
    scroller.appendChild(newItem);
  }
  // increment counter
  countStart += loadAmount;
  console.log(countStart);
  // increment function counter
  runCounter += 1;
}

// IntersectionObserver callback
function callback(entries) {
  if (entries.some((entry) => entry.intersectionRatio > 0)) {
    loadItems(loadAmount, dataCopy);
    scroller.appendChild(sentinel);
  }
}

const observer = new IntersectionObserver(callback, { threshold: 1 });

// load first 10 items on page load
loadItems(loadAmount, dataCopy);

// observe the sentinel id
observer.observe(sentinel);
