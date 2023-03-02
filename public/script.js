let http = new XMLHttpRequest();

http.open('get', 'results.json', true);

http.send();

http.onload = function(){
    if(this.readyState == 4 && this.status == 200){
        let results = JSON.parse(this.responseText);
        let output = "";
        for(let item of results){
            output += `
            <div class ="results">
                    <a href="${item.link}">
                    <img src="${item.media}" alt="${item.media}"></a>
                    <p class="title">${item.title}</p>
                    <p class="excerpt">${item.excerpt}</p>
                    <p class="published_date">${item.published_date}</p>
            </div>
            `;
        }
        document.querySelector(".results").innerHTML = output;
    }
}
