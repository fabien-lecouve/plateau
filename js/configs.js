// VARIABLES
const body = document.body;
const themes = [...document.querySelectorAll('.themes button')];
const polices = [...document.querySelectorAll('.polices button')];
const modes = document.querySelector('.modes') ? [...document.querySelectorAll('.modes button')] : null;
const difficulties = document.querySelector('.difficulties') ? [...document.querySelectorAll('.difficulties button')] : null;
const titles = [...document.getElementsByTagName('h1'), ...document.getElementsByTagName('h2')];
const texts = [...document.getElementsByTagName('h3'), ...document.getElementsByTagName('p'), ...document.getElementsByTagName('i'), ...themes, ...polices, ...document.querySelectorAll('.modes button'), ...document.querySelectorAll('.difficulties button')];
const borders = [...document.querySelectorAll('.configs__visual>div'), ...document.querySelectorAll('.configs__game>div'), ...document.querySelectorAll('.home>li')];
if (null !== document.getElementById('game')) {
    borders.push(document.getElementById('game'));
}
let selectedTheme = localStorage.getItem('theme') ?? document.getElementById('dark').id;
let selectedPolice = localStorage.getItem('police') ?? document.getElementById('open').id;
let selectedMode = document.getElementById('solo') ? document.getElementById('solo').id : null;
let selectedDifficulty = document.getElementById('normal') ? document.getElementById('normal').id : null;

const gameName = document.getElementById('game') ? document.getElementById('game').dataset.name : null;


// FUNCTIONS
function selectTheme(theme) {
    selectedTheme = theme;
    loadConfiguration(selectedTheme, selectedPolice, selectedMode, selectedDifficulty);
}

function selectPolice(police) {
    selectedPolice = police;
    loadConfiguration(selectedTheme, selectedPolice, selectedMode, selectedDifficulty);
}

function selectMode(mode) {
    selectedMode = mode;
    loadConfiguration(selectedTheme, selectedPolice, selectedMode, selectedDifficulty);
}

function selectDifficulty(difficulty) {
    selectedDifficulty = difficulty;
    loadConfiguration(selectedTheme, selectedPolice, selectedMode, selectedDifficulty);
}

function loadConfiguration(selectedTheme, selectedPolice, selectedMode, selectedDifficulty) {

    // BACKGROUNDS
    body.style.setProperty('--primary-bg-color', getComputedStyle(body).getPropertyValue(`--${selectedTheme}-primary-bg-color`));
    // backgrounds.forEach(background => {
    //     background.style.setProperty('--body-bg-color', getComputedStyle(background).getPropertyValue(`--${selectedTheme}-tertiary-color`));
    // });

    // COLORS && POLICES
    titles.forEach(title => {
        title.style.setProperty('--title-color', getComputedStyle(body).getPropertyValue(`--${selectedTheme}-title-color`));
        title.style.setProperty('--font-family', getComputedStyle(body).getPropertyValue(`--font-family-${selectedPolice}`));
    });
    texts.forEach(text => {
        text.style.setProperty('--text-color', getComputedStyle(body).getPropertyValue(`--${selectedTheme}-text-color`));
        text.style.setProperty('--font-family', getComputedStyle(body).getPropertyValue(`--font-family-${selectedPolice}`));
    });

    // BORDERS
    borders.forEach(border => {
        border.style.setProperty('--border-color', getComputedStyle(body).getPropertyValue(`--${selectedTheme}-border-color`));
    });

    // ACTIVES
    selectCurrentWithThemeColor(themes, selectedTheme, selectedTheme);
    selectCurrentWithThemeColor(polices, selectedPolice, selectedTheme);
    if (null !== modes) {
        selectCurrentWithThemeColor(modes, selectedMode, selectedTheme);
        localStorage.setItem(`mode-${gameName}`, selectedMode);
    }
    if (null !== difficulties) {
        selectCurrentWithThemeColor(difficulties, selectedDifficulty, selectedTheme);
        localStorage.setItem(`difficulty-${gameName}`, selectedDifficulty);
    }

    localStorage.setItem('theme', selectedTheme);
    localStorage.setItem('police', selectedPolice);
}

function selectCurrentWithThemeColor(items, current, theme) {
    items.forEach(item => {
        if (item.id === current) {
            item.style.setProperty('--text-color', getComputedStyle(item).getPropertyValue(`--${theme}-primary-bg-color`));
            if (item.children[0]) {
                item.children[0].style.setProperty('--text-color', getComputedStyle(item).getPropertyValue(`--${theme}-primary-bg-color`));
            }
            item.style.setProperty('--secondary-bg-color', getComputedStyle(item).getPropertyValue(`--${theme}-text-color`));
        } else {
            item.style.setProperty('--text-color', getComputedStyle(item).getPropertyValue(`--${theme}-text-color`));
            item.style.setProperty('--secondary-bg-color', '');
        }
    });
}

// CODE
loadConfiguration(selectedTheme, selectedPolice, selectedMode, selectedDifficulty);
themes.forEach(btn => {
    btn.addEventListener('click', (e) => {
        selectTheme(e.target.id);
        let event = new CustomEvent('btnThemeClick', {detail: {value: e.target.id}});
        window.dispatchEvent(event);
    });
});

polices.forEach(btn => {
    btn.addEventListener('click', (e) => {
        selectPolice(e.target.id);
        let event = new CustomEvent('btnThemeClick');
        window.dispatchEvent(event);
    });
});

if (null !== modes) {
    modes.forEach(btn => {
        btn.addEventListener('click', (e) => {
            selectMode(e.target.closest('button').id);
            let event = new CustomEvent('btnGameClick', {detail: {value: e.target.id}});
            window.dispatchEvent(event);
        })
    });
}

if (null !== difficulties) {
    difficulties.forEach(btn => {
        btn.addEventListener('click', (e) => {
            selectDifficulty(e.target.id)
            let event = new CustomEvent('btnGameClick', {detail: {value: e.target.id}});
            window.dispatchEvent(event);
        })
    });
}