const grid = document.querySelector(".grid")
const penColor = document.querySelector('.color');
const toggleGrid = document.querySelector('.toggle');
const gridSize = document.querySelector('.slider');
const reset = document.querySelector('.reset')

function createGrid(col,rows) {
    for(let i = 0; i < (col*rows); i++){
        const div = document.createElement('div')
        grid.style.gridTemplateColumns = `repeat(${col}, 1fr)`;
        grid.style.gridTemplateRows = `repeat(${rows},1fr)`; 
        grid.appendChild(div).classList.add('cell')
    }
}

function reSet(){ //remove all cells in the grid to reset
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
        reSet();
        createGrid(gridSize.value, gridSize.value);
    })

    reset.addEventListener('click', () => {
        window.location.reload()
    })


}

main();