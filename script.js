// Assigning ID to every square
const filesName = ["a", "b", "c", "d", "e", "f", "g", "h"];
let fileCounter = 0;

const squares = document.querySelectorAll('.files');
const arrayOfFiles = Array.from(squares);


arrayOfFiles.forEach(file => {

    //counter
    let counter = 1;

    Array.from(file.children).forEach(item => {

        item.setAttribute("id", filesName[fileCounter] + counter)
        counter++;
    })

    fileCounter++;

})

const allSquare = document.querySelectorAll('.square');
const clickedElements = [];

Array.from(allSquare).forEach(square => {

    square.addEventListener("click", () => {

        const idOfElement = square.getAttribute("id");
        // get inner html
        const element = document.getElementById(idOfElement);
        const innerHTMLOfElement = element.innerHTML;

        if (innerHTMLOfElement.includes("black") || innerHTMLOfElement.includes("white")) {
            // unclick any other element
            unclickedElements();
            // change the color of the square
            element.style.backgroundColor = '#f5f681';
            console.log("element clicked");

        }

        // push element in the array
        clickedElements.push(square);

    })
})

function unclickedElements() {

    if (clickedElements.length > 0) {

        clickedElements[0].removeAttribute("style");
        clickedElements.pop();
    }
}