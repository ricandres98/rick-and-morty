import { fetchData } from "./utils/fetchData.js";
import { getInputValue, deleteCards } from "./utils/utilities.js";

const inputSearch = document.getElementById('input-search');

const pageNumber = [...document.getElementsByClassName('page-number')];

const API = "https://rickandmortyapi.com/api/character/";

let characters = [];
let pageNumberValue = 1;

// Crear HTML dinámico para crear tarjeta de personaje
function createCharacterCard(){
    const character = document.createElement('div');
    character.classList.add('character');
    
    const characterImg = document.createElement('div');
    characterImg.classList.add('character__image');
    const img = document.createElement('img');
    characterImg.appendChild(img);

    const characterInfo = document.createElement('div');
    characterInfo.classList.add('character__info');

    const ul = document.createElement('ul');

    const liName = document.createElement('li');
    liName.classList.add('character-name');
    const liGender = document.createElement('li');
    liGender.classList.add('character-gender');
    const liLocation = document.createElement('li');
    liLocation.classList.add('character-location');
    const liSpecies = document.createElement('li');
    liSpecies.classList.add('character-species');

    const liArray = [liName, liGender, liLocation, liSpecies];

    liArray.forEach(li => ul.appendChild(li));
    characterInfo.appendChild(ul);

    character.appendChild(characterImg);
    character.appendChild(characterInfo);
    
    const charactersContainer = document.querySelector('.characters-page__main-grid-container');
    charactersContainer.appendChild(character);

    return {
        character, 
        img, 
        liName, 
        liGender, 
        liLocation, 
        liSpecies
    }
}


const getAPIResources = async () => {
    try {
        characters = await fetchData(API);
    
        pageNumber.forEach((item) => item.innerText = `${pageNumberValue} / ${characters.info.pages}`);
        printCharacterCards();
    } catch(error) {
        console.error(error);
    }
}

function printCharacterCards() {
    deleteCards('character');

    characters.results.forEach(data => {
        const card = createCharacterCard();
        card.img.src = data.image;
        card.img.alt = data.name;
        card.liName.innerHTML = `<strong>Name: </strong> ${data.name}`;
        card.liGender.innerHTML = `<strong>Gender: </strong> ${data.gender}`;
        card.liLocation.innerHTML = `<strong>Location: </strong> ${data.location.name}`;
        card.liSpecies.innerHTML = `<strong>Species: </strong> ${data.species}`;
    });
}

const nextPage = async () => {
    if(characters.info.next != null) {
        pageNumberValue += 1;
        pageNumber.forEach((item) => item.innerText = `${pageNumberValue} / ${characters.info.pages}`);

        characters = await fetchData(characters.info.next);

        printCharacterCards();
    }
}
const priorPage = async () => {
    if(characters.info.prev != null) {
        pageNumberValue -= 1;
        pageNumber.forEach((item) => item.innerText = `${pageNumberValue} / ${characters.info.pages}`);

        characters = await fetchData(characters.info.prev);

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

        pageNumberValue = 1;
        
        printCharacterCards();
    } catch(error){
        console.error(error, `Nothing found under keywords: ${inputSearch.value}`);
        deleteCards('character');

        characters = {info: {pages: 0}}; //Para que muestre cero
        pageNumberValue = 0;
    }
    pageNumber.forEach((item) => item.innerText = `${pageNumberValue} / ${characters.info.pages}`);

    console.log(characters);
}

document.addEventListener('onload', getAPIResources());
window.nextPage = nextPage;
window.priorPage = priorPage;
window.searchCharacters = searchCharacters;