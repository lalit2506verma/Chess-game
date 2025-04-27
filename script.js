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


// Handle clicks
Array.from(allSquares).forEach(square => {

    square.addEventListener("click", (e) => {

        let clickedElement = e.target;
        const parentSquare = clickedElement.parentElement;

        if (clickedElement.tagName === 'DIV') {
            clickedElement = clickedElement.querySelector('IMG');
        }

        if (clickedElement && clickedElement.tagName === 'IMG') {
            console.log('You clicked:', clickedElement.dataset.color, clickedElement.dataset.piece);

            const color = clickedElement.dataset.color;
            const pieceType = clickedElement.dataset.piece;
            const currPosition = parentSquare.getAttribute('id');

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

        //const idOfElement = square.getAttribute("id");
        // get inner html
        // const element = document.getElementById(idOfElement);
        // const innerHTMLOfElement = element.innerHTML;

        // if (innerHTMLOfElement.includes("black") || innerHTMLOfElement.includes("white")) {
        //     // unclick any other element
        //     //unclickedElements();
        //     // change the color of the square
        //     element.style.backgroundColor = '#baca2c';
        //     console.log("element clicked");

        // }

        // // push element in the array
        // clickedElements.push(square);

    })
})

// Reset another selected sqaure
function clearHighlights() {
    clickedElements.forEach(square => {
        square.classList.remove('highlighted-square');
    });
    clickedElements = [];
}

function highlightSquare(clickedElement) {
    clickedElement.classList.add('highlighted-square');
    clickedElements.push(clickedElement);
}

function highlightPawnMoves(pos, color) {
    console.log(pos);

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
    }

}

// Remove existing Highlighted move
function removeHighlightedMove() {

    highlightMoves.forEach(square => {
        const child = square.querySelector('.highlighted-circle');

        child.remove();
    })

    highlightMoves = [];
}

// const arrayOfPawn = [];

// // Black Pawn laws
// filesName.forEach(file => {
//     arrayOfPawn.push(document.getElementById(file + 2));
// })

// // White Pawn laws
// filesName.forEach(file => {
//     arrayOfPawn.push(document.getElementById(file + 7));
// })

// arrayOfPawn.forEach(pawn => {
//     pawn.addEventListener('click', () => {
//         const pawnCurrID = pawn.getAttribute("id");

//         console.log(pawn);
//         const pieceColor = pawn.dataset;
//         // const type = pawn.dataset.piece
//         let currRank = parseInt(pawnCurrID[1]);
//         console.log(pieceColor);


//         const attachCircles = [];

//         for (let i = 1; i <= 2; i++) {
//             currRank++;
//             attachCircles.push(document.getElementById(pawnCurrID[0] + currRank));
//         }

//         highlightSquare(attachCircles);
//     })
// })

// // ARRAY TO TRACK HIGHLIGHTED CIRCLES
// const trackCircles = [];

// // FUNCTION TO HIGHLIGHT POSSIBLE STEPS
// const highlightSquare = function (attachCircles) {

//     // Remove old circles
//     if (trackCircles.length > 0) {
//         trackCircles.forEach(parent => {
//             const children = parent.querySelectorAll('.highlighted-circle');
//             children.forEach(child => child.remove());
//         });
//         // After removing all children, clear the tracking array
//         trackCircles.length = 0;
//     }

//     const child = `<div class="highlighted-circle"> </div>`;

//     // Add new circles
//     attachCircles.forEach(el => {
//         el.insertAdjacentHTML('beforeend', child); // safer than innerHTML
//         trackCircles.push(el);
//     });

//     console.log(trackCircles);
// };