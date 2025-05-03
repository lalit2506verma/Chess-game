// Assigning ID to every square
const filesName = ["a", "b", "c", "d", "e", "f", "g", "h"];
let fileCounter = 0;

// Global array to track highlighted move
let highlightMoves = [];

let clickedElements = [];
let selectedPiece = null;
let selectedSquare = null;

let currentTurn = 'white';

const turnIndicator = document.getElementById('turn-indicator');

const squares = document.querySelectorAll('.files');
const arrayOfFiles = Array.from(squares);

arrayOfFiles.forEach(file => {

    //counter
    let counter = 8;

    Array.from(file.children).forEach(item => {

        item.setAttribute("id", filesName[fileCounter] + counter)
        counter--;
    })

    fileCounter++;

})

const allSquares = document.querySelectorAll('.square');

// Handle clicks
Array.from(allSquares).forEach(square => {

    square.addEventListener("click", (e) => {

        let clickedElement = e.target;
        //console.log(clickedElement);

        const parentSquare = clickedElement.closest('.square');

        // If clicking on empty square or the highlight circle
        if (clickedElement.tagName === 'DIV' && clickedElement.classList.contains('highlighted-circle')) {
            clickedElement = clickedElement.querySelector('img') || clickedElement;
        }

        if (clickedElement && clickedElement.tagName === 'IMG') {
            console.log('You clicked:', clickedElement.dataset.color, clickedElement.dataset.piece);

            const color = clickedElement.dataset.color;

            // blocking clicks if it not color turn
            if (color !== currentTurn) {
                console.log(`It's ${currentTurn}'s turn`);
                return;
            }

            const pieceType = clickedElement.dataset.piece;
            const currPosition = parentSquare.getAttribute('id');

            selectedPiece = clickedElement;
            selectedSquare = parentSquare;

            clearHighlights();
            removeHighlightedMove();

            // Highlight selected square
            highlightSquare(clickedElement);

            // Separating black and white color
            if (color === 'black') {
                // Handle Black pieces
                switch (pieceType) {

                    case 'pawn':
                        highlightPawnMoves(currPosition, color);
                        break;

                    case 'rook':
                        highlightRookMoves(currPosition, color);
                        break;

                    case 'bishop':
                        highlightBishopMoves(currPosition, color);
                        break;

                    case 'knight':
                        highlightKnightMoves(currPosition, color);
                        break;

                    case 'queen':
                        highlightQueenMoves(currPosition, color);
                        break;

                    case 'king':
                        highlightKingMoves(currPosition, color);

                    default:
                        break;
                }
            }
            else {
                // white
                switch (pieceType) {

                    case 'pawn':
                        highlightPawnMoves(currPosition, color);
                        break;

                    case 'rook':
                        highlightRookMoves(currPosition, color);
                        break;

                    case 'bishop':
                        highlightBishopMoves(currPosition, color);
                        break;

                    case 'knight':
                        highlightKnightMoves(currPosition, color);
                        break;

                    case 'queen':
                        highlightQueenMoves(currPosition, color);
                        break;

                    case 'king':
                        highlightKingMoves(currPosition, color);

                    default:
                        break;
                }
            }
        }
    });
});

function highlightSquare(clickedElement) {
    clickedElement.classList.add('highlighted-square');
    clickedElements.push(clickedElement);
}

// Reset another selected sqaure
function clearHighlights() {

    clickedElements.forEach(square => {
        square.classList.remove('highlighted-square');

        //remove event listner
        square.removeEventListener('click', onHighlightedSquareClick);
    });
    clickedElements = [];

}

// Highlighting next Possible Moves
function highlightMove(position) {

    const square = document.querySelector("#" + position); // selecting  by ID
    if (square) {
        const circle = document.createElement('div');
        circle.classList.add('highlighted-circle');
        square.appendChild(circle);
        highlightMoves.push(square);

        // Add event Listner on each highlighted Moves
        square.addEventListener('click', onHighlightedSquareClick);
    }
}

// Remove existing Highlighted move
function removeHighlightedMove() {

    highlightMoves.forEach(square => {
        const child = square.querySelector('.highlighted-circle');
        child.remove();

        square.removeEventListener('click', onHighlightedSquareClick);
    })

    highlightMoves = [];
}

function onHighlightedSquareClick(e) {
    movePiece(selectedPiece, selectedSquare, e.currentTarget);

    // After moving, clean up everything
    clearHighlights();
    selectedPiece = null;
    selectedSquare = null;

    // changing the turn once movement happen
    currentTurn = currentTurn === 'white' ? 'black' : 'white';
    updateTurnUI();
}

// UPDATE UI COMPONENT FOR TURN
function updateTurnUI() {
    turnIndicator.textContent = currentTurn.charAt(0).toUpperCase() + currentTurn.slice(1) + "'s Turn";

    // remove both classes first
    turnIndicator.classList.remove('white', 'black');

    //add classlist
    turnIndicator.classList.add(currentTurn);

}

// ------------------------ Piece Moves function ----------------------->

