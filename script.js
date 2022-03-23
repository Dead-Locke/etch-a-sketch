const grid = document.querySelector(".grid")
const penColor = document.querySelector('.pen-color');
const toggleGrid = document.querySelector('.toggle');
const gridSize = document.querySelector('.slider');
const reset = document.querySelector('.reset');
const gridBackground = document.querySelector('.background');
const gridColor = document.querySelector('.grid-color')
const gridSizeNumbers = document.querySelectorAll('.grid-size-number');
var mouseDownToggle = false;
var rightMouseToggle = false;

function createGrid(col,rows) {
    for(let i = 0; i < (col*rows); i++){
        const div = document.createElement('div')
        grid.style.gridTemplateColumns = `repeat(${col}, 1fr)`;
        grid.style.gridTemplateRows = `repeat(${rows},1fr)`; 
        grid.appendChild(div).classList.add('cell')
    }
}

function clear(){ //remove all cells in the grid to reset
    const cells = grid.querySelectorAll('.cell');
    cells.forEach(c => c.remove())
}

createGrid(16,16);

function main (){

    toggleGrid.addEventListener('click', ()=> {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(x => x.classList.toggle('noBorder'));
    })

    gridSize.addEventListener('input', () => {
        clear();
        createGrid(gridSize.value, gridSize.value);
        enableColoring();
        gridSizeNumbers.forEach(x => x.innerText = gridSize.value);
    })

    reset.addEventListener('click', () => {
        window.location.reload()
    })
}

function enableColoring(){
    const cells = document.querySelectorAll('.cell');

    function colorFill(cell, color){ // main coloring function
        cell.style.background = color;
    };

    cells.forEach(cell => { //cell coloring events
        cell.addEventListener('mousedown', () => {
            mouseDownToggle = true;
            colorFill(cell, penColor.value);
        }); //color in on left mouse click
        
        cell.addEventListener('contextmenu', () => {
            rightMouseToggle = true;
            colorFill(cell, gridBackground.value);
        }); //'erase' on right mouse click

        cell.addEventListener('mouseenter', () => {
            if(mouseDownToggle) colorFill(cell, penColor.value); //left mouse
            if(rightMouseToggle) colorFill(cell, gridBackground.value) //right mouse
        }); // dragging will color cells
        
        cell.addEventListener('mouseup', () => {
            mouseDownToggle = false;
            rightMouseToggle = false;
        }); //remove drag coloring when mouse is unclicked

    });

    gridBackground.addEventListener('change', () => { //background color
        cells.forEach(cell => cell.style.background = gridBackground.value)
    })


    gridColor.addEventListener('change', () => { //change grid color
        cells.forEach(cell => cell.style.borderColor = gridColor.value)
    })



};

main();
enableColoring();
