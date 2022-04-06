import { fetchData } from "./utils/fetchData.js";
import { getInputValue } from "./utils/getInputValue.js";

const locationName = [ ...document.getElementsByClassName('location-name')];
const locationType = [ ...document.getElementsByClassName('location-type')];
const locationDimension = [ ...document.getElementsByClassName('location-dimension')];
const locationCards = [...document.getElementsByClassName('location')];

const pageNumber = [...document.getElementsByClassName('page-number')];

const inputSearch = document.getElementById('input-search');

const API = 'https://rickandmortyapi.com/api/location/';

let locations = [];
let pageNumberValue = 1;
let lastResult = '';

const getAPIResources = async () => {
    try {
        locations = await fetchData(API);
        lastResult = locations;

        console.log(locations);
        printLocationsCards();
        pageNumber.forEach((item) => item.innerText = `${pageNumberValue} / ${lastResult.info.pages}`);
    } catch(error) {
        console.error(error);
    }
}

getAPIResources();

function resetCardsValues() {
    for(let i = 0; i < locationName.length; i++) {
        locationName[i].innerHTML = '';
        locationType[i].innerHTML = '<strong>Type: </strong> ';
        locationDimension[i].innerHTML = '<strong>Dimension: </strong> ';
    }
}

function printLocationsCards() {
    locationCards.forEach((card) => card.style.display = 'block');
    if(lastResult.results.length < locationCards.length) {
        let diff = lastResult.results.length;
        for(let i = diff; i < 20; i++) {
            locationCards[i].style.display = 'none';
        }
    }
    resetCardsValues();
    for(let i = 0; i < lastResult.results.length; i++) {
        locationName[i].innerHTML += ' ' + locations.results[i].name;
        locationType[i].innerHTML += ' ' + locations.results[i].type;
        locationDimension[i].innerHTML += ' ' + locations.results[i].dimension;
    }
}


const nextPage = async () => {
    if(lastResult.info.next != null) {
        pageNumberValue += 1;
        pageNumber.forEach((item) => item.innerText = `${pageNumberValue} / ${lastResult.info.pages}`);

        locations = await fetchData(lastResult.info.next);
        lastResult = locations;

        printLocationsCards();
    }
}
const priorPage = async () => {
    if(lastResult.info.prev != null) {
        pageNumberValue -= 1;
        pageNumber.forEach((item) => item.innerText = `${pageNumberValue} / ${lastResult.info.pages}`);

        locations = await fetchData(lastResult.info.prev);
        lastResult = locations;

        printLocationsCards();
    }
}

const searchLocations = async () => {
    try {
        console.log(API + '?name=' + getInputValue(inputSearch));
        locations = await fetchData(API + '?name=' + getInputValue(inputSearch));
        lastResult = locations;

        pageNumberValue = 1;
        pageNumber.forEach((item) => item.innerText = `${pageNumberValue} / ${lastResult.info.pages}`);

        printLocationsCards();
    } catch(error){
        console.error(error, `Nothing found under keywords: ${inputSearch.value}`);
        locationCards.forEach((card) => card.style.display = "none");

        lastResult = {info: {pages: 0}}; //Para que muestre cero
        pageNumberValue = 0;
        pageNumber.forEach((item) => item.innerText = `${pageNumberValue} / ${lastResult.info.pages}`);
    }
}

window.nextPage = nextPage;
window.priorPage = priorPage;
window.searchLocations = searchLocations;
