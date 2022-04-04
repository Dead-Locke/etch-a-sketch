const DEFAULT_COLOR = "#404040"
const DEFAULT_BACK = "#FFFFFF"
const DEFAULT_GRID = "#696969"
const DEFAULT_MODE = "user"
const DEFAULT_SIZE = 20;
const DEFAULT_SHADE = -20
const DEFAULT_TINT = 20

const penColor = document.querySelector('#penColor');
const backColor = document.querySelector('#background');
const rainbowModeBtn = document.querySelector('#rainbow');
const samplerBtn = document.querySelector('#sampler');
const fillBtn = document.querySelector('#fill');
const shadeBtn = document.querySelector('#shade');
const tintBtn = document.querySelector('#tint');
const toggleGridBtn = document.querySelector('#toggle');
const reset = document.querySelector('.reset');
const clearGridBtn = document.querySelector('.clear');
const gridColor = document.querySelector('#gridColor');
const grid = document.querySelector("#grid");
const gridSize = document.querySelector('#slider');
const gridSizeNumbers = document.querySelectorAll('.grid-size-number');

penColor.value = DEFAULT_COLOR;
backColor.value = DEFAULT_BACK;
gridColor.value = DEFAULT_GRID;

var grid2D;
var coloringMode = DEFAULT_MODE;
var rightMouseToggle = false;
var gridToggle = false;
var mouseDownToggle = false;
grid.onmousedown =() => mouseDownToggle = true;
grid.onmouseup =() => {mouseDownToggle = false; rightMouseToggle = false;} 

reset.onclick = () => window.location.reload();
clearGridBtn.onclick = () => createGrid(gridSize.value);
gridSize.oninput = () => createGrid(gridSize.value);
rainbowModeBtn.onclick = () => changeMode('rainbow');
samplerBtn.onclick = () => changeMode('sampler');
fillBtn.onclick = () => changeMode('fill')
shadeBtn.onclick = () => changeMode('shade');
tintBtn.onclick = () => changeMode('tint');
gridColor.oninput = () => grid.childNodes.forEach(x => x.style.borderColor = gridColor.value)
backColor.oninput = () => grid.style.background = backColor.value;
toggleGridBtn.onclick = () => { // grid toggle
    grid.childNodes.forEach(x => x.classList.toggle('noBorder'));
    gridToggle = !gridToggle; //toggle the boolean marker
}

clear = () => {while(grid.firstChild){grid.removeChild(grid.firstChild)}} //remove every cell from the grid

function createGrid(gridSide) { //grid creation
    clear() //clear grid just in case
    grid.style.gridTemplateColumns = `repeat(${gridSide}, 1fr)`; //generate tracks
    grid.style.gridTemplateRows = `repeat(${gridSide},1fr)`; 
    for(let i = 0; i < (gridSide*gridSide); i++){
        const cell = document.createElement('div')
        grid.appendChild(cell).classList.add('cell')
        cell.setAttribute('id',`${i}`); //number cells for id
        
        cell.onmousedown = () => colorChange(cell); //color in on left mouse click
        cell.oncontextmenu = () => {rightMouseToggle = true; colorChange(cell); }; //'erase' on right mouse click
        cell.onmouseover= () => {if(mouseDownToggle) colorChange(cell);} //fill grid if right mouse is held
    }
    
    gridSizeNumbers.forEach(x => x.innerText = gridSize.value) //change the grid Num x Num display
    grid.style.background = backColor.value; //color in background
    retainGridLines();
    markRowAndColumn();//mark each cell with a row-column value
}

function retainGridLines (){ // retain grid toggle and color
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.style.borderColor = gridColor.value);
    if(gridToggle) cells.forEach(x => x.classList.add('noBorder'))
};


function colorChange(cell){ // main cell coloring function based on coloringMode
    let cellColor = cell.style.backgroundColor
    let gridBack = grid.style.background
    if(rightMouseToggle) cell.style.background = 'transparent'; //erase

    if(coloringMode == 'user' && !rightMouseToggle) 
        cell.style.background =  penColor.value;

    if(coloringMode == 'rainbow' && !rightMouseToggle)
        cell.style.background = `rgb(${randomInt(0,255)},${randomInt(0,255)},${randomInt(0,255)})`

    if(coloringMode == 'shade' && !rightMouseToggle)
        cell.style.background = `${adjustColor(cellColor, DEFAULT_SHADE)}`

    if(coloringMode == 'tint' && !rightMouseToggle)
        cell.style.background = `${adjustColor(cellColor, DEFAULT_TINT)}`
    //for some reason, the penColor only accepts hex but background color of each cell or grid is returned as an rgb() value. need to convert rgb to hex
    if(coloringMode == 'sampler' && !rightMouseToggle){
        penColor.value = (cellColor) ? rgbToHex(cellColor) : rgbToHex(gridBack) ;
        changeMode('user'); //change mode back to coloring after sampling
    };
    if(coloringMode == 'fill' && !rightMouseToggle) 
        fill(cell, cellColor);
    
};

