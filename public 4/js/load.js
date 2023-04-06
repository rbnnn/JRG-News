// function reference 
const load = firebase.functions().httpsCallable('load');

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const url = urlParams.get('url')
console.log(url);

const query = {};
query.url = url;

const article = document.querySelector(".article");

// parse article
load(query).then(result => {
  const res = result.data;
  console.log(res);

  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZone: "America/New_York",
  };

  const date = new Date(res.date_published);
  const formattedDate = date.toLocaleString("en-US", options);

  output = `<br><a href="${res.url}"><h2">${res.title_1}</h2></a>
    <p>${res.content_1}</p>`
  // will loop this to display more content based on what's going on

  article.innerHTML = output;
});


// looping through to get all the data from an article, sometimes content-1 and content-2 have the same data, need to check for that.
// sometimes images are unrelated? will check for that. Will always have lead image.
// title, author/authors, publish date
// image, content

/*
for (let key in data) {
  if (key.includes('content')) {
    const content = document.createElement('p');
    content.textContent = data[key];
    document.body.appendChild(content);
  } else if (key.includes('image')) {
    const image = document.createElement('img');
    image.src = data[key];
    document.body.appendChild(image);
  } else if (key.includes('author')) {
    const author = document.createElement('h2');
    author.textContent = data[key];
    document.body.appendChild(author);
  } else if (key.includes('title')) {
    const title = document.createElement('h1');
    title.textContent = data[key];
    document.body.appendChild(title);
  }
}
*/

// Change font size
document.getElementById('font-size-plus').addEventListener('click', function () {
  document.querySelector('.article').style.fontSize = (parseFloat(window.getComputedStyle(document.querySelector('.article')).fontSize) + 1) + 'px';
});

document.getElementById('font-size-minus').addEventListener('click', function () {
  document.querySelector('.article').style.fontSize = (parseFloat(window.getComputedStyle(document.querySelector('.article')).fontSize) - 1) + 'px';
});

// Change background color
var colorButtons = document.querySelectorAll('.back-color');
for (var i = 0; i < colorButtons.length; i++) {
  colorButtons[i].addEventListener('click', function () {
    article.style.backgroundColor = this.dataset.color;
  });
}

// Change font family
document.getElementById('font-select').addEventListener('change', function () {
  document.querySelectorAll('.article p').forEach(function (element) {
    element.style.fontFamily = this.value;
  }, this);
});

// toggle bold on/off
const boldButton = document.getElementById("boldBtn");
boldButton.addEventListener("click", function () {
  article.classList.toggle("bold");
});

// for changing the color of the text
document.getElementById("white-font").addEventListener("click", function () {
  article.classList.remove("grey");
  article.classList.add("white");
});

document.getElementById("grey-font").addEventListener("click", function () {
  article.classList.remove("white");
  article.classList.add("grey");
});

document.getElementById("black-font").addEventListener("click", function () {
  article.classList.remove("white");
  article.classList.remove("grey");
});

document.getElementById("reset").addEventListener("click", function () {
  article.classList.remove("white");
  article.classList.remove("grey");
  article.style.backgroundColor = this.dataset.color;
});