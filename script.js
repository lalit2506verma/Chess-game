// Assigning ID to every square
const filesName = ["a", "b", "c", "d", "e", "f", "g", "h"];
let fileCounter = 0;

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
let clickedElements = [];
let selectedPiece = null;
let selectedSquare = null;


// Handle clicks
Array.from(allSquares).forEach(square => {

    square.addEventListener("click", (e) => {

        let clickedElement = e.target;
        console.log(clickedElement);

        const parentSquare = clickedElement.closest('.square');

        // If clicking on empty square or the highlight circle
        if (clickedElement.tagName === 'DIV' && clickedElement.classList.contains('highlighted-circle')) {
            clickedElement = clickedElement.querySelector('img') || clickedElement;
        }

        if (clickedElement && clickedElement.tagName === 'IMG') {
            console.log('You clicked:', clickedElement.dataset.color, clickedElement.dataset.piece);

            const color = clickedElement.dataset.color;
            const pieceType = clickedElement.dataset.piece;
            const currPosition = parentSquare.getAttribute('id');

            selectedPiece = clickedElement;
            selectedSquare = parentSquare;

            clearHighlights();
            removeHighlightedMove();

            // Separating black and white color
            if (color === 'black') {
                // Handle Black pieces
                switch (pieceType) {

                    case 'pawn':

                        highlightSquare(clickedElement);
                        highlightPawnMoves(currPosition, color);
                        break;

                    default:
                        break;
                }
            }
            else {
                // white
                switch (pieceType) {
                    case 'pawn':

                        highlightSquare(clickedElement);
                        highlightPawnMoves(currPosition, color);
                        break;

                    default:
                        break;
                }

            }
        }
    });
});

// Reset another selected sqaure
function clearHighlights() {
    clickedElements.forEach(square => {
        square.classList.remove('highlighted-square');

        //remove event listner
        square.removeEventListener('click', onHighlightedSquareClick);
    });
    clickedElements = [];
}

function highlightSquare(clickedElement) {
    clickedElement.classList.add('highlighted-square');
    clickedElements.push(clickedElement);
}

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

// Global array to track highlighted move
let highlightMoves = [];

// Highlighting next Possible Moves
function highlightMove(position) {

    const square = document.querySelector("#" + position);
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
}


// Move piece
function movePiece(piece, fromSquare, toSquare) {

    // remove the piece img from parent element
    fromSquare.removeChild(piece);

    // add element to destination position
    toSquare.appendChild(piece);
    removeHighlightedMove();
}