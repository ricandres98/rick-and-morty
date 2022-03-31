import { fetchData } from "./utils/fetchData.js";
import { getInputValue } from "./utils/getInputValue.js";

const characterName = document.getElementsByClassName('character-name');
const characterGender = document.getElementsByClassName('character-gender');
const characterLocation = document.getElementsByClassName('character-location');
const characterSpecies = document.getElementsByClassName('character-species');
const characterImages = document.getElementsByClassName('character-image');
const characterCards = [...document.getElementsByClassName('character')];

const inputSearch = document.getElementById('input-search');

const pageNumber = [...document.getElementsByClassName('page-number')];

const API = "https://rickandmortyapi.com/api/character/";
let characters = [];
let pageNumberValue = 1;
// Variable que permite almacenar el último objeto recibido a través de fetchData,
// sirve para implementar más facilmente la paginación
let lastResult = '';


const getAPIResources = async () => {
    try {
        characters = await fetchData(API);
        lastResult = characters;
        pageNumber.forEach((item) => item.innerText = `${pageNumberValue} / ${lastResult.info.pages}`);
        printCharacterCards();
    } catch(error) {
        console.error(error);
    }
}
function printCharacterCards() {
    characterCards.forEach((card) => card.style.display = 'block');
    if(lastResult.results.length < characterCards.length) {
        let diff = lastResult.results.length;
        for(let i = diff; i < 20; i++) {
            characterCards[i].style.display = 'none';
        }
    }
    // let toBeUsed = lastResult.results.slice()
    resetCardsValues();
    for(let i = 0; i < lastResult.results.length; i++) {
        characterImages[i].src = characters.results[i].image;
        characterImages[i].alt = characters.results[i].name;
        characterName[i].innerHTML += ' ' + characters.results[i].name;
        characterGender[i].innerHTML += ' ' + characters.results[i].gender;
        characterLocation[i].innerHTML += ' ' + characters.results[i].location.name;
        characterSpecies[i].innerHTML += ' ' + characters.results[i].species;
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
    if(lastResult.info.next != null) {
        pageNumberValue += 1;
        pageNumber.forEach((item) => item.innerText = `${pageNumberValue} / ${lastResult.info.pages}`);

        characters = await fetchData(lastResult.info.next);
        lastResult = characters;

        printCharacterCards();
    }
}
const priorPage = async () => {
    if(lastResult.info.prev != null) {
        pageNumberValue -= 1;
        pageNumber.forEach((item) => item.innerText = `${pageNumberValue} / ${lastResult.info.pages}`);

        characters = await fetchData(lastResult.info.prev);
        lastResult = characters;

        printCharacterCards();
    }
}

// search(characters, printCharacterCards, characterCards)
// const search = async (resultOfSearch, printfunction, Cards) => {
//     try {
//         console.log(API + '?name=' + getInputValue());
//         resultOfSearch = await fetchData(API + '?name=' + getInputValue());
//         lastResult = resultOfSearch;

//         pageNumberValue = 1;
//         pageNumber.forEach((item) => item.innerText = `${pageNumberValue} / ${lastResult.info.pages}`);

//         printfunction();
//     } catch(error){
//         console.error(error, `Nothing found under keywords: ${inputSearch.value}`);
//         Cards.forEach((card) => card.style.display = "none");

//         lastResult = {info: {pages: 0}}; //Para que muestre cero
//         pageNumberValue = 0;
//         pageNumber.forEach((item) => item.innerText = `${pageNumberValue} / ${lastResult.info.pages}`);
//     }
// }
const searchCharacters = async () => {
    try {
        console.log(API + '?name=' + getInputValue(inputSearch));
        characters = await fetchData(API + '?name=' + getInputValue(inputSearch));
        lastResult = characters;

        pageNumberValue = 1;
        pageNumber.forEach((item) => item.innerText = `${pageNumberValue} / ${lastResult.info.pages}`);

        printCharacterCards();
    } catch(error){
        console.error(error, `Nothing found under keywords: ${inputSearch.value}`);
        characterCards.forEach((card) => card.style.display = "none");

        lastResult = {info: {pages: 0}}; //Para que muestre cero
        pageNumberValue = 0;
        pageNumber.forEach((item) => item.innerText = `${pageNumberValue} / ${lastResult.info.pages}`);
    }
}

document.addEventListener('onload', getAPIResources());
window.nextPage = nextPage;
window.priorPage = priorPage;
window.searchCharacters = searchCharacters;