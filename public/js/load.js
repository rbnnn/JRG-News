// Function reference 
const load = firebase.functions().httpsCallable('load');

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const url = urlParams.get('url')
console.log(url);

const query = {};
query.url = url;

const article = document.querySelector(".article");

// Parse article
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

  // Testing for empty content variables
  if (res?.content_2 != "" || res?.content_2 != null) {
    if (res.content_1 == "" || res.content_1 == null) {
      res.content_1 = res.content_2;
    }
  }

  // Testing for empty title variables
  if (res?.title_2 != "" || res?.title_2 != null) {
    if (res.title_1 == "" || res.title_1 == null) {
      res.title_1 = res.title_2;
    }
  }

  // Update the page with the appropriate article information
  document.getElementById("title").innerHTML = res.title_1;

  document.getElementById("author").innerHTML = res.author;

  document.getElementById("date").innerHTML = formattedDate;

  document.getElementById("source").innerHTML = `<a id="link" href="${res.url}">${res.website_url}</a>`;

  document.getElementById("img").src = res.lead_image_url;

  document.getElementById("text").innerHTML = res.content_1;

});

// Change font size to increase/decrease current size by 2px
document.getElementById('font-size-plus').addEventListener('click', function () {
  document.getElementById('text').style.fontSize = (parseFloat(window.getComputedStyle(document.getElementById('text')).fontSize) + 2) + 'px';
});

document.getElementById('font-size-minus').addEventListener('click', function () {
  document.getElementById('text').style.fontSize = (parseFloat(window.getComputedStyle(document.getElementById('text')).fontSize) - 2) + 'px';
});

// Change background color
var colorButtons = document.querySelectorAll('.back-color');
for (var i = 0; i < colorButtons.length; i++) {
  colorButtons[i].addEventListener('click', function () {
    document.body.style.backgroundColor = this.dataset.color;

    if (this.dataset.color == "#1f2129" || this.dataset.color == "#000000") {
      // Lighter font
      article.classList.remove("grey");
      article.classList.add("white");
      document.getElementById('text').classList.remove("grey");
      document.getElementById('text').classList.add("white");
      document.getElementById('header1').classList.add("white");
      document.getElementById('header1').classList.remove("grey");
      document.getElementById('header2').classList.add("white");
      document.getElementById('header2').classList.remove("grey");
      document.getElementById('link').classList.add("white");
      document.getElementById('link').classList.remove("grey");
    } else if (this.dataset.color == "#ffffff" || this.dataset.color == "#f4eac8") {
      // Darker font
      article.classList.remove("white");
      article.classList.remove("grey");
      document.getElementById('text').classList.remove("white");
      document.getElementById('text').classList.remove("grey");
      document.getElementById('header1').classList.remove("white");
      document.getElementById('header1').classList.remove("grey");
      document.getElementById('header2').classList.remove("white");
      document.getElementById('header2').classList.remove("grey");
      document.getElementById('link').classList.remove("white");
      document.getElementById('link').classList.remove("grey");
    }
  });
}

// Change font family of headers, text, etc.
document.getElementById('font-select').addEventListener('change', function () {
  document.querySelectorAll('.article p').forEach(function (element) {
    element.style.fontFamily = this.value;
  }, this);
  document.querySelectorAll('.article h1').forEach(function (element) {
    element.style.fontFamily = this.value;
  }, this);
  document.querySelectorAll('.article h4').forEach(function (element) {
    element.style.fontFamily = this.value;
  }, this);

  document.querySelectorAll('.article a').forEach(function (element) {
    element.style.fontFamily = this.value;
  }, this);

});

// Toggle bold on/off
const boldButton = document.getElementById("boldBtn");
boldButton.addEventListener("click", function () {
  article.classList.toggle("bold");
  document.getElementById('text').classList.toggle("bold");
  document.getElementById('header1').classList.toggle("bold");
  document.getElementById('header2').classList.toggle("bold");
  document.getElementById('link').classList.toggle("bold");
});

// For changing the color of the text
document.getElementById("white-font").addEventListener("click", function () {
  article.classList.remove("grey");
  article.classList.add("white");
  document.getElementById('text').classList.remove("grey");
  document.getElementById('text').classList.add("white");
  document.getElementById('header1').classList.add("white");
  document.getElementById('header1').classList.remove("grey");
  document.getElementById('header2').classList.add("white");
  document.getElementById('header2').classList.remove("grey");
  document.getElementById('link').classList.add("white");
  document.getElementById('link').classList.remove("grey");
});

// White text
document.getElementById("grey-font").addEventListener("click", function () {
  article.classList.remove("white");
  article.classList.add("grey");
  document.getElementById('text').classList.remove("white");
  document.getElementById('text').classList.add("grey");
  document.getElementById('header1').classList.remove("white");
  document.getElementById('header1').classList.add("grey");
  document.getElementById('header2').classList.remove("white");
  document.getElementById('header2').classList.add("grey");
  document.getElementById('link').classList.remove("white");
  document.getElementById('link').classList.add("grey");
});

// Grey text
document.getElementById("black-font").addEventListener("click", function () {
  article.classList.remove("white");
  article.classList.remove("grey");
  document.getElementById('text').classList.remove("white");
  document.getElementById('text').classList.remove("grey");
  document.getElementById('header1').classList.remove("white");
  document.getElementById('header1').classList.remove("grey");
  document.getElementById('header2').classList.remove("white");
  document.getElementById('header2').classList.remove("grey");
  document.getElementById('link').classList.remove("white");
  document.getElementById('link').classList.remove("grey");
});

// Resets to default color: Beige background and black arial text
document.getElementById("reset").addEventListener("click", function () {
  article.classList.remove("white");
  article.classList.remove("grey");
  article.classList.remove("bold");
  document.getElementById('text').classList.remove("white");
  document.getElementById('text').classList.remove("grey");
  document.getElementById('text').classList.remove("bold");
  document.getElementById('header1').classList.remove("white");
  document.getElementById('header1').classList.remove("grey");
  document.getElementById('header1').classList.remove("bold");
  document.getElementById('header2').classList.remove("white");
  document.getElementById('header2').classList.remove("grey");
  document.getElementById('header2').classList.remove("bold");
  document.getElementById('link').classList.remove("white");
  document.getElementById('link').classList.remove("grey");
  document.getElementById('link').classList.remove("bold");
  document.body.style.backgroundColor = "#fefaef";

  document.querySelectorAll('.article p').forEach(function (element) {
    element.style.fontFamily = "Arial";
  }, this);
  document.querySelectorAll('.article h1').forEach(function (element) {
    element.style.fontFamily = "Arial";
  }, this);
  document.querySelectorAll('.article h4').forEach(function (element) {
    element.style.fontFamily = "Arial";
  }, this);

  document.querySelectorAll('.article a').forEach(function (element) {
    element.style.fontFamily = "Arial";
  }, this);
});