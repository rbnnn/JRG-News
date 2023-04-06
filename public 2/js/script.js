// listener for the search query
// to be present on every page via navbar
document.getElementById('submit-search').addEventListener('click', (event) => {
    event.preventDefault();
    const keyword = document.getElementById('keyword').value;
    if (keyword != '') {
        window.location = '/results.html?keyword=' + keyword;
    } else {
        window.location = '/results.html';
    };
});

