const grid = document.querySelector(".grid")
const penColor = document.querySelector('.pen-color');
const toggleGrid = document.querySelector('.toggle');
const gridSize = document.querySelector('.slider');
const reset = document.querySelector('.reset');
const background = document.querySelector('.background');
const gridColor = document.querySelector('.grid-color')
var mouseDownToggle = false;

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

    gridSize.addEventListener('change', () => {
        clear();
        createGrid(gridSize.value, gridSize.value);
        enableColoring();
    })

    reset.addEventListener('click', () => {
        window.location.reload()
    })
}

function enableColoring(){
    const cells = document.querySelectorAll('.cell');

    function colorFill(cell, color){ // match user selected color
        cell.style.background = color;
    };

    cells.forEach(cell => { //cell colloring events
        cell.addEventListener('mousedown', () => {
            mouseDownToggle = true;
            colorFill(cell, penColor.value);
        }); //color in on mouse click

        cell.addEventListener('mouseenter', () => {
            if(mouseDownToggle) colorFill(cell, penColor.value)
        }); //if mouse is clicked, dragging will color cells
        
        cell.addEventListener('mouseup', () => {
            mouseDownToggle = false;
        }); //remove drag coloring when mouse is unclicked

    });

    background.addEventListener('change', () => { //background color
        cells.forEach(cell => cell.style.background = background.value)
    })


    gridColor.addEventListener('change', () => {
        cells.forEach(cell => cell.style.borderColor = gridColor.value)
    })


};

main();
enableColoring();
