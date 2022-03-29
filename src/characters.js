import { fetchData } from "./utils/fetchData.js";

const characterName = document.getElementsByClassName('character-name');
const characterGender = document.getElementsByClassName('character-gender');
const characterLocation = document.getElementsByClassName('character-location');
const characterSpecies = document.getElementsByClassName('character-species');
const characterImages = document.getElementsByClassName('character-image');

const pageNumber = [...document.getElementsByClassName('page-number')];
console.log(pageNumber);

const API = "https://rickandmortyapi.com/api/";
let APILinks = {}; 
let characters = [];
let firstItemToShow = 1;
let lastItemToShow = 20;
let pageNumberValue = 1;


const getAPIResources = async () => {
    try {
        APILinks = await fetchData(API);
        characters = await getPage(APILinks.characters, firstItemToShow, lastItemToShow);
        printCharacterCards();
    } catch(error) {
        console.error(error);
    }
}
const intervalArray = (start, end) => {
    const array = [];
    for(let i = start; i <= end; i++) {
        array.push(i);
    }
    return array;
}
const getPage = async (url, start, end) => {
    return await fetchData(url + '/' + intervalArray(start,end));
}
function printCharacterCards() {
    resetCardsValues();
    for(let i = 0; i < characterName.length; i++) {
        characterImages[i].src = characters[i].image;
        characterImages[i].alt = characters[i].name;
        characterName[i].innerHTML += ' ' + characters[i].name;
        characterGender[i].innerHTML += ' ' + characters[i].gender;
        characterLocation[i].innerHTML += ' ' + characters[i].location.name;
        characterSpecies[i].innerHTML += ' ' + characters[i].species;
    }
}
function resetCardsValues() {
    for(let i = 0; i < characterName.length; i++) {
        characterName[i].innerHTML = '<strong>Name: </strong>';
        characterGender[i].innerHTML = '<strong>Gender: </strong>';
        characterLocation[i].innerHTML = '<strong>Location: </strong>';
        characterSpecies[i].innerHTML = '<strong>Species: </strong>';
    }
}
const nextPage = async () => {
    firstItemToShow += 20;
    lastItemToShow += 20;
    pageNumberValue += 1;
    pageNumber.forEach((item) => item.innerText = pageNumberValue);
    characters = await getPage(APILinks.characters, firstItemToShow, lastItemToShow)
    printCharacterCards();
}
const priorPage = async () => {
    if(firstItemToShow > 20) {
        firstItemToShow -= 20;
        lastItemToShow -= 20;
        pageNumberValue -= 1;
        pageNumber.forEach((item) => item.innerText = pageNumberValue);
        characters = await getPage(APILinks.characters, firstItemToShow, lastItemToShow)
        printCharacterCards();
    }
}
document.addEventListener('onload', getAPIResources());
window.nextPage = nextPage;
window.priorPage = priorPage;