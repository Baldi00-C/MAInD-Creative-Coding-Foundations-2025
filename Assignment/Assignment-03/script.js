

const UNSPLASH_ACCESS_KEY = "7GkTBzcQCb_QPY_VenseFX7fOdNybKnoKNJK_BcZCoM";


// Gif

const victoryGifs = [
    'Assets/Basta.gif',
    'Assets/Bravo.gif',
    'Assets/Brava.gif',
    'Assets/Bastardo.gif',
    'Assets/Cadrega.gif',
    'Assets/Kafka.gif',
    'Assets/Situazione.gif'
];


//     Audio

const victorySounds = [
    'Assets/Audio-1.mp3',
    'Assets/Audio-2.mp3',
    'Assets/Audio-3.mp3',
    'Assets/Audio-4.mp3',
    'Assets/Audio-5.mp3'
];


// Game state
let currentPuzzleImage = null; 
let currentSize = 3;
let currentCharacter = 'Aldo';
let puzzleArray = [];
let selectedTileIndex = null;
let highlightedTileIndex = 0;
let moveCount = 0;
let isGameActive = false;

// DOM Elements
const container = document.getElementById('puzzle-container');
const messageDisplay = document.getElementById('message');
const victoryImgPlaceholder = document.getElementById('victory-img-placeholder');
const victoryText = document.getElementById('victory-text');
const referenceImage = document.getElementById('reference-image');
const moveCountDisplay = document.getElementById('move-count');
const winSoundElement = document.getElementById('win-sound'); 
const displayCharacterSpan = document.getElementById('display-character');

/* --- FETCH --- */
async function fetchRandomUnsplashPhoto(query = '') {
    if (!UNSPLASH_ACCESS_KEY) return null;
    const url = new URL('https://api.unsplash.com/photos/random');
    url.searchParams.set('client_id', UNSPLASH_ACCESS_KEY);
    url.searchParams.set('orientation', 'squarish');
    url.searchParams.set('count', '1'); 
    url.searchParams.set('query', query || 'abstract'); 
    try {
        const res = await fetch(url.toString());
        if (!res.ok) return null;
        const data = await res.json();
        const item = Array.isArray(data) ? data[0] : data; 
        if (!item || !item.urls) return null;
        return { url: item.urls.regular, attribution: item.user ? item.user.name : '' };
    } catch (err) { return null; }
}

async function fetchGallery(query = '') {
    if (!UNSPLASH_ACCESS_KEY) return [];
    const url = new URL('https://api.unsplash.com/search/photos');
    url.searchParams.set('client_id', UNSPLASH_ACCESS_KEY);
    url.searchParams.set('page', '1');
    url.searchParams.set('per_page', '12');
    url.searchParams.set('orientation', 'squarish');
    url.searchParams.set('query', query || 'minimal'); 
    try {
        const res = await fetch(url.toString());
        if (!res.ok) return [];
        const data = await res.json();
        return data.results.map(item => ({ url: item.urls.thumb, full: item.urls.regular }));
    } catch (err) { return []; }
}

/* --- PUZZLE LOGIC --- */
function setTileStyle(tile, index, size, imgUrl) {
    const pieceIndex = puzzleArray[index];
    const containerSize = container.clientWidth;
    const tileSize = containerSize / size;
    const col = pieceIndex % size;
    const row = Math.floor(pieceIndex / size);

    tile.style.backgroundImage = `url(${imgUrl})`;
    tile.style.backgroundSize = `${containerSize}px ${containerSize}px`;
    tile.style.backgroundPosition = `${-col * tileSize}px ${-row * tileSize}px`;
    tile.className = 'tile';
    
    if (index === highlightedTileIndex) tile.classList.add('highlighted');
    if (index === selectedTileIndex) tile.classList.add('selected');
    tile.dataset.index = index;
}

function renderPuzzle() {
    container.innerHTML = '';
    moveCountDisplay.textContent = moveCount;
    displayCharacterSpan.textContent = currentCharacter;

    container.style.gridTemplateColumns = `repeat(${currentSize}, 1fr)`;
    container.style.gridTemplateRows = `repeat(${currentSize}, 1fr)`;

    if (!currentPuzzleImage) {
        container.innerHTML = `<div style="text-align:center; padding:20px;">Loading Image...</div>`;
        return;
    }

    puzzleArray.forEach((_, i) => {
        const tile = document.createElement('div');
        setTileStyle(tile, i, currentSize, currentPuzzleImage);
        tile.addEventListener('click', handleTileClick);
        container.appendChild(tile);
    });
}

function swapTiles(i1, i2) {
    if (i1 === i2 || !isGameActive) return;
    moveCount++;
    [puzzleArray[i1], puzzleArray[i2]] = [puzzleArray[i2], puzzleArray[i1]];
    selectedTileIndex = null;
    renderPuzzle();
    checkWin();
}

