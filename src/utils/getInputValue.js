export const getInputValue = (input) => {
    let stringToFind = input.value;
    stringToFind = stringToFind.trim();
    while(stringToFind.includes(' ')) {
        stringToFind = stringToFind.replace(' ', '%20');
    }
    return stringToFind;
}