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

const fetchData = (url_api) => {
    return new Promise((resolve, reject) => {
        const xhttp = new XMLHttpRequest();
        xhttp.open('GET', url_api, true);
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState === 4) {
                (xhttp.status === 200)
                  ? resolve(JSON.parse(xhttp.responseText))
                  : reject( new Error(`Error with XMLHttp request
                  status: ${xhttp.status}`, url_api))
            }
        }
        xhttp.send();
    });
}

const getAPIResources = async () => {
    try {
        APILinks = await fetchData(API);
        [characters, episodes, locations] = await Promise.all([
            fetchData(APILinks.characters),
            fetchData(APILinks.episodes),
            fetchData(APILinks.locations)
        ]);
        
        for(let i = 0; i < characterName.length; i++) {
            characterImages[i].src = characters.results[i].image;
            characterName[i].innerText += ' ' + characters.results[i].name;
            characterGender[i].innerText += ' ' + characters.results[i].gender;
            characterLocation[i].innerText += ' ' + characters.results[i].location.name;
            characterSpecies[i].innerText += ' ' + characters.results[i].species;
        }
        
    } catch(error) {
        console.error(error);
    }
}
getAPIResources();

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