function checkWin() {
    const isSolved = puzzleArray.every((val, index) => val === index);
    if (isSolved) {
        isGameActive = false;
        
        // GIF Random
        const randomGif = victoryGifs[Math.floor(Math.random() * victoryGifs.length)];
        
        // AUDIO Random
        const randomSound = victorySounds[Math.floor(Math.random() * victorySounds.length)];

        //  Aggiorna DOM
        if (victoryText) victoryText.innerHTML = `Great job ${currentCharacter}!<br>Total moves: ${moveCount}`;
        
        if (victoryImgPlaceholder) {
            victoryImgPlaceholder.src = randomGif;
            victoryImgPlaceholder.style.display = 'block';
        }

        // Riproduci Audio
        if (winSoundElement) {
            winSoundElement.src = randomSound;
            // Catch error in case of browser interaction policies
            winSoundElement.play().catch(e => console.log("Audio play blocked", e));
        }

        // Mostra Messaggio
        if (messageDisplay) {
            messageDisplay.classList.remove('hidden');
        }

        document.querySelectorAll('.tile').forEach(tile => {
            tile.classList.remove('selected', 'highlighted');
            tile.removeAttribute('tabindex');
        });
        selectedTileIndex = null;
    }
}

function handleTileClick(e) {
    if (!isGameActive) return;
    const index = parseInt(e.target.dataset.index);
    highlightedTileIndex = index;

    if (selectedTileIndex === null) {
        selectedTileIndex = index;
    } else if (selectedTileIndex === index) {
        selectedTileIndex = null;
    } else {
        swapTiles(selectedTileIndex, index);
    }
    renderPuzzle();
}

function initializePuzzle(url, size) {
    currentPuzzleImage = url;
    currentSize = size;
    puzzleArray = Array.from({ length: size * size }, (_, i) => i);
    moveCount = 0;
}

async function startGame(url = null, size = null) {
    // RESET: Nascondi messaggio e ferma audio se attivo
    if (messageDisplay) messageDisplay.classList.add('hidden');
    if (winSoundElement) { winSoundElement.pause(); winSoundElement.currentTime = 0; }

    size = size || currentSize;
    let imgUrl = url;

    if (!imgUrl) {
        const q = document.getElementById('unsplash-query') ? document.getElementById('unsplash-query').value : '';
        const data = await fetchRandomUnsplashPhoto(q);
        imgUrl = data ? data.url : 'https://placehold.co/500x500?text=Error';
        if (data && referenceImage) referenceImage.src = data.url;
    } else {
        if (referenceImage) referenceImage.src = imgUrl;
    }

    const tmp = new Image();
    tmp.onload = () => {
        initializePuzzle(imgUrl, size);
        // Shuffle semplice
        for(let i = puzzleArray.length -1; i > 0; i--){
            const j = Math.floor(Math.random() * (i+1));
            [puzzleArray[i], puzzleArray[j]] = [puzzleArray[j], puzzleArray[i]];
        }
        isGameActive = true;
        selectedTileIndex = null;
        renderPuzzle();
    };
    tmp.src = imgUrl;

    // Aggiorna UI Bottoni
    document.querySelectorAll('.control-btn').forEach(b => b.classList.toggle('active', parseInt(b.dataset.size) === size));
}

function restartGame() { if (currentPuzzleImage) startGame(currentPuzzleImage, currentSize); }

function selectCharacter(char) {
    currentCharacter = char;
    document.querySelectorAll('.char-select-btn').forEach(b => b.classList.toggle('active', b.dataset.char === char));
    if (isGameActive && currentPuzzleImage) startGame(currentPuzzleImage, currentSize);
    displayCharacterSpan.textContent = char;
}

/* LISTENERS & INIT */
document.addEventListener('DOMContentLoaded', () => {
    // Navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.querySelectorAll('.tab-section').forEach(s => s.classList.remove('active'));
            document.getElementById(btn.dataset.target).classList.add('active');
            if (btn.dataset.target === 'play-section' && currentPuzzleImage) renderPuzzle();
        });
    });

    // Gallery Load
    document.getElementById('load-gallery').addEventListener('click', async () => {
        const grid = document.getElementById('gallery-grid');
        grid.innerHTML = 'Loading...';
        const q = document.getElementById('gallery-query').value;
        const items = await fetchGallery(q);
        grid.innerHTML = '';
        items.forEach(it => {
            const img = document.createElement('img');
            img.src = it.url;
            img.onclick = () => {
                startGame(it.full, 4);
                document.querySelector('.nav-btn[data-target="play-section"]').click();
            };
            grid.appendChild(img);
        });
    });


    document.getElementById('new-unsplash').addEventListener('click', () => startGame(null, currentSize));

    // Keyboard
    document.addEventListener('keydown', (e) => {
        if (!isGameActive || ['INPUT','TEXTAREA'].includes(document.activeElement.tagName)) return;
        const s = currentSize;
        let idx = highlightedTileIndex;
        switch(e.key.toLowerCase()) {
            case 'w': case 'arrowup': idx = (idx >= s) ? idx - s : idx; break;
            case 's': case 'arrowdown': idx = (idx < s*(s-1)) ? idx + s : idx; break;
            case 'a': case 'arrowleft': idx = (idx % s !== 0) ? idx - 1 : idx; break;
            case 'd': case 'arrowright': idx = (idx % s !== s-1) ? idx + 1 : idx; break;
            case ' ': case 'enter': 
                const tile = document.querySelector(`.tile[data-index="${idx}"]`);
                if(tile) tile.click();
                break;
            case 'c':
                 if (selectedTileIndex === null) { selectedTileIndex = highlightedTileIndex; renderPuzzle(); }
                 else swapTiles(selectedTileIndex, highlightedTileIndex);
                 break;
        }
        if (idx !== highlightedTileIndex) { highlightedTileIndex = idx; renderPuzzle(); }
    });

    // Start
    startGame(null, 3);
});

window.addEventListener('resize', () => { if(isGameActive) renderPuzzle(); });