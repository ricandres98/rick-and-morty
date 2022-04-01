import { fetchData } from "./utils/fetchData.js";
import { getInputValue } from "./utils/getInputValue.js";

const episodeName = [ ...document.getElementsByClassName('episode-name')];
const episodeDate = [ ...document.getElementsByClassName('episode-date')];
const episodeNumber = [ ...document.getElementsByClassName('episode-number')];
const episodeCards = [...document.getElementsByClassName('episode')];

const pageNumber = [...document.getElementsByClassName('page-number')];

const inputSearch = document.getElementById('input-search');

const API = 'https://rickandmortyapi.com/api/episode/';

let episodes = [];
let pageNumberValue = 1;
let lastResult = '';

const getAPIResources = async () => {
    try {
        episodes = await fetchData(API);
        lastResult = episodes;
        // pageNumber.forEach((item) => item.innerText = `${pageNumberValue} / ${lastResult.info.pages}`);
        // printCharacterCards();
        console.log(episodes);
        printEpisodeCards();
    } catch(error) {
        console.error(error);
    }
}
getAPIResources();

function printEpisodeCards() {
    episodeCards.forEach((card) => card.style.display = 'block');
    if(lastResult.results.length < episodeCards.length) {
        let diff = lastResult.results.length;
        for(let i = diff; i < 20; i++) {
            episodeCards[i].style.display = 'none';
        }
    }
    resetCardsValues();
    for(let i = 0; i < lastResult.results.length; i++) {
        episodeName[i].innerHTML += ' ' + episodes.results[i].name;
        episodeDate[i].innerHTML += ' ' + episodes.results[i].air_date;
        episodeNumber[i].innerHTML += ' ' + episodes.results[i].episode;
    }
}
function resetCardsValues() {
    for(let i = 0; i < episodeName.length; i++) {
        episodeName[i].innerHTML ='' /*'<strong>Name: </strong>'*/;
        episodeDate[i].innerHTML = ''/*'<strong>Date: </strong>'*/;
        episodeNumber[i].innerHTML = ''/*'<strong>Episode: </strong>'*/;
    }
}

const nextPage = async () => {
    if(lastResult.info.next != null) {
        pageNumberValue += 1;
        pageNumber.forEach((item) => item.innerText = `${pageNumberValue} / ${lastResult.info.pages}`);

        episodes = await fetchData(lastResult.info.next);
        lastResult = episodes;

        printEpisodeCards();
    }
}
const priorPage = async () => {
    if(lastResult.info.prev != null) {
        pageNumberValue -= 1;
        pageNumber.forEach((item) => item.innerText = `${pageNumberValue} / ${lastResult.info.pages}`);

        episodes = await fetchData(lastResult.info.prev);
        lastResult = episodes;

        printEpisodeCards();
    }
}

const searchEpisodes = async () => {
    try {
        console.log(API + '?name=' + getInputValue(inputSearch));
        episodes = await fetchData(API + '?name=' + getInputValue(inputSearch));
        lastResult = episodes;

        pageNumberValue = 1;
        pageNumber.forEach((item) => item.innerText = `${pageNumberValue} / ${lastResult.info.pages}`);

        printEpisodeCards();
    } catch(error){
        console.error(error, `Nothing found under keywords: ${inputSearch.value}`);
        episodeCards.forEach((card) => card.style.display = "none");

        lastResult = {info: {pages: 0}}; //Para que muestre cero
        pageNumberValue = 0;
        pageNumber.forEach((item) => item.innerText = `${pageNumberValue} / ${lastResult.info.pages}`);
    }
}

window.nextPage = nextPage;
window.priorPage = priorPage;
window.searchEpisodes = searchEpisodes;