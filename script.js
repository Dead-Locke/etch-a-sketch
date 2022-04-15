const DEFAULT_COLOR = "#64C3D3" //pen color
const DEFAULT_BACK = "#000000" //background color
const DEFAULT_GRID = "#971C53" //grid lines color
const DEFAULT_MODE = "user"  
const DEFAULT_SIZE = 20;  // NxN grid size
const DEFAULT_SHADE = -20 //shade value to add to each r,g,b value
const DEFAULT_TINT = 20 //tint value to add to each r,g,b value

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
const sliderFill = document.querySelector('.sliderFill');

var coloringMode = DEFAULT_MODE;
var mouseDownToggle = false;
var rightMouseToggle = false;
var gridToggle = true;

grid.onmousedown =() => mouseDownToggle = true;
grid.onmouseup =() => {mouseDownToggle = false; rightMouseToggle = false;} 
reset.onclick = () => window.location.reload();
clearGridBtn.onclick = () => createGrid(+gridSize.value);
gridSize.oninput = () => createGrid(+gridSize.value);
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

penColor.value = DEFAULT_COLOR;
gridColor.value = DEFAULT_GRID;
backColor.value = DEFAULT_BACK;
gridSize.value = DEFAULT_SIZE;

function createGrid(gridSide) { //grid creation
    clear() //clear grid just in case
    let edges = getRightBottomEdges(gridSide);
    grid.style.gridTemplateColumns = `repeat(${gridSide}, 1fr)`; //generate tracks
    grid.style.gridTemplateRows = `repeat(${gridSide},1fr)`; 

    for(let i = 0; i < (gridSide*gridSide); i++){
        const cell = document.createElement('div')
        grid.appendChild(cell).classList.add('cell')
        cell.setAttribute('id',`${i}`); //number cells for id
        
        cell.onmousedown = () => {if(coloringMode != 'fill') colorChange(cell)} //color in on left mouse down but not when in fill mode. Avoids coloring in on right click
        cell.onclick = () => {if(coloringMode=='fill') colorChange(cell)} //onclick only in fill mode. Otherwise it fills on right click but erases clicked square. Avoids duplicate with onmousedown.
        cell.oncontextmenu = () => {rightMouseToggle = true; colorChange(cell); }; //'erase' on right mouse click
        cell.onmouseover= () => {if(mouseDownToggle) colorChange(cell);} //fill grid if right mouse is held
        if(edges[0].includes(i)) cell.classList.add('borderRight') //add border tright and bottom edges of the grid
        if(edges[1].includes(i)) cell.classList.add('borderBottom')
    }
    sliderFill.style.width = `${gridSide/.8}%` //adjust the slider fill
    gridSizeNumbers.forEach(x => x.innerText = gridSize.value) //change the grid Num x Num display
    grid.style.background = backColor.value //color in background
    retainGridLines();
    
}

clear = () => {while(grid.lastChild){grid.lastChild.remove()}} //remove every cell from the grid

function getRightBottomEdges(side) {
    let right = [], bottom = [];
    for(let j = (side*side-side); j < side*side; j++) bottom.push(j);
    for(let i =(side-1); i < (side*side); i= i+side) right.push(i);
    return [right, bottom]

}

function retainGridLines (){ // retain grid toggle and color for clear function
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.style.borderColor = gridColor.value);
    if(!gridToggle) cells.forEach(x => x.classList.add('noBorder'))
};


function colorChange(cell){ // main cell coloring function based on coloringMode
    let cellColor = cell.style.backgroundColor
    let gridBack = grid.style.background

    if(rightMouseToggle) cell.style.background = ''; //erase
    if(coloringMode == 'user' && !rightMouseToggle) //default mode
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
    modeButton = document.querySelector(`#${mode}`); //find the clicked button based on mode
    if(coloringMode != mode) {
        coloringMode = mode; //switch mode
        modeButton.classList.add('enabled'); //highlight button
    }
    else {
        coloringMode = 'user'; //toggle mode back to default
        modeButton.classList.remove('enabled'); //remove highlighted button
    }; 
}

function randomInt(min, max){ //random integer in range
    return Math.floor(Math.random()*(max-min) + min)
}
  
function adjustColor(color, value){ //shade/tint . color is  rbg(), value is <0 to shade, >0 to tint
    var match = color.match(/rgb?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})/);//extract individual r, g, b
    var r = match[1];
    var g = match[2];
    var b = match[3];
    r = +r + value; g = +g + value; b  = +b + value; //shade or tint based on value
    if(r>255) r = 255; if(r<0) r =0; //limits 0 to 255
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
    let id = +cell.id; //convert cell id to number
    
    let cellsToCheck = [id];
    let checkedCells = {}; //store checked cell id:boolean association
    while(cellsToCheck.length){
        let nextID = cellsToCheck.shift();
        document.getElementById(nextID).style.background = penColor.value; 
        cellsToCheck = cellsToCheck.concat(adjacentCells(nextID, givenColor, checkedCells))
    }
    return;
}

function adjacentCells(id, color, checkedCells){
    let adjacent = [];
    let size = +gridSize.value

    //convert id to row/column in 2D grid, to test if adjacent cells are on the edges.
    let row = Math.floor(id /gridSize.value);
    let column = id % gridSize.value;
    
    const leftCell = document.getElementById(`${id-1}`)
    const rightCell = document.getElementById(`${id+1}`)
    const topCell = document.getElementById(`${id-size}`)
    const bottomCell = document.getElementById(`${id+size}`)
    
    if(column > 0 && !checkedCells[id-1]){//check if left cell  has not been checked, without going over edges of grid
        checkedCells[id-1] = true; //add cell to checked object
        if(leftCell.style.background == color) //check if same color as the cell clicked on originally?
            adjacent.push(id-1)//add to adjacent
    }
    if(column < size-1 && !checkedCells[id+1]){//right
        checkedCells[id+1] = true;
        if(rightCell.style.background == color)
            adjacent.push(id+1)
    }
    if(row > 0 && !checkedCells[id-size]){//above
        checkedCells[id-size] = true;
        if(topCell.style.background == color)
            adjacent.push(id-size)
    }
    if(row < size-1 && !checkedCells[id+size]){//below
        checkedCells[id+size] = true;
        if(bottomCell.style.backgroundColor == color)
            adjacent.push(id+size)
    }
  
    return adjacent;
}


window.onload = () => {
    createGrid(DEFAULT_SIZE);
}
