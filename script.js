
const penColor = document.querySelector('#penColor');
const toggleGrid = document.querySelector('#toggle');
const gridSize = document.querySelector('#slider');
const reset = document.querySelector('.reset');
const clearGrid = document.querySelector('.clear');
const gridBackground = document.querySelector('#background');
const gridColor = document.querySelector('#gridColor');

var mouseDownToggle = false;
var rightMouseToggle = false;

//grid creation
const grid = document.querySelector("#grid")
function createGrid(col,rows) {
    
    for(let i = 0; i < (col*rows); i++){
        const div = document.createElement('div')
        grid.style.gridTemplateColumns = `repeat(${col}, 1fr)`;
        grid.style.gridTemplateRows = `repeat(${rows},1fr)`; 
        grid.appendChild(div).classList.add('cell')
    }
}

createGrid(20,20);
enableColoring();


//remove all cells in the grid to reset
function clear(){ 
    const cells = grid.querySelectorAll('.cell');
    cells.forEach(c => c.remove())
}

// toggle gridlines 
var gridToggle = false;
toggleGrid.addEventListener('click', ()=> {
    const cells = document.querySelectorAll('.cell');
    gridToggle = !gridToggle; //toggle the boolean marker
    cells.forEach(x => x.classList.toggle('noBorder'));
})

// resize the grid
const gridSizeNumbers = document.querySelectorAll('.grid-size-number');
gridSize.addEventListener('input', () => {
    clear();
    createGrid(gridSize.value, gridSize.value);
    enableColoring();
    gridSizeNumbers.forEach(x => x.innerText = gridSize.value);
    retainGrid();
})

//reset the page
reset.addEventListener('click', () => {
    window.location.reload()
});

//clear the grid while retaining settings
clearGrid.addEventListener('click', () => {
    clear();
    createGrid(gridSize.value, gridSize.value);
    enableColoring();
    retainGrid()
});

// retain grid toggle and color
function retainGrid (){
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.style.borderColor = gridColor.value);
    if(gridToggle) cells.forEach(x => x.classList.add('noBorder'))
};

// main cell coloring function
function colorFill(cell, color){ 
    cell.style.background = color;
};

//event listeners for coloring
function enableColoring(){
    const cells = document.querySelectorAll('.cell');

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

        //background color
        gridBackground.addEventListener('input', () => { 
            grid.style.background = gridBackground.value
        });

        //change grid color
        gridColor.addEventListener('input', () => {
            cells.forEach(cell => cell.style.borderColor = gridColor.value)
        })
    }