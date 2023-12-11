const API_KEY = "34bf327f96954126b4c0477547cd6844";
const url = "https://vepro.hocke.eu/proxy/index.php?https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => fetchNews("India"));

function reload(){
    window.location.reload();
}

async function fetchNews(query) {
    const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
    const data = await res.json();
    /* jo data aaya usko json format me convert kar lia */
    // data articles ki form me ata hai
    bindData(data.articles);
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";
    // bind data karane ne se pehle html ko empty karna hai
    // nahi to bar bar 100 ke baad repeat ho jayegi api calls
    // 100 tak hi limited hoti hai article me values from
    // the News API site by Anuj Bhaiya

    articles.forEach((article) => {
        if (!article.urlToImage) return;
        // agar kisi data(element of the article) me image 
        // nahi hai to program wahi se return ho jayega
        const cardClone = newsCardTemplate.content.cloneNode(true);
        // iska mtlb hai hhumne jitnin bhi div ko define kia hai
        // apne html me un sabhi ki hi copy hogi mtlb deep copy

        fillDataInCard(cardClone, article);
        // data card me fill karne ke liye

        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone,article) {
    const newsImg = cardClone.querySelector('#news-img');
    const newsTitle = cardClone.querySelector('#news-title');
    const newsSource = cardClone.querySelector('#news-source');
    const newsDesc = cardClone.querySelector('#news-desc');

    newsImg.src = article.urlToImage; //urlToImage as mentioned in news api
    newsTitle.innerHTML = article.title; //querySelector as mentioned in news api
    newsDesc.innerHTML = article.description; //description as mentioned in news api

    // "publishedAt": "2023-10-30T18:50:13Z" 
    // agar site pe aise time and date di hai aur ise change 
    // karke show karna chahte ho to uske liye bhi JS me 
    // method hai and that is 

    const date = new Date(article.publishedAt).toLocaleString("en-US",{timeZone: "Asia/Jakarta"});
    
    newsSource.innerHTML = `${article.source.name} • ${date}`

    cardClone.firstElementChild.addEventListener("click",()=>{
        window.open(article.url,"_blank");
    });

}
let curSelectedNav=null; // pehle define karna jaruri hai

function onNavItemClick(id){
    fetchNews(id); // news fetch ho jayegi click karne pe us id ki
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove('active'); // current selected nav item me se active class remove ho jayegi
    curSelectedNav = navItem; // current selective nav item change ho jayega
    curSelectedNav.classList.add('active'); // aur usme active class add hi jayegi
}

const searchButton = document.getElementById('search-button');
const searchText = document.getElementById('search-text');

searchButton.addEventListener('click',()=>{
    const query = searchText.value;
    if(!query) return ;
    fetchNews(query);
    curSelectedNav?.classList.remove('active');
    curSelectedNav=null;
});

