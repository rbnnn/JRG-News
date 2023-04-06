// function reference 
const search = firebase.functions().httpsCallable('search');

const queryString = window.location.search;

// Create a new URLSearchParams object from the query string
const params = new URLSearchParams(queryString);

// Iterate over the key-value pairs and add them to a new object
const query = {};
for (const [key, value] of params.entries()) {
  query[key] = value;
}

if (query?.topic != null) {
    document.getElementById("headline").innerHTML = query.topic;
    const capitalizedStr = query.topic.charAt(0).toUpperCase() + query.topic.slice(1).toLowerCase();
    document.title = capitalizedStr;
    document.getElementById("headline").innerHTML = "Latest Headlines in "+capitalizedStr;
}

if (query?.keyword != null) {
    const capitalizedStr = query.keyword.charAt(0).toUpperCase() + query.keyword.slice(1).toLowerCase();
    document.getElementById("headline").innerHTML = "Results for "+capitalizedStr;
}

if (query?.search_in == null) {
    query.search_in = 'title';
}

if (query?.topic != null && query?.keyword == null){
    const dropdown = document.querySelector('#sort-by');
    dropdown.style.display = 'none';
}

// checking if there is any output left
function isIterable(input) {
    return input != null && typeof input[Symbol.iterator] === 'function'
}

// searching through query
search(query).then(result => {
    const res = result.data;
    console.log(result.data);
    let output = "";
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

            output +=
                `
            <div class ="results">
            <img src="${item.media}" alt="${item.media}">
            <a href="/article.html?url=${item.link}">
            <p class="title">${item.title}</p></a>
            <p class="excerpt">${item.excerpt}</p>
            <p class="published_date">${formattedDate}</p>
            </div>
            `;
        }
    } else {
        // if no output, default message.
        output = "No results found.";
    }
    document.querySelector(".results").innerHTML = output;
});

// next button to re-query and load next page of results
document.getElementById('next').addEventListener('click', (event) => {
    event.preventDefault();

    let page;

    if (query?.page == null) {
        page = 2;
    } else {
        page += 1;
    }

    const currentUrl = window.location.href;

    const regex = new RegExp(`([?&])page=([^&]*)`);
    let newUrl;

    if (regex.test(currentUrl)) {
        newUrl = currentUrl.replace(regex, `$1page=${page}`);
    } else {
        const separator = currentUrl.indexOf('?') === -1 ? '?' : '&';
        newUrl = currentUrl + separator + `page=${page}`;
    }

    window.location.href = newUrl;
});

document.querySelector('#sort-by').addEventListener('change', (event) => {
    const selectedOption = event.target.value;
    const currentUrl = window.location.href;

    const regex = new RegExp(`([?&])sort_by=([^&]*)`);
    let newUrl;

    if (regex.test(currentUrl)) {
        newUrl = currentUrl.replace(regex, `$1sort_by=${selectedOption}`);
    } else {
        const separator = currentUrl.indexOf('?') === -1 ? '?' : '&';
        newUrl = currentUrl + separator + `sort_by=${selectedOption}`;
    }

    window.location.href = newUrl;
});

document.querySelector('#page-size').addEventListener('change', (event) => {
    const selectedOption = event.target.value;
    const currentUrl = window.location.href;

    const regex = new RegExp(`([?&])page_size=([^&]*)`);
    let newUrl;

    if (regex.test(currentUrl)) {
        newUrl = currentUrl.replace(regex, `$1page_size=${selectedOption}`);
    } else {
        const separator = currentUrl.indexOf('?') === -1 ? '?' : '&';
        newUrl = currentUrl + separator + `page_size=${selectedOption}`;
    }

    window.location.href = newUrl;
});