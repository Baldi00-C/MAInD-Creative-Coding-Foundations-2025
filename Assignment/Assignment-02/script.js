
const puzzleImageMap = {
    'facile.webp': 3,
    'medio.jpeg': 4,
    'difficile.jpg': 5
};


const avatarImageMap = {
    'Aldo': 'Aldo.jpg',
    'Giovanni': 'Giovanni.jpg',
    'Giacomo': 'Giacomo.jpg'
};


let currentPuzzleImage = 'facile.webp'; 
let currentSize = puzzleImageMap[currentPuzzleImage]; 
let currentCharacter = 'Aldo'; 
let puzzleArray = []; 
let selectedTileIndex = null; 
let highlightedTileIndex = 0; 
let moveCount = 0; 
let isGameActive = false; 

const container = document.getElementById('puzzle-container');
const messageDisplay = document.getElementById('message');
const referenceImage = document.getElementById('reference-image'); 
const moveCountDisplay = document.getElementById('move-count'); 
const winSound = document.getElementById('win-sound'); 
const displayCharacterSpan = document.getElementById('display-character'); 



function setTileStyle(tileElement, currentPositionIndex, size, imageUrl) {
    const pieceIndex = puzzleArray[currentPositionIndex]; 
    const containerSize = container.clientWidth; 
    const tileSize = containerSize / size; 

    const col = pieceIndex % size;
    const row = Math.floor(pieceIndex / size);
    
    tileElement.style.backgroundImage = `url(assets/${imageUrl})`;
    tileElement.style.backgroundSize = `${containerSize}px ${containerSize}px`;

    const backgroundX = (col * tileSize) * -1;
    const backgroundY = (row * tileSize) * -1;

    tileElement.style.backgroundPosition = `${backgroundX}px ${backgroundY}px`;
    
    tileElement.style.width = `${tileSize}px`;
    tileElement.style.height = `${tileSize}px`;
    
    tileElement.className = 'tile'; 

    if (currentPositionIndex === highlightedTileIndex) {
        tileElement.setAttribute('tabindex', '0'); 
        tileElement.classList.add('highlighted'); 
        if (document.activeElement !== tileElement) {
             tileElement.focus();
        }
    } else {
        tileElement.removeAttribute('tabindex');
        tileElement.classList.remove('highlighted');
    }

    if (selectedTileIndex === currentPositionIndex) {
        tileElement.classList.add('selected');
    }
}

function renderPuzzle() {
    container.innerHTML = ''; 
    messageDisplay.classList.add('hidden'); 
    moveCountDisplay.textContent = moveCount;
    displayCharacterSpan.textContent = currentCharacter;

    container.style.gridTemplateColumns = `repeat(${currentSize}, 1fr)`;
    container.style.gridTemplateRows = `repeat(${currentSize}, 1fr)`;

    for (let i = 0; i < puzzleArray.length; i++) {
        const tile = document.createElement('div');
        tile.id = `tile-${i}`;
        tile.dataset.index = i; 
        
        setTileStyle(tile, i, currentSize, currentPuzzleImage);
        
        tile.addEventListener('click', handleTileClick);
        
        container.appendChild(tile);
    }
}

function shuffleArray() {
    for (let i = puzzleArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [puzzleArray[i], puzzleArray[j]] = [puzzleArray[j], puzzleArray[i]];
    }
}

function swapTiles(index1, index2) {
    if (index1 === index2 || !isGameActive) return;

    moveCount++;
    moveCountDisplay.textContent = moveCount;

    [puzzleArray[index1], puzzleArray[index2]] = [puzzleArray[index2], puzzleArray[index1]];

    const selectedElement = document.getElementById(`tile-${selectedTileIndex}`);
    if (selectedElement) {
        selectedElement.classList.remove('selected');
    }
    selectedTileIndex = null;
    
    renderPuzzle();
    
    checkWin(); 
}

