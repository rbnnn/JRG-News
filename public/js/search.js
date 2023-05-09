const queryString = window.location.search;

// Create a new URLSearchParams object from the query string
const params = new URLSearchParams(queryString);

// Iterate over the key-value pairs and add them to a new object
const query = {};
for (const [key, value] of params.entries()) {
    query[key] = value;
}

// Checking which params are in url
if (query?.topic != null) {
    document.getElementById("headline").innerHTML = query.topic;
    const capitalizedStr = query.topic.charAt(0).toUpperCase() + query.topic.slice(1).toLowerCase();
    document.title = capitalizedStr;
    document.getElementById("headline").innerHTML = "Latest Headlines in " + capitalizedStr;
}

if (query?.keyword != null) {
    const capitalizedStr = query.keyword.charAt(0).toUpperCase() + query.keyword.slice(1).toLowerCase();
    document.getElementById("headline").innerHTML = "Results for " + capitalizedStr;
}

if (query?.search_in == null) {
    query.search_in = 'title';
}

if (query?.topic != null && query?.keyword == null) {
    const dropdown = document.querySelector('#sort-by');
    dropdown.style.display = 'none';
}

// Checking if the results are iterable
function isIterable(input) {
    return input != null && typeof input[Symbol.iterator] === 'function'
}

// Searching using query
search(query).then(result => {
    const res = result.data;
    console.log(result.data);
    let output = "";
    let count = 1;
    var row = 1;

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

            if (item.summary == "" || item.summary == null) {
                item.summary = item.excerpt;
            }

            // Html for results page
            if (count % 2 != 0) {
                if (count == 1) {
                    document.querySelector('.results').innerHTML =
                        `<div id="res${row}" style="justify-content: center; display: flex; flex-wrap: wrap; margin: 35px">
                        <div id="${count}" style="padding-right: 35px; width: 45%;">
                        <a href="/article.html?url=${item.link}" style="color:black;
                        text-decoration: none; 
                        background-color: none;">
                            <h3>${item.title}</h3>
                            <h5>${item.author}</h5>
                            <div style="display: flex; flex-wrap: wrap; justify-content: space-between;">
                                <p>${formattedDate}</p>
                                <em>${item.rights}</em>
                            </div>
                            <br>
                            <img src="${item.media}" style="float: left; width: 50%; margin-right: 15px;">
                            <p align="left">${item.summary}</p>
                            </a>
                        </div>
                    </div>`;
                } else {
                    document.querySelector('.results').innerHTML +=
                        `<hr style = "width: 90%;">
                    <div id="res${row}" style="justify-content: center; display: flex; flex-wrap: wrap; margin: 35px">
                        <div id="${count}" style="padding-right: 35px; width: 45%;">
                        <a href="/article.html?url=${item.link}" style="color:black;
                        text-decoration: none; 
                        background-color: none;">
                        <h3>${item.title}</h3>
                        <h5>${item.author}</h5>
                        <div style="display: flex; flex-wrap: wrap; justify-content: space-between;">
                            <p>${formattedDate}</p>
                            <em>${item.rights}</em>
                        </div>
                        <br>
                        <img src="${item.media}" style="float: left; width: 50%; margin-right: 15px;">
                        <p align="left">${item.summary}</p>
                        </a>
                        </div>
                    </div>`;
                }
            } else {
                document.getElementById('res' + row).insertAdjacentHTML("beforeend",
                    `<div id="${count}" style="padding-left: 35px; width: 45%; border-left-width: 0.0625em; border-color: #edd8b9; border-left-style: solid;">
                    <a href="/article.html?url=${item.link}" style="color:black;
                        text-decoration: none; 
                        background-color: none;">
                    <h3>${item.title}</h3>
                    <h5>${item.author}</h5>
                    <div style="display: flex; flex-wrap: wrap; justify-content: space-between;">
                        <p>${formattedDate}</p>
                        <em>${item.rights}</em>
                    </div>
                    <br>
                    <img src="${item.media}" style="float: left; width: 50%; margin-right: 15px;">
                    <p align="left">${item.summary}</p>
                    </a>
                </div>`);
                // Specifies which row
                row += 1;
            }
            // Count in row
            count += 1;
        }
    } else {
        // If no output, default message.
        document.querySelector(".results").innerHTML = "No results found.";
    }
});

// Next button, load next page of results
document.getElementById('next').addEventListener('click', (event) => {
    event.preventDefault();

    let page;

    // For Second page
    if (query?.page == null) {
        page = 2;
    } else {
        page += 1;
    }

    const currentUrl = window.location.href;

    const regex = new RegExp(`([?&])page=([^&]*)`);
    let newUrl;

    // Replaces page with new page number in params
    if (regex.test(currentUrl)) {
        newUrl = currentUrl.replace(regex, `$1page=${page}`);
    } else {
        const separator = currentUrl.indexOf('?') === -1 ? '?' : '&';
        newUrl = currentUrl + separator + `page=${page}`;
    }

    window.location.href = newUrl;
});

// When Sort By dropdown is changed
document.querySelector('#sort-by').addEventListener('change', (event) => {
    const selectedOption = event.target.value;
    const currentUrl = window.location.href;

    const regex = new RegExp(`([?&])sort_by=([^&]*)`);
    let newUrl;

    // New params, changes if it exists or adds it if it doesn't
    if (regex.test(currentUrl)) {
        newUrl = currentUrl.replace(regex, `$1sort_by=${selectedOption}`);
    } else {
        const separator = currentUrl.indexOf('?') === -1 ? '?' : '&';
        newUrl = currentUrl + separator + `sort_by=${selectedOption}`;
    }

    window.location.href = newUrl;
});

// When Page size dropdown is changed
document.querySelector('#page-size').addEventListener('change', (event) => {
    const selectedOption = event.target.value;
    const currentUrl = window.location.href;

    const regex = new RegExp(`([?&])page_size=([^&]*)`);
    let newUrl;

    // Adds page size to params or updates it if it doesn't exist
    if (regex.test(currentUrl)) {
        newUrl = currentUrl.replace(regex, `$1page_size=${selectedOption}`);
    } else {
        const separator = currentUrl.indexOf('?') === -1 ? '?' : '&';
        newUrl = currentUrl + separator + `page_size=${selectedOption}`;
    }

    window.location.href = newUrl;
});