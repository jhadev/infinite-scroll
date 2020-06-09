const scroller = document.querySelector("#scroller");
const sentinel = document.querySelector("#sentinel");

// counter to stop fetching
let totalItems = 0;

const url = `https://randomuser.me/api/?results=10&nat=us`;

// fetch data from api
async function getData(url) {
  try {
    const response = await fetch(url);
    const { results } = await response.json();
    return results;
  } catch (err) {
    console.log(err);
  }
}

// map api data function
function mapData(arr) {
  return arr.map((data) => {
    return {
      firstName: data.name.first,
      lastName: data.name.last,
      cell: data.cell,
      email: data.email,
      picture: data.picture.thumbnail,
    };
  });
}

// function to create DOM elements for api data
async function loadItems() {
  let apiData = await getData(url);
  apiData = mapData(apiData);
  totalItems += apiData.length;

  // stop loading at 100 items
  if (totalItems > 100) {
    const newItem = document.createElement("div");
    newItem.classList.add("item");
    newItem.textContent = `no more items`;
    scroller.appendChild(newItem);
    // stop IntersectionObserver
    observer.unobserve(sentinel);
    return console.log("no more items");
  }

  apiData.forEach((item) => {
    const newItem = document.createElement("div");
    newItem.classList.add("item");
    const ul = document.createElement("ul");

    if ("picture" in item) {
      let img = document.createElement("img");
      img.classList.add("photo");
      img.setAttribute("data-src", item.picture);
      newItem.appendChild(img);
    }

    for (let [key, value] of Object.entries(item)) {
      if (key !== "picture") {
        const li = document.createElement("li");
        li.innerHTML = `${key}: ${value}`;
        ul.appendChild(li);
      }
    }
    newItem.appendChild(ul);
    scroller.appendChild(newItem);
  });

  lazyLoad();
}

// fetch IntersectionObserver callback
async function callback(entries) {
  if (entries.some((entry) => entry.intersectionRatio > 0)) {
    await loadItems();

    scroller.appendChild(sentinel);
  }
}

// swap data-src attr with src function
function loadImage(img) {
  const src = img.getAttribute("data-src");
  if (!src) {
    return;
  }
  img.src = src;
}

// function that returns IntersectionObserver instance for lazy loading
function imgObserver() {
  const options = {
    rootMargin: "0px 0px 20px 0px",
    threshold: 0.5,
  };

  const observer = new IntersectionObserver((entries, self) => {
    entries.forEach((entry) => {
      console.log("entry: ", entry);
      if (entry.isIntersecting) {
        loadImage(entry.target);
        // stop watching element after img is loaded
        self.unobserve(entry.target);
      }
    });
  }, options);

  return observer;
}

function lazyLoad() {
  // observer instance
  const lazyLoader = imgObserver();
  // select all elements with data-src attr
  const photos = document.querySelectorAll("[data-src]");

  // loop over each img and observe for lazy loading
  photos.forEach((photo) => {
    lazyLoader.observe(photo);
  });
}

// new instance of InterSectionObserver for infinite scrolling/auto fetching
const fetchObserver = new IntersectionObserver(callback, {
  threshold: 1,
  rootMargin: "0% 0% 5% 0%",
});

// load initial items and observe the sentinel id to load more once user scrolls to that element
loadItems().then(() => {
  fetchObserver.observe(sentinel);
});
