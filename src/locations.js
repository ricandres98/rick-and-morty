import { fetchData } from "./utils/fetchData.js";
import { getInputValue, deleteCards } from "./utils/utilities.js";

const pageNumber = [...document.getElementsByClassName('page-number')];

const inputSearch = document.getElementById('input-search');

const API = 'https://rickandmortyapi.com/api/location/';

let locations = [];
let pageNumberValue = 1;

function createLocationCard(){
    const location = document.createElement('div');
    location.classList.add('location');
    
    const locationInfo = document.createElement('div');
    locationInfo.classList.add('location__info');

    const ul = document.createElement('ul');

    const liName = document.createElement('li');
    liName.classList.add('location-name');
    const liType = document.createElement('li');
    liType.classList.add('location-type');
    const liDimension = document.createElement('li');
    liDimension.classList.add('location-dimension');

    const liArray = [liName, liType, liDimension];

    liArray.forEach(li => ul.appendChild(li));
    locationInfo.appendChild(ul);

    location.appendChild(locationInfo);
    
    const locationsContainer = document.querySelector('.locations-page__main-grid-container');
    // locationsContainer.appendChild(location);

    return {
        location, 
        liName, 
        liType, 
        liDimension, 
    }
}

const getAPIResources = async () => {
    try {
        locations = await fetchData(API);

        console.log(locations);
        printLocationCards();
        pageNumber.forEach((item) => item.innerText = `${pageNumberValue} / ${locations.info.pages}`);
    } catch(error) {
        console.error(error);
    }
}

function printLocationCards() {
    const locationsContainer = document.querySelector('.locations-page__main-grid-container');
    const fragment = new DocumentFragment();

    locationsContainer.innerHTML = "";
    // deleteCards('locations');
    locations.results.forEach(data => {
        const card = createLocationCard();
        card.liName.innerHTML = `${data.name}`;
        card.liType.innerHTML = `<strong>Type: </strong> ${data.type}`;
        card.liDimension.innerHTML = `<strong>Dimension: </strong> ${data.dimension}`;

        fragment.appendChild(card.location);
    });
    locationsContainer.appendChild(fragment);
}

const nextPage = async () => {
    if(locations.info.next != null) {
        pageNumberValue += 1;
        pageNumber.forEach((item) => item.innerText = `${pageNumberValue} / ${locations.info.pages}`);

        locations = await fetchData(locations.info.next);

        printLocationCards();
    }
}

const priorPage = async () => {
    if(locations.info.prev != null) {
        pageNumberValue -= 1;
        pageNumber.forEach((item) => item.innerText = `${pageNumberValue} / ${locations.info.pages}`);

        locations = await fetchData(locations.info.prev);

        printLocationCards();
    }
}

const searchLocations = async () => {
    try {
        console.log(API + '?name=' + getInputValue(inputSearch));
        locations = await fetchData(API + '?name=' + getInputValue(inputSearch));

        pageNumberValue = 1;

        printLocationCards();
    } catch(error){
        console.error(error, `Nothing found under keywords: ${inputSearch.value}`);
        deleteCards('locations');

        locations = {info: {pages: 0}}; //Para que muestre cero
        pageNumberValue = 0;
    }
    pageNumber.forEach((item) => item.innerText = `${pageNumberValue} / ${locations.info.pages}`);

}

document.addEventListener('onload', getAPIResources());

window.nextPage = nextPage;
window.priorPage = priorPage;
window.searchLocations = searchLocations;
