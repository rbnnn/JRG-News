// function reference 
const search = firebase.functions().httpsCallable('search');

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const keyword = urlParams.get('keyword')
const topic = urlParams.get('topic')

var search_in = urlParams.get('search_in')
var sort_by = urlParams.get('sort_by')

var page = urlParams.get('page')
console.log(keyword);

const query = {};

// checking which parameters are given
if (keyword != null) {
    query.keyword = keyword;
    document.getElementById("headline").innerHTML = "Results";
}
if (topic != null) {
    query.topic = topic;
    document.getElementById("headline").innerHTML = topic;
}
if (page != null) {
    query.page = page;
}
if (sort_by != null) {
    query.sort_by = sort_by;
}
if (search_in != null) {
    query.search_in = search_in;
} else {
    query.search_in = 'title';
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
            output +=
                `
            <div class ="results">
            <img src="${item.media}" alt="${item.media}">
            <a href="/article.html?url=${item.link}">
            <p class="title">${item.title}</p></a>
            <p class="excerpt">${item.excerpt}</p>
            <p class="published_date">${item.published_date}</p>
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

    if (page == null) {
        page = 2;
    } else {
        page += 1;
    }
    var redirect = '/results.html?page='+page;
    if (keyword != null){
        redirect+='&keyword='+keyword;
    }
    if (topic!= null){
        redirect+='&topic='+topic;
    }
    window.location = redirect;
});