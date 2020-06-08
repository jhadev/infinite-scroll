const scroller = document.querySelector("#scroller");
const sentinel = document.querySelector("#sentinel");

// scroll counter
let totalItems = 0;

const url = `https://randomuser.me/api/?results=5&nat=us`;
async function getData(url) {
  try {
    const response = await fetch(url);
    const { results } = await response.json();
    return results;
  } catch (err) {
    console.log(err);
  }
}

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

async function loadItems() {
  let apiData = await getData(url);
  apiData = mapData(apiData);
  totalItems += apiData.length;

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

  lazyLoader();
}

// IntersectionObserver callback
async function callback(entries) {
  if (entries.some((entry) => entry.intersectionRatio > 0)) {
    await loadItems();

    scroller.appendChild(sentinel);
  }
}

function loadImage(img) {
  const src = img.getAttribute("data-src");
  if (!src) {
    return;
  }
  img.src = src;
}

function lazyLoad() {
  const options = {
    rootMargin: "0px",
    threshold: 0.5,
  };

  const observer = new IntersectionObserver((entries, self) => {
    entries.forEach((entry) => {
      console.log("entry: ", entry);
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadImage(entry.target);

          self.unobserve(entry.target);
        }
      });
    });
  }, options);

  return observer;
}

const observer = new IntersectionObserver(callback, { threshold: 1 });

function lazyLoader() {
  const lazyLoader = lazyLoad();
  const photos = document.querySelectorAll("[data-src]");

  photos.forEach((photo) => {
    lazyLoader.observe(photo);
  });
}

loadItems().then(() => {
  observer.observe(sentinel);
});