function changeMode(mode) {
    
    document.querySelectorAll('.enabled').forEach(x=> x.classList.remove('enabled')) //remove all button highlights
    modeButton = document.querySelector(`#${mode}`); //find appropriate clicked button based on mode
    if(coloringMode != mode) {
        coloringMode = mode; //switch mode
        modeButton.classList.add('enabled'); //highlight button
    }
    else {
        coloringMode = 'user'; //toggle mode back to default
        modeButton.classList.remove('enabled'); //remove highlighted button
    }; 
}

function randomInt(min, max){ //random integer within a given range
    return Math.floor(Math.random()*(max-min) + min)
}
  
function adjustColor(color, value){ //shade/tint . color is  rbg(), value is <0 to shade, >0 to tint
    var match = color.match(/rgb?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})/);//extract individual r, g, b
    var r = match[1];
    var g = match[2];
    var b = match[3];
    r = +r + value; g = +g + value; b  = +b + value; //shade or tint based on value
    if(r>255) r = 255; if(r<0) r =0; //limits
    if(g>255) g = 255; if(g<0) g =0;
    if(b>255) b = 255; if(b<0) b =0;
    return `rgb(${r},${g},${b})`; 
}


function rgbToHex(color){ //rgb to hex converter
    var match = color.match(/rgb?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})/);
    var r = (+match[1]).toString(16).padStart(2,'0');
    var g = (+match[2]).toString(16).padStart(2,'0');
    var b = (+match[3]).toString(16).padStart(2,'0');

    return '#'+ r + g + b;
}


function fill(cell, givenColor) {
    let id = +cell.id; //conert cell id to number
    let row = Math.floor(id /gridSize.value) //get row from id (avoided using the class since that would require regex filtering)
    let column = id % gridSize.value;
    let cellsToCheck = [[row,column]];
    let checkedCells = {}; //store checked cell row/column values.
    while(cellsToCheck.length){
        let next = cellsToCheck.shift();
        document.getElementsByClassName(`${next[0]}-${next[1]}`)[0].style.background = penColor.value; 
        cellsToCheck = cellsToCheck.concat(adjacentCells(next, givenColor, checkedCells))
    }
    return;
}

function adjacentCells(cellIndex, color, checkedCells){
    let adjacent = [];
    let row = cellIndex[0]
    let column = cellIndex[1]
    let leftCell = document.getElementsByClassName(`${row}-${column-1}`)[0]
    let rightCell = document.getElementsByClassName(`${row}-${column+1}`)[0]
    let topCell = document.getElementsByClassName(`${row-1}-${column}`)[0]
    let bottomCell = document.getElementsByClassName(`${row+1}-${column}`)[0]

    if(column > 0 && !checkedCells[[row,column-1]]){//check left cell if it has not been checked, without going over edges of grid
        checkedCells[[row,column-1]] = true; //add cell to checked object
        if(leftCell.style.background == color) //same color as the cell clicked on originally?
            adjacent.push([row, column-1])//add to adjacent
    }
    if(column < gridSize.value-1 && !checkedCells[[row,column+1]]){//right
        checkedCells[[row,column+1]] = true;
        if(rightCell.style.background == color)
            adjacent.push([row, column+1])
    }
    if(row > 0 && !checkedCells[[row-1,column]]){//above
        checkedCells[[row-1,column]] = true;
        if(topCell.style.background == color)
            adjacent.push([row-1, column])
    }
    if(row < gridSize.value-1 && !checkedCells[[row+1,column]]){//below
        checkedCells[[row+1,column]] = true;
        if(bottomCell.style.background == color)
            adjacent.push([row+1, column])
    }
  
    return adjacent;
}

//the function below, and the above reliance on it might be unnecessary. You could just determine 
// the row and column values from the id, and use them to represent the given position of a cell. 
// this would be fine for determineing if a cell is at an edge.
// however to refer to the adjacent cells, you would need to convert the new [row-1, column ] 
// or [row, column+1] back to id via (row*gridSize.value+column)formula
function markRowAndColumn(){//adds a class in the form "ROW-COLUMN" to each cell marking its position in a 2D grid.
    grid.childNodes.forEach(node => {
        let id = +node.id; 
        let row = Math.floor(id /gridSize.value)
        let column= id % gridSize.value;
        node.classList.add(`${row}-${column}`)
    } )
}
    



window.onload = () => {
    createGrid(DEFAULT_SIZE);
}

