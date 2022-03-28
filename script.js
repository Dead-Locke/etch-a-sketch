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

var coloringMode = DEFAULT_MODE;
var rightMouseToggle = false;
var gridToggle = false;
var mouseDownToggle = false;
grid.onmousedown =() => mouseDownToggle = true;
grid.onmouseup =() => {mouseDownToggle = false; rightMouseToggle = false;} 

penColor.value = DEFAULT_COLOR;
backColor.value = DEFAULT_BACK;
gridColor.value = DEFAULT_GRID;


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

function createGrid(num) { //grid creation
    clear() //clear grid just in case
    grid.style.gridTemplateColumns = `repeat(${num}, 1fr)`; //generate tracks
    grid.style.gridTemplateRows = `repeat(${num},1fr)`; 
    for(let i = 0; i < (num*num); i++){
        const cell = document.createElement('div')
        grid.appendChild(cell).classList.add('cell') //fill grid
    }
    
    gridSizeNumbers.forEach(x => x.innerText = gridSize.value) //change the grid Num x Num display
    retainGridLines();
    enableColoring(); //enable coloring event listeners
}

function retainGridLines (){ // retain grid toggle and color
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => cell.style.borderColor = gridColor.value);
    if(gridToggle) cells.forEach(x => x.classList.add('noBorder'))
};


function colorChange(cell){ // main cell coloring function based on coloringMode
    let cellColor = cell.style.background
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
        penColor.value = (cellColor)? rgbToHex(cellColor) : rgbToHex(gridBack) ;
        changeMode('user');
        
    }
};



function enableColoring(){//event listeners for coloring
    grid.childNodes.forEach(cell => { 
        cell.onclick =() => colorChange(cell);
        cell.onmousedown = () => colorChange(cell); //color in on left mouse click
        cell.oncontextmenu = () => {rightMouseToggle = true; colorChange(cell); }; //'erase' on right mouse click
        cell.onmouseover= () => {if(mouseDownToggle) colorChange(cell);}// dragging will color cells
    });
    grid.style.background = backColor.value; // set background color
};

function changeMode(mode) {
    document.querySelectorAll('.controls .enabled').forEach(x=> x.classList.remove('enabled')) //remove all button highlights
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

createGrid(DEFAULT_SIZE);
