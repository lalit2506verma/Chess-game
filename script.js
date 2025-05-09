// Assigning ID to every square
const filesName = ["a", "b", "c", "d", "e", "f", "g", "h"];
let fileCounter = 0;

// Global array to track highlighted move
let highlightMoves = [];

let clickedElements = [];
let selectedPiece = null;
let selectedSquare = null;

let whiteKingPosition = "d1";
let blackKingPosition = "e8";

let currentTurn = 'white';

let moves = [];

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

            // Handle Black pieces
            switch (pieceType) {

                case 'pawn':
                    moves = getlegalpawnMoves(currPosition, color);
                    break;

                case 'rook':
                    moves = getLegalRookMoves(currPosition, color);
                    break;

                case 'bishop':
                    moves = getLegalBishopMoves(currPosition, color);
                    break;

                case 'knight':
                    moves = getLegalKnightMoves(currPosition, color);
                    break;

                case 'queen':
                    moves = getLegalQueenMoves(currPosition, color);
                    break;

                case 'king':
                    moves = getLegalKingMoves(currPosition, color);
                    break;

                default:
                    break;
            }

            console.log(moves);

            highlightLegalMoves(moves, color);
            moves = [];
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
function highlightLegalMoves(legalMoves, color) {
    legalMoves.forEach((pos) => {

        const square = document.getElementById(pos);
        if (!square) return;

        const existingPiece = square.querySelector('img');
        const highlightCircle = document.createElement('div');
        highlightCircle.classList.add('highlighted-circle');

        if (existingPiece && existingPiece.dataset.color !== color) {
            // Opponent's piece
            square.appendChild(highlightCircle);
        }
        else if (!existingPiece) {
            square.appendChild(highlightCircle);
        }

        highlightMoves.push(square);
        square.addEventListener('click', onHighlightedSquareClick);
    });
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

async function onHighlightedSquareClick(e) {

    let toSquare = e.currentTarget;
    movePiece(selectedPiece, selectedSquare, toSquare);

    // After move check Is king is in Danger (Check)
    const opponentColor = currentTurn === 'white' ? 'black' : 'white';
    setTimeout(() => {
        const isCheck = isKingInCheck(opponentColor);

        if (isCheck) {
            showCheckNotification();
        }
    }, 50);

    // After moving, clean up everything
    clearHighlights();
    selectedPiece = null;
    selectedSquare = null;

    // changing the turn once movement happen
    currentTurn = opponentColor;
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
function getlegalpawnMoves(pos, color) {
    const legalMoves = [];
    const file = pos[0];
    const rank = parseInt(pos[1]);

    const fileIdx = filesName.indexOf(file);
    const nextRank = color === 'white' ? rank + 1 : rank - 1;

    // Normal move
    const forwardSquare = document.getElementById(file + nextRank);
    if (forwardSquare && !forwardSquare.querySelector('img')) {

        legalMoves.push(file + nextRank);
    }

    // Diagonal capture
    dir = [-1, 1];
    dir.forEach(step => {
        let nextFileIdx = fileIdx + step;
        if (nextFileIdx >= 0 && nextFileIdx < 7) {

            const targetID = filesName[nextFileIdx] + nextRank;
            const targetSquare = document.getElementById(targetID);
            if (targetSquare && targetSquare.querySelector('img') && targetSquare.querySelector('img').dataset.color !== color) {
                legalMoves.push(targetID);
            }
        }
    });

    // Double move
    const doubleRank = color === 'white' ? 2 : 7;
    const doubleNextRank = color === 'white' ? rank + 2 : rank - 2;

    if (rank === doubleRank && !document.getElementById(file + nextRank).querySelector('img')
        && !document.getElementById(file + doubleNextRank).querySelector('img')) {
        legalMoves.push(file + doubleNextRank);
    }

    return legalMoves;
}

// ROOK MOVE
function getLegalRookMoves(pos, color) { // pos - a8, color: black
    let legalMoves = [];

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
                legalMoves.push(squareID);
            }
            else {
                if (occupant.dataset.color !== color) {
                    // Opponent found
                    legalMoves.push(squareID);
                }
                break;
            }

            newFileIdx += fileStep;
            newRankIdx += rankStep;
        }
    });

    return legalMoves;

}

