// // VARIABLES
const boardGame = document.getElementById('memory-cards');

const selectedCards = [];
const selectedIndexes = [];
let player1Points;
let player2Points;
let timer ;
let timerId;
let selectedPlayer;
let allCardIndexesRemaining = [];
let memorizedCards = {};

// // FUNCTIONS
function loadGameBoard() {
    let mode = localStorage.getItem('mode-memory');
    let difficulty = localStorage.getItem('difficulty-memory');
    resetGame();

    const titlePlayer2 = document.getElementById('player2').children[0];
    const subtitlePlayer2 = document.getElementById('player2').children[1];

    switch (mode) {
        case 'player-vs-player':
            titlePlayer2.textContent = 'joueur 2';
            subtitlePlayer2.innerHTML = 'Points : <span id="player2Points">0</span>';
            break;
        case 'player-vs-computer':
            titlePlayer2.textContent = 'ordinateur';
            subtitlePlayer2.innerHTML = 'Points : <span id="player2Points">0</span>';
            break;
        default:
            titlePlayer2.textContent = 'temps';
            subtitlePlayer2.textContent = '00 : 00';
            break;
    }

    switch (difficulty) {
        case 'very_easy':
            intervalTime = 2000;
            buildBoardGame(3, 4);
            break;
        case 'easy':
            intervalTime = 2000;
            buildBoardGame(4, 4);
            break;
        case 'hard':
            intervalTime = 500;
            buildBoardGame(6, 5);
            break;
        case 'very_hard':
            intervalTime = 500;
            buildBoardGame(6, 6);
            break;
        default:
            intervalTime = 1000;
            buildBoardGame(4, 5);
            break;
    }

    changePlayer();
    displayPlayersPoints();

    for ( let i = 0; i < boardGame.children.length; i++) {
        allCardIndexesRemaining.push(i);
    }
}

function changePlayer() {
    let currentPlayer = selectedPlayer;
    if ('player1' === selectedPlayer) {
        selectedPlayer = 'player2';
    } else {
        selectedPlayer = 'player1';
    }
    setTimeout(() => {
        desactivePlayer(document.getElementById(currentPlayer));
        activePlayer(document.getElementById(selectedPlayer));
    }, intervalTime);
}

function resetRound() {
    selectedCards.length = 0;
    selectedIndexes.length = 0;
}

function resetGame() {
    initializePlayers([document.getElementById('player1'), document.getElementById('player2')])
    if (null !== timerId) {
        stopTimer(timerId);
    }
    timerId = null;
    timer = 0;
    removeAllChildren('memory-cards');
    resetRound();
    player1Points = 0;
    player2Points = 0;
    selectedPlayer = 'player2';
    document.getElementById('modal').style.display = 'none';
    allCardIndexesRemaining.length = 0;
    memorizedCards = {};
}

function displayPlayersPoints() {
    document.getElementById('player1Points').textContent = player1Points;
    if (document.getElementById('player2Points')) {
        document.getElementById('player2Points').textContent = player2Points;
    }
}

function buildBoardGame(nbrColumns, nbrRows) {
    boardGame.style.gridTemplateColumns = `repeat(${nbrColumns}, 1fr)`;
    boardGame.style.gridTemplateRows = `repeat(${nbrRows}, 1fr)`;

    const symbols = getSelectedSymbols(nbrColumns * nbrRows);

    for (let i = 0; i < symbols.length; i++) {
        boardGame.append(createCard(symbols[i]));
    }
}

function getSelectedSymbols(nbrCards) {
    const symbols = [
        ["fas", "fa-yin-yang", "yinyang"],
        ["fas", "fa-yen-sign", "yensign"],
        ["fas", "fa-wine-glass", "wineglass"],
        ["fas", "fa-water", "water"],
        ["fas", "fa-volleyball-ball", "volleyball"],
        ["fas", "fa-user-secret", "usersecret"],
        ["fas", "fa-tshirt", "tshirt"],
        ["fas", "fa-sun", "sun"],
        ["fas", "fa-university", "university"],
        ["fas", "fa-umbrella", "umbrella"],
        ["fas", "fa-truck-pickup", "truckpickup"],
        ["fas", "fa-truck", "truck"],
        ["fas", "fa-tree", "tree"],
        ["fas", "fa-theater-masks", "theatermasks"],
        ["fas", "fa-venus", "venus"],
        ["fas", "fa-mars", "mars"],
        ["fas", "fa-mask", "mask"],
        ["fas", "fa-horse", "horse"],
    ];
    const array = [];
    const selectedSymbols = [];

    for (let i = 0; i < nbrCards/2; i++) {
        selectedSymbols.push(symbols[i]);
    }
    
    for (let i = 0; i < nbrCards; i++) {
        let value = selectedSymbols[getRandomInteger(0, selectedSymbols.length-1)];
        if (array.length > 0) {
            const occurences = countOccurrences(array);
            while (occurences[value] >= 2) {
                value = selectedSymbols[getRandomInteger(0, selectedSymbols.length-1)];
            }
        }
        array.push(value);
    }
    return array;
}

function createCard(symbol) {
    const div = document.createElement('div');
    div.style.setProperty('--secondary-bg-color', getComputedStyle(body).getPropertyValue(`--${localStorage.getItem('theme')}-secondary-bg-color`));
    div.dataset.symbol = symbol[2];

    const i = document.createElement('i');
    i.classList.add(symbol[0]);
    i.classList.add(symbol[1]);
    i.style.visibility = 'hidden';
    i.style.setProperty('--text-color', getComputedStyle(body).getPropertyValue(`--${localStorage.getItem('theme')}-text-color`));

    div.addEventListener('click', (e) => {
        if (('player-vs-computer' !== localStorage.getItem('mode-memory') || 'player2' !== selectedPlayer)) {
            selectCard(e.target);
        }
    });
    div.append(i);
    return div;
}

