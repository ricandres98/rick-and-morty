import { fetchData } from "./utils/fetchData.js";
import { getInputValue, deleteCards } from "./utils/utilities.js";

const inputSearch = document.getElementById('input-search');

const pageNumberBottom = document.querySelector('div + div.panel .pages span');
const pageNumberTop = document.querySelector('.pages input + span.page-number')

const API = "https://rickandmortyapi.com/api/character/";
let lastURL = '';

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
        lastURL = API;
    
        pageNumberTop.innerText = `/ ${characters.info.pages}`;
        pageNumberBottom.innerText = `${pageNumberValue} / ${characters.info.pages}`;

        printCharacterCards();
    } catch(error) {
        console.error(error);
    }
}

function printCharacterCards() {
    deleteCards('characters');

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
        const inputPage = document.querySelector('.pages input');

        pageNumberValue += 1;
        inputPage.placeholder = pageNumberValue;
        inputPage.value = pageNumberValue;

        pageNumberTop.innerText = `/ ${characters.info.pages}`;
        pageNumberBottom.innerText = `${pageNumberValue} / ${characters.info.pages}`;

        characters = await fetchData(characters.info.next);

        printCharacterCards();
    }
}
const priorPage = async () => {
    if(characters.info.prev != null) {
        const inputPage = document.querySelector('.pages input');

        pageNumberValue -= 1;
        inputPage.placeholder = pageNumberValue;
        inputPage.value = pageNumberValue;

        pageNumberTop.innerText = `/ ${characters.info.pages}`;
        pageNumberBottom.innerText = `${pageNumberValue} / ${characters.info.pages}`;

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
//         pageNumberTop.innerText = `${pageNumberValue} / ${lastResult.info.pages}`;

//         printfunction();
//     } catch(error){
//         console.error(error, `Nothing found under keywords: ${inputSearch.value}`);
//         Cards.forEach((card) => card.style.display = "none");

//         lastResult = {info: {pages: 0}}; //Para que muestre cero
//         pageNumberValue = 0;
//         pageNumberTop.innerText = `${pageNumberValue} / ${lastResult.info.pages}`;
//     }
// }
const searchCharacters = async () => {
    const inputPage = document.querySelector('.pages input');

    try {
        console.log(API + '?name=' + getInputValue(inputSearch));
        characters = await fetchData(API + '?name=' + getInputValue(inputSearch));

        lastURL = API + '?name=' + getInputValue(inputSearch);

        pageNumberValue = 1;
        inputPage.value = pageNumberValue;
        
        printCharacterCards();
    } catch(error){
        console.error(error, `Nothing found under keywords: ${inputSearch.value}`);
        const charactersContainer = document.querySelector('.characters-page__main-grid-container');
        
        deleteCards('characters');
        charactersContainer.innerHTML = `<p>Nothing found under keywords: ${inputSearch.value}</p>`;

        characters = {info: {pages: 0}}; //Para que muestre cero

        pageNumberValue = 0;
    }

    inputPage.placeholder = pageNumberValue;
    inputPage.value = pageNumberValue;
    
    pageNumberTop.innerText = `/ ${characters.info.pages}`;
    pageNumberBottom.innerText = `${pageNumberValue} / ${characters.info.pages}`;


    console.log(characters);
}


const goToPage = async() => {
    const inputPage = document.querySelector('.pages input');

    if(inputPage.value && Number(inputPage.value)) {
        pageNumberValue = Number(inputPage.value);

        if(inputPage.value > characters.info.pages) {
            pageNumberValue = characters.info.pages;
            inputPage.value = characters.info.pages;
        }

        inputPage.placeholder = pageNumberValue;
        pageNumberBottom.innerText = `${pageNumberValue} / ${characters.info.pages}`;

        try {
            if(lastURL.includes('?')) {
                characters = await fetchData(lastURL + '&page=' + pageNumberValue);
            } else {
                characters = await fetchData(lastURL + '?page=' + pageNumberValue);
            }
        } catch(error) {
            console.error("report for function goToPage(): ", error)
        }
        
        console.log(characters);
        printCharacterCards();
    }
}

const inputPage = document.querySelector('.pages input');
inputPage.addEventListener('keyup', (event) => {
    if(event.key === 'Enter') {
        goToPage();
    }
});

inputSearch.addEventListener('keyup', (event) => {
    if(event.key === 'Enter') {
        searchCharacters();
    }
})

document.addEventListener('onload', getAPIResources());
window.nextPage = nextPage;
window.priorPage = priorPage;
window.searchCharacters = searchCharacters;