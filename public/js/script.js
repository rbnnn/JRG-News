// listener for the search query
// to be present on every page via navbar

const formElement = document.getElementById('search');

// On search submit
formElement.addEventListener('submit', (event) => {
    event.preventDefault();
    const keyword = document.getElementById('keyword').value;
    // Redirect to results page
    window.location.href = "/results.html?keyword=" + keyword;
});

// On advanced search submit
if (document.getElementById('submit-advsearch')) {
    document.getElementById('submit-advsearch').addEventListener('click', (event) => {
        event.preventDefault();

        // Parse json as URL Params
        const formData = new FormData(document.forms.advsearch);
        const json = Object.fromEntries(formData.entries());
        const params = new URLSearchParams(json).toString();

        // Redirect to results page
        window.location = "/results.html?" + params;
    });
}

// Hiding the navbar when scrolling
const nav = document.querySelector('nav');
let prevScrollpos = window.pageYOffset;
window.addEventListener('scroll', function () {
    let currentScrollPos = window.pageYOffset;

    // Checks scroll position, sets css
    if (prevScrollpos > currentScrollPos) {
        nav.classList.remove('hidden');
    } else {
        nav.classList.add('hidden');
    }
    prevScrollpos = currentScrollPos;
});

// Function reference for search
const search = firebase.functions().httpsCallable('search');

// Checking if there is any output left in results
function isIterable(input) {
    return input != null && typeof input[Symbol.iterator] === 'function'
}

// For homepage, retrieves top 9 latest headlines
if (document.getElementById('latest')) {

    search({}).then(result => {
        const res = result.data;
        console.log(result.data);
        let output = "";
        let count = 1;

        if (isIterable(res.articles)) {
            for (let item of res.articles) {
                const options = {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    timeZone: "America/New_York",
                };

                const date = new Date(item.published_date);
                const formattedDate = date.toLocaleString("en-US", options);

                // Checking for valid Author, excerpt and summary to prevent undefined values. Interchanges excerpt and summary
                let author = item.author;
                if (author == "") { author = item.rights };

                if (item.excerpt == "" || item.excerpt == null) {
                    item.excerpt = item.summary;
                } else if (item.summary == "" || item.summary == null) {
                    item.summary = item.excerpt;
                }

                // HTML for first and last spotlight articles
                if (count == 1 || count == 9) {
                    document.getElementById(count).innerHTML =
                        `<a href="/article.html?url=${item.link}" style="color:black;
                        text-decoration: none; 
                        background-color: none;">
                        <h1>${item.title}</h1>
                        <h4>${author}</h4>
						<div class="" style="display: flex; flex-wrap: wrap; justify-content: space-between;">
							<em>${formattedDate}</em>
                            <em>${item.rights}</em>
						</div>
                        <br>
						<img src="${item.media}" style="float: right; width: 50%; margin: 20px;">
                        <p align="left">${item.summary}</p>
                        </a>`
                } else {
                    // For filler articles
                    document.getElementById(count).innerHTML =
                        `<a href="/article.html?url=${item.link}" style="color:black;
                        text-decoration: none; 
                        background-color: none;">
                        <h5>${item.title}</h5>
						<div class="" style="display: flex; flex-wrap: wrap; justify-content: space-between;">
							<em>${formattedDate}</em>
                            <em>${item.rights}</em>
						</div>
                        <br>
						<p align="left">${item.excerpt}</p>
                        </a>`
                }
                count += 1;
            }
        } else {
            // If no output, default message.
            document.querySelector(".results").innerHTML = "No results found.";
        }
    });
}