function getLegalBishopMoves(pos, color) {
    let legalMoves = [];

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
                legalMoves.push(squareID);
            }
            else {
                if (occupant.dataset.color !== color) {
                    legalMoves.push(squareID);
                }
                break; // stop at first piece
            }

            newFileIdx += fileStep;
            newRankIdx += rankStep;
        }
    });

    return legalMoves;
}

function getLegalKnightMoves(pos, color) {
    let legalMoves = [];

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
                legalMoves.push(newPosition);
            }
        }
    });

    return legalMoves;
}

// QUEEN MOVEMENT
function getLegalQueenMoves(pos, color) {
    // Queen can move both as rook and bishop
    return getLegalRookMoves(pos, color).concat(getLegalBishopMoves(pos, color));
}

// KING MOVEMENT
function getLegalKingMoves(pos, color) {
    let legalMoves = [];

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
                    legalMoves.push(squareID);
                }
            }
        }
    });

    return legalMoves;
}

// Move piece
function movePiece(piece, fromSquare, toSquare) {

    const opponent = toSquare.querySelector('img');

    if (opponent && opponent.dataset.color !== piece.dataset.color) {

        // play capture sound
        document.getElementById("capture-sound").play();

        // Animation fade-out
        opponent.classList.add(".captured");
        setTimeout(() => {
            toSquare.removeChild(opponent);
            fromSquare.removeChild(piece);
            toSquare.appendChild(piece);
            removeHighlightedMove()
        }, 200);
    }
    else {

        // remove the piece img from parent element
        fromSquare.removeChild(piece);

        // add element to destination position
        toSquare.appendChild(piece);
        removeHighlightedMove();

    }
}

// Check king of the color (white & black) is in Danger or not
function isKingInCheck(color) {
    const king = document.querySelector(`img[data-piece="king"][data-color = "${color}"]`);
    if (!king) {
        return false; // king is already captured (Game Over)
    }

    const kingSquare = king.parentElement;
    const kingPosition = kingSquare.id;

    // Check if any opponent can move to king position
    const opponentColor = color === 'white' ? 'black' : 'white';
    const opponents = document.querySelectorAll(`img[data-color="${opponentColor}"]`);

    for (let piece of opponents) {
        const pieceSquareID = piece.parentElement.id;
        const type = piece.dataset.piece;

        // Stimulate legal Piece for each piece
        const possibleMoves = getLegalMoves(type, pieceSquareID, opponentColor)
        if (possibleMoves.includes(kingPosition)) {
            return true; // king is in check
        }
    }

    return false;
}


// Stimulate moves for the piece

function getLegalMoves(pieceType, currPosition, color) {
    let legalMoves = [];

    switch (pieceType) {

        case 'pawn':
            legalMoves = getlegalpawnMoves(currPosition, color);
            break;

        case 'rook':
            legalMoves = getLegalRookMoves(currPosition, color);
            break;

        case 'bishop':
            legalMoves = getLegalBishopMoves(currPosition, color);
            break;

        case 'knight':
            legalMoves = getLegalKnightMoves(currPosition, color);
            break;

        case 'queen':
            legalMoves = getLegalQueenMoves(currPosition, color);
            break;

        case 'king':
            legalMoves = getLegalKingMoves(currPosition, color);
            break;

        default:
            break;
    }

    return legalMoves;
}

function showCheckNotification() {

    const banner = document.getElementById("check-notification");
    banner.classList.remove("hidden");
    banner.classList.add("show");

    // Hide after 2 sec
    setTimeout(() => {
        banner.classList.remove("show");
        banner.classList.add("hidden");
    }, 2500);
}