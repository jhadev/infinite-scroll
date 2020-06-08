const data = [];

function fillArray(arr) {
  for (let i = 0; i <= 99; i++) {
    arr.push(i);
  }
}

fillArray(data);

const scroller = document.querySelector("#scroller");
const sentinel = document.querySelector("#sentinel");
let items;
let countStart = 0;
const loadAmount = 10;

console.log(data);

function loadItems(numItems) {
  for (let i = countStart; i < countStart + numItems; i++) {
    const newItem = document.createElement("div");
    newItem.classList.add("item");
    newItem.textContent = `Item ${countStart + data[i]}`;
    scroller.appendChild(newItem);
  }
  items = document.querySelectorAll(".item");
  countStart += numItems;
}

const observer = new IntersectionObserver(
  (entries) => {
    // If the browser is busy while scrolling happens, multiple entries can
    // accumulate between invocations of this callback. As long as any one
    // of the notifications reports the sentinel within the scrolling viewport,
    // we add more content.
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        loadItems(loadAmount);
      }
    });

    // if (entries.some((entry) => entry.intersectionRatio > 0)) {
    //   // appendChild will move the existing element, so there is no need to
    //   // remove it first.
    //   scroller.appendChild(sentinel);
    //   // loadItems(5);
    // }
  },
  { threshold: 1 }
);

loadItems(10);

items.forEach((item, index) => {
  if (index === loadAmount - 1) {
    console.log(item);
    observer.observe(item);
  }
});