function selectCard(card) {
    let cardIndex = getIndexFromHtmlElement(boardGame, card);
    
    if (2 <= selectedCards.length || !allCardIndexesRemaining.includes(cardIndex)) {
        return;
    }

    if ('solo' === localStorage.getItem('mode-memory')) {
        if (null === timerId) {
            timerId = startTimer(document.getElementById('player2').children[1]);
        }
    }

    if ('player-vs-computer' === localStorage.getItem('mode-memory')) {
        let key = card.dataset.symbol;
        if (!memorizedCards[key]) {
            memorizedCards[key] = [cardIndex];
        } else {
            if (!memorizedCards[key].includes(cardIndex)) {
                memorizedCards[key].push(cardIndex);
            }
        }
    }

    card.style.transform = 'rotateY(180deg)';
    setTimeout(() => {
        card.children[0].style.visibility = 'visible';
    }, 100);
    selectedCards.push(card.dataset.symbol);
    selectedIndexes.push(cardIndex);
    
    if (2 === selectedCards.length) {
        checkPairOfCards();
    }
}

function checkPairOfCards() {
    if (selectedCards[0] !== selectedCards[1]) {
        hideCardsByIndex(selectedIndexes);

        if ('solo' !== localStorage.getItem('mode-memory')) {
            changePlayer();
        }
    } else {
        if ('player1' === selectedPlayer) {
            player1Points++;
        } else {
            player2Points++;
        }
        displayPlayersPoints();

        allCardIndexesRemaining = allCardIndexesRemaining.filter(index => !selectedIndexes.includes(index));

        if ('player-vs-computer' === localStorage.getItem('mode-memory')) {
            delete memorizedCards[selectedCards[0]];
        }

        if (boardGame.children.length/2 === player1Points + player2Points) {
            if ('solo' === localStorage.getItem('mode-memory')) {
                document.getElementById('player2').children[1].textContent = document.getElementById('player2').children[1].textContent;
                clearInterval(timerId);
            }
            setTimeout(() => {
                displayVictory();

            },1000);
        }
    }
    resetRound();

    if ('player-vs-computer' === localStorage.getItem('mode-memory') && 'player2' === selectedPlayer) {
        setTimeout(() => {
            getComputerCards();
        }, intervalTime);
    }
}

function getComputerCards() {
    let indexes = [];
    const minDoor = {
        easy: 1,
        normal: 2,
        hard: 3,
        very_hard: 4
    };

    if ('very_easy' !== localStorage.getItem('difficulty-memory')) {
        let randomNumber = getRandomInteger(1, 4);
        // console.log(minDoor[localStorage.getItem('difficulty-memory')] >= randomNumber)
        if (minDoor[localStorage.getItem('difficulty-memory')] >= randomNumber) {
            for (const key in memorizedCards) {
                if (memorizedCards[key].length === 2) {
                    indexes = memorizedCards[key];
                    // console.log(memorizedCards);
                }
            }
        }
        // console.log(indexes);
    } 
    if (0 === indexes.length) {
        let remainingIndexes = getUniqueRandomIntegers(2, 0, allCardIndexesRemaining.length-1);
        remainingIndexes.forEach(index => {
            indexes.push(allCardIndexesRemaining[index]);
        })
    }
    // console.log(indexes);

    indexes.forEach((index, i) => {
        setTimeout(() => {
            selectCard(boardGame.children[index]);
        }, (i+1) * 500);
    });
}

function hideCardsByIndex(indexes) {
    let index0 = indexes[0];
    let index1 = indexes[1];
    setTimeout(() => {
        boardGame.children[index0].style.transform = 'rotateY(0deg)';
        boardGame.children[index1].style.transform = 'rotateY(0deg)';
        setTimeout(() => {
            boardGame.children[index0].children[0].style.visibility = 'hidden';
            boardGame.children[index1].children[0].style.visibility = 'hidden';
        }, 100);
    }, intervalTime);
}

function displayVictory() {
    let result = '';

    if ('solo' === localStorage.getItem('mode-memory')) {
        result = 'Bravo vous avez trouvé toutes les paires !';
    } else {
        if (player2Points > player1Points) {
            result = `Victoire de ${player2.children[0].textContent} !`;
        } else if (player2Points === player1Points) {
            result = 'Égalité !';
        } else {
            result = 'Victoire de joueur 1';
        }
    }
    document.getElementById('modal').style.display = 'flex';
    document.getElementById('modal').addEventListener('click', () => {
        loadGameBoard();
    });
    document.querySelector('#modal>p').textContent = result;
}


// CODE
loadGameBoard();

window.addEventListener('btnGameClick', () => {
    loadGameBoard();
});

window.addEventListener('btnThemeClick', () => {
    initializePlayers([document.getElementById('player1'), document.getElementById('player2')])
    activePlayer(document.getElementById(selectedPlayer));
    [...document.querySelectorAll('#memory-cards>div')].forEach(card => {
        card.style.setProperty('--secondary-bg-color', getComputedStyle(body).getPropertyValue(`--${localStorage.getItem('theme')}-secondary-bg-color`));
        card.children[0].style.setProperty('--text-color', getComputedStyle(body).getPropertyValue(`--${localStorage.getItem('theme')}-text-color`));
    })
});