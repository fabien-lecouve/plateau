function getRandomInteger(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}

function getUniqueRandomIntegers(nbr, min, max) {
    let array = [];
    for (let i = 0; i < nbr; i++) {
        let integer;
        do {
            integer = getRandomInteger(min, max);
        } while (array.includes(integer));
        array.push(integer);
    }
    return array;
}

function countOccurrences(array) {
    let counter = {};
    array.forEach(element => {
        counter[element] = (counter[element] || 0) + 1;
    });
    return counter;
}

function getIndexFromHtmlElement(parent, child) {
    return [...parent.children].indexOf(child);
}

function initializePlayers(array) {
    array.forEach(player => {
        desactivePlayer(player);
    });
}

function activePlayer(player) {
    let theme = localStorage.getItem('theme');
    player.style.setProperty('--secondary-bg-color', getComputedStyle(body).getPropertyValue(`--${theme}-text-color`));
    
    Array.from(player.children).forEach(child => {
        child.style.setProperty('--text-color', getComputedStyle(body).getPropertyValue(`--${theme}-primary-bg-color`));
    })
}

function desactivePlayer(player) {
    let theme = localStorage.getItem('theme');
   
    player.style.setProperty('--secondary-bg-color', '');
    Array.from(player.children).forEach(child => {
        child.style.setProperty('--text-color', getComputedStyle(body).getPropertyValue(`--${theme}-text-color`));
    })
    
}

function removeAllChildren(id) {
    document.getElementById(id).innerHTML = '';
}

function startTimer(htmlElement) {
    let timer = 0;
    
    let id = setInterval(() => {
        let minutes = parseInt(timer / 60);
        let seconds = parseInt(timer % 60);
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        htmlElement.textContent = `${minutes} : ${seconds}`;
        timer++;
    }, 1000);

    return id;
}

function stopTimer(timerId) {
    clearInterval(timerId);
}