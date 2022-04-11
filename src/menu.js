const buttonMenu = document.getElementById('navbar');
const main = [...document.getElementsByTagName('main')];

console.log(main);

main[0].addEventListener('click', () => {
    buttonMenu.checked = false;
})

