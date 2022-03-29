import { fetchData } from "./utils/fetchData.js";

const characterName = document.getElementsByClassName('character-name');
const characterGender = document.getElementsByClassName('character-gender');
const characterLocation = document.getElementsByClassName('character-location');
const characterSpecies = document.getElementsByClassName('character-species');
const characterImages = document.getElementsByClassName('character-image');

const API = "https://rickandmortyapi.com/api/";
let APILinks = {}; 

let characters = [];
let episodes = [];
let locations = [];

const getAPIResources = async () => {
    try {
        APILinks = await fetchData(API);
        [characters, episodes, locations] = await Promise.all([
            fetchData(APILinks.characters),
            fetchData(APILinks.episodes),
            fetchData(APILinks.locations)
        ]);
        
        printCharacterCards();
        
    } catch(error) {
        console.error(error);
    }
}
getAPIResources();

function printCharacterCards() {
    for(let i = 0; i < characterName.length; i++) {
        characterImages[i].src = characters.results[i].image;
        characterName[i].innerHTML += ' ' + characters.results[i].name;
        characterGender[i].innerHTML += ' ' + characters.results[i].gender;
        characterLocation[i].innerHTML += ' ' + characters.results[i].location.name;
        characterSpecies[i].innerHTML += ' ' + characters.results[i].species;
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
