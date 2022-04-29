export const getInputValue = (input) => {
    let stringToFind = input.value;
    stringToFind = stringToFind.trim();
    while(stringToFind.includes(' ')) {
        stringToFind = stringToFind.replace(' ', '%20');
    }
    return stringToFind;
}

export function deleteCards(type) {
    const charactersContainer = document.querySelector(`.${type}-page__main-grid-container`);
    const cardsQuantity = charactersContainer.childNodes.length;
    for(let i = 0; i < cardsQuantity; i++){
        charactersContainer.removeChild(charactersContainer.childNodes[0]);
    }
}