// PAWN MOVE    
function highlightPawnMoves(pos, color) {

    const file = pos[0];
    const rank = parseInt(pos[1]);

    let nextRank = color === 'white' ? rank + 1 : rank - 1;
    let doubleNextRank = color === 'white' ? rank + 2 : rank - 2;

    highlightMove(file + nextRank);

    // Allow double move only if on starting position
    if (color === 'white' && rank === 2 || color === 'black' && rank === 7) {
        highlightMove(file + doubleNextRank);
    }
}

// ROOK MOVE
function highlightRookMoves(pos, color) { // pos - a8, color: black

    const file = pos[0];
    const rank = parseInt(pos[1]);

    const fileIdx = filesName.indexOf(file);

    const directions = [
        [0, 1],   // top
        [0, -1],  // down
        [1, 0],   // right
        [-1, 0]   // left
    ]

    directions.forEach(([fileStep, rankStep]) => {

        let newFileIdx = fileIdx + fileStep;
        let newRankIdx = rank + rankStep;

        while (newFileIdx >= 0 && newFileIdx < 8 && newRankIdx >= 1 && newRankIdx <= 8) {

            const squareID = filesName[newFileIdx] + newRankIdx;
            const sqaure = document.getElementById(squareID);
            const occupant = sqaure.querySelector('img');

            if (!occupant) {
                highlightMove(squareID);
            }
            else {
                if (occupant.dataset.color !== color) {
                    highlightMove(squareID); // highlight opponent
                }
                break;
            }

            newFileIdx += fileStep;
            newRankIdx += rankStep;
        }
    });

}

function highlightBishopMoves(pos, color) {

    const file = pos[0];
    const rank = parseInt(pos[1]);

    let fileIdx = filesName.indexOf(file);

    const directions = [
        [1, 1],    // up-right
        [-1, 1],   // up-left
        [1, -1],   // down-right
        [-1, -1],  // down-left
    ];

    directions.forEach(([fileStep, rankStep]) => {
        let newFileIdx = fileIdx + fileStep;
        let newRankIdx = rank + rankStep;

        while (newFileIdx >= 0 && newFileIdx < 8 && newRankIdx >= 1 && newRankIdx <= 8) {
            const squareID = filesName[newFileIdx] + newRankIdx;
            const sqaure = document.getElementById(squareID);
            const occupant = sqaure.querySelector('img');

            if (!occupant) {
                highlightMove(squareID);
            }
            else {
                if (occupant.dataset.color !== color) {
                    highlightMove(squareID);
                }
                break; // stop at first piece
            }

            newFileIdx += fileStep;
            newRankIdx += rankStep;
        }
    })
}

function highlightKnightMoves(pos, color) {

    const file = pos[0];
    const rank = pos[1];

    const fileIdx = filesName.indexOf(file);

    const moveOffsets = [
        [1, 2],
        [2, 1],
        [-1, 2],
        [1, -2],
        [-2, 1],
        [-2, -1],
        [-1, -2],
        [2, -1]
    ]

    moveOffsets.forEach(offset => {

        const newFileIdx = parseInt(fileIdx) + offset[0];
        const newRankIdx = parseInt(rank) + offset[1];

        if (newFileIdx >= 0 && newFileIdx < 8 && newRankIdx >= 1 && newRankIdx <= 8) {
            const newPosition = filesName[newFileIdx] + newRankIdx;

            const targetSquare = document.getElementById(newPosition);
            const occupant = targetSquare.querySelector('img');

            if (!occupant || occupant.dataset.color !== color) {
                highlightMove(newPosition);
            }
        }
    });
}

// QUEEN MOVEMENT
function highlightQueenMoves(pos, color) {
    // Queen can move both as rook and bishop
    highlightRookMoves(pos, color);
    highlightBishopMoves(pos, color);
}

// KING MOVEMENT
function highlightKingMoves(pos, color) {

    const file = pos[0];
    const rank = parseInt(pos[1]);

    const fileIdx = filesName.indexOf(file);

    const directions = [
        [0, 1],   // up
        [0, -1],  // down
        [1, 0],   // right
        [-1, 0],  // left
        [1, 1],   // up-right
        [1, -1],  // down-right
        [-1, 1],  // up-left
        [-1, -1], // down-left
    ]

    directions.forEach(([dx, dy]) => {
        let newFileIdx = fileIdx + dx;
        let newRankIdx = rank + dy;

        if (newFileIdx >= 0 && newFileIdx < 8 && newRankIdx >= 1 && newRankIdx <= 8) {
            const squareID = filesName[newFileIdx] + newRankIdx;
            const square = document.getElementById(squareID);

            if (square) {
                let occupant = square.querySelector('img');
                if (!occupant || occupant.dataset.color !== color) {
                    highlightMove(squareID);
                }
            }
        }
    });
}

// Move piece
function movePiece(piece, fromSquare, toSquare) {

    // remove the piece img from parent element
    fromSquare.removeChild(piece);

    // add element to destination position
    toSquare.appendChild(piece);
    removeHighlightedMove();
}