function checkWin() {
    const isSolved = puzzleArray.every((pieceIndex, positionIndex) => 
        pieceIndex === positionIndex
    );

    if (isSolved) {
        isGameActive = false; 
        messageDisplay.textContent = `PUZZLE SOLVED! Great job, ${currentCharacter}!`; 
        messageDisplay.classList.remove('hidden');
        winSound.play(); 
        
        if (selectedTileIndex !== null) {
            document.getElementById(`tile-${selectedTileIndex}`).classList.remove('selected');
        }
        document.getElementById(`tile-${highlightedTileIndex}`).classList.remove('highlighted');
        selectedTileIndex = null;
    }
}

function handleTileClick(event) {
    if (!isGameActive) return;

    const clickedElement = event.target;
    const clickedIndex = parseInt(clickedElement.dataset.index); 
    
    highlightedTileIndex = clickedIndex;

    if (selectedTileIndex === null) {
        selectedTileIndex = clickedIndex;
        clickedElement.classList.add('selected');
    } else if (selectedTileIndex === clickedIndex) {
        clickedElement.classList.remove('selected');
        selectedTileIndex = null;
    } else {
        swapTiles(selectedTileIndex, clickedIndex);
    }
    renderPuzzle(); 
}

function initializePuzzle(imageUrl, size) {
    currentPuzzleImage = imageUrl;
    currentSize = size;
    
    const totalTiles = size * size;
    
    puzzleArray = Array.from({length: totalTiles}, (_, i) => i);
    moveCount = 0; 
}

function startGame(imageFileName, size) {
    if (imageFileName && size) {
        initializePuzzle(imageFileName, size);
    } else {
        initializePuzzle(currentPuzzleImage, currentSize); 
    }
    
    shuffleArray(); 
    selectedTileIndex = null; 
    highlightedTileIndex = 0; 
    isGameActive = true; 


    referenceImage.src = `assets/${currentPuzzleImage}`; 
    

    document.querySelectorAll('.control-btn').forEach(btn => {
        const match = btn.getAttribute('onclick').match(/'([^']+)'/);
        const btnImage = match ? match[1] : '';
        const btnSize = parseInt(btn.dataset.size);
        
        const isActive = btnImage === currentPuzzleImage && btnSize === currentSize;
        btn.classList.toggle('active', isActive);
    });


    document.querySelectorAll('.char-select-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.char === currentCharacter);
    });

    renderPuzzle();
}

function restartGame() {
    if (puzzleArray.length > 0) {
        startGame(currentPuzzleImage, currentSize); 
    }
}


function selectCharacter(characterName) {
    currentCharacter = characterName;
    startGame(); 
}



document.addEventListener('keydown', handleKeyPress);

function handleKeyPress(event) {
    if (!isGameActive) return;

    let newHighlightedIndex = highlightedTileIndex;
    const size = currentSize;
    const totalTiles = size * size;

    switch (event.key) {
        case 'ArrowUp':
        case 'w':
            newHighlightedIndex -= size;
            break;
        case 'ArrowDown':
        case 's':
            newHighlightedIndex += size;
            break;
        case 'ArrowLeft':
        case 'a':
            if ((highlightedTileIndex % size) !== 0) { 
                newHighlightedIndex -= 1;
            }
            break;
        case 'ArrowRight':
        case 'd':
            if ((highlightedTileIndex % size) !== (size - 1)) {
                newHighlightedIndex += 1;
            }
            break;
        case ' ': 
        case 'Enter':
            event.preventDefault(); 
            document.getElementById(`tile-${highlightedTileIndex}`).click();
            return; 
        case 'c': 
            if (selectedTileIndex !== null && selectedTileIndex !== highlightedTileIndex) {
                swapTiles(selectedTileIndex, highlightedTileIndex);
            }
            return;
        default:
            return;
    }

    if (newHighlightedIndex >= 0 && newHighlightedIndex < totalTiles) {
        highlightedTileIndex = newHighlightedIndex;
        renderPuzzle();
    }
}


document.addEventListener('DOMContentLoaded', () => {

    selectCharacter('Aldo'); 
    startGame('facile.webp', 3);
});

window.addEventListener('resize', renderPuzzle);