
let currentImage = 'facile.jpg'; 
let currentSize = 3; 
let puzzleArray = []; 
let selectedTileIndex = null; 

const container = document.getElementById('puzzle-container');
const messageDisplay = document.getElementById('message');
const referenceImage = document.getElementById('reference-image'); 
const PUZZLE_SIZE_PX = 450; 





function setTileStyle(tileElement, currentPositionIndex, size, imageUrl) {
    
    const pieceIndex = puzzleArray[currentPositionIndex]; 
    
    const tileSize = PUZZLE_SIZE_PX / size; 

    const col = pieceIndex % size;
    const row = Math.floor(pieceIndex / size);
    
    
    tileElement.style.backgroundImage = `url(assets/${imageUrl})`;
    tileElement.style.backgroundSize = `${PUZZLE_SIZE_PX}px ${PUZZLE_SIZE_PX}px`;

    
    const backgroundX = (col * tileSize) * -1;
    const backgroundY = (row * tileSize) * -1;

    tileElement.style.backgroundPosition = `${backgroundX}px ${backgroundY}px`;
    
    
    tileElement.style.width = `${tileSize}px`;
    tileElement.style.height = `${tileSize}px`;
    
    tileElement.className = 'tile'; // Reset classes
}



function renderPuzzle() {
    container.innerHTML = ''; 
    messageDisplay.classList.add('hidden'); 

    
    container.style.gridTemplateColumns = `repeat(${currentSize}, 1fr)`;
    container.style.gridTemplateRows = `repeat(${currentSize}, 1fr)`;

    for (let i = 0; i < puzzleArray.length; i++) {
        const tile = document.createElement('div');
        tile.id = `tile-${i}`;
        tile.dataset.index = i; 
        
        setTileStyle(tile, i, currentSize, currentImage);
        
        tile.addEventListener('click', handleTileClick);
        
        container.appendChild(tile);
    }
}



function shuffleArray() {
    for (let i = puzzleArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        // Simple swap
        [puzzleArray[i], puzzleArray[j]] = [puzzleArray[j], puzzleArray[i]];
    }
}



function swapTiles(index1, index2) {
    
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
        messageDisplay.textContent = 'PUZZLE SOLVED!';
        messageDisplay.classList.remove('hidden');
    }
}



function handleTileClick(event) {
    
    if (!messageDisplay.classList.contains('hidden')) return;

    const clickedElement = event.target;
    const clickedIndex = parseInt(clickedElement.dataset.index); 

    if (selectedTileIndex === null) {
       
        selectedTileIndex = clickedIndex;
        clickedElement.classList.add('selected');
    } else if (selectedTileIndex === clickedIndex) {
        
        clickedElement.classList.remove('selected');
        selectedTileIndex = null;
    } else {
       
        swapTiles(selectedTileIndex, clickedIndex);
    }
}




function initializePuzzle(size, imageUrl) {
    currentSize = size;
    currentImage = imageUrl;
    
    const totalTiles = size * size;
    
   
    puzzleArray = Array.from({length: totalTiles}, (_, i) => i);
}


function startGame(imageFileName, size) {
    initializePuzzle(size, imageFileName);
    shuffleArray(); 
    selectedTileIndex = null; 

  
    referenceImage.src = `assets/${imageFileName}`; 

    renderPuzzle();
    console.log(`Game started: ${imageFileName} (${size}x${size})`);
}


function restartGame() {
    
    if (puzzleArray.length > 0) {
        shuffleArray(); 
        selectedTileIndex = null; 
        renderPuzzle();
        console.log("Game restarted with the current settings.");
    }
}



startGame(currentImage, currentSize);