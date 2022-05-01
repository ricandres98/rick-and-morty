import { fetchData } from "./utils/fetchData.js";
import { deleteCards } from "./utils/utilities.js";

const API = "https://rickandmortyapi.com/api/character/"; 

let characters = [];

function createCharacterCard(){
    const card = document.createElement('div');
    card.classList.add('character');
    
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

    card.appendChild(characterImg);
    card.appendChild(characterInfo);
    
    const charactersContainer = document.querySelector('.main-page__main-grid-container');
    // charactersContainer.appendChild(character);

    return {
        card, 
        img, 
        liName, 
        liGender, 
        liLocation, 
        liSpecies,
    }
}
const randomNumber = (min, max/*826*/) => {
    const number = Math.floor(Math.random() * (max - min +1)) + min;
    return number;
}
const charactersArray = (length) => {
    const array = [];
    for(let i = 0; i < length; i ++) {
        array.push(randomNumber(1,826));
    }
    return array;
}

const getAPIResources = async () => {
    try {
        characters = await fetchData(API + charactersArray(8));
        console.log(characters);
        printCharacterCards();
        
    } catch(error) {
        console.error(API + charactersArray(8));
    }
}

function printCharacterCards() {
    const charactersContainer = document.querySelector('.main-page__main-grid-container');
    const fragment = new DocumentFragment();
    
    // deleteCards('main');
    charactersContainer.innerHTML = "";
    characters.forEach(data => {
        const card = createCharacterCard();
        
        card.img.src = data.image;
        card.img.alt = data.name;
        card.liName.innerHTML = `<strong>Name: </strong> ${data.name}`;
        card.liGender.innerHTML = `<strong>Gender: </strong> ${data.gender}`;
        card.liLocation.innerHTML = `<strong>Location: </strong> ${data.location.name}`;
        card.liSpecies.innerHTML = `<strong>Species: </strong> ${data.species}`;
        
        fragment.appendChild(card.card);
    });
    charactersContainer.appendChild(fragment);
    console.log(fragment)

}
function refresh() {
    getAPIResources();
}

getAPIResources();
window.refresh = refresh;
