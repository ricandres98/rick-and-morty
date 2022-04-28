import { fetchData } from "./utils/fetchData.js";
import { getInputValue, deleteCards } from "./utils/utilities.js";

const pageNumber = [...document.getElementsByClassName('page-number')];

const inputSearch = document.getElementById('input-search');

const API = 'https://rickandmortyapi.com/api/episode/';

let episodes = [];
let pageNumberValue = 1;

function createEpisodeCard(){
    const episode = document.createElement('div');
    episode.classList.add('episode');
    
    const episodeInfo = document.createElement('div');
    episodeInfo.classList.add('episode__info');

    const ul = document.createElement('ul');

    const liName = document.createElement('li');
    liName.classList.add('episode-name');
    const liDate = document.createElement('li');
    liDate.classList.add('episode-date');
    const liNumber = document.createElement('li');
    liNumber.classList.add('episode-number');

    const liArray = [liName, liDate, liNumber];

    liArray.forEach(li => ul.appendChild(li));
    episodeInfo.appendChild(ul);

    episode.appendChild(episodeInfo);
    
    const episodesContainer = document.querySelector('.episodes-page__main-grid-container');
    episodesContainer.appendChild(episode);

    return {
        episode, 
        liName, 
        liDate, 
        liNumber, 
    }
}

const getAPIResources = async () => {
    try {
        episodes = await fetchData(API);
        
        console.log(episodes);
        printEpisodeCards();
        pageNumber.forEach((item) => item.innerText = `${pageNumberValue} / ${episodes.info.pages}`);
    } catch(error) {
        console.error(error);
    }
}

function printEpisodeCards() {
    deleteCards('episode');
    episodes.results.forEach(data => {
        const card = createEpisodeCard();
        card.liName.innerHTML = `${data.name}`;
        card.liDate.innerHTML = `${data.air_date}`;
        card.liNumber.innerHTML = `${data.episode}`;
    });
}

const nextPage = async () => {
    if(episodes.info.next != null) {
        pageNumberValue += 1;
        pageNumber.forEach((item) => item.innerText = `${pageNumberValue} / ${episodes.info.pages}`);

        episodes = await fetchData(episodes.info.next);

        printEpisodeCards();
    }
}
const priorPage = async () => {
    if(episodes.info.prev != null) {
        pageNumberValue -= 1;
        pageNumber.forEach((item) => item.innerText = `${pageNumberValue} / ${episodes.info.pages}`);

        episodes = await fetchData(episodes.info.prev);

        printEpisodeCards();
    }
}

const searchEpisodes = async () => {
    try {
        console.log(API + '?name=' + getInputValue(inputSearch));
        episodes = await fetchData(API + '?name=' + getInputValue(inputSearch));

        pageNumberValue = 1;
        printEpisodeCards();
    } catch(error){
        console.error(error, `Nothing found under keywords: ${inputSearch.value}`);
        deleteCards('episode');

        episodes = {info: {pages: 0}}; //Para que muestre cero
        pageNumberValue = 0;
    }
    pageNumber.forEach((item) => item.innerText = `${pageNumberValue} / ${episodes.info.pages}`);

}

document.addEventListener('onload', getAPIResources());

window.nextPage = nextPage;
window.priorPage = priorPage;
window.searchEpisodes = searchEpisodes;