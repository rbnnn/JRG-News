// listener for the search query
// to be present on every page via navbar
document.getElementById('submit-search').addEventListener('click', (event) => {
    event.preventDefault();

    const formData = new FormData(document.forms.search);
    const json = Object.fromEntries(formData.entries());
    const params = new URLSearchParams(json).toString();

    window.location = "/results.html?" + params;
});

document.getElementById('submit-advsearch').addEventListener('click', (event) => {
    event.preventDefault();

    const formData = new FormData(document.forms.advsearch);
    const json = Object.fromEntries(formData.entries());
    const params = new URLSearchParams(json).toString();

    window.location = "/results.html?" + params;
});

/*

const advsearch = document.getElementById('advsearch');
advsearch.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const json = Object.fromEntries(formData.entries());
  const params = new URLSearchParams(json).toString();
  
  window.location = "/results.html?" + params;
});
*/

window.onload = function () {
    // if home page is loaded
    if (document.getElementById('home')) {

        const search = firebase.functions().httpsCallable('search');

        //blank search query to retrieve latest headlines of last 24h
        // search().then(result);
    }
};