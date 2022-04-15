# Etch-a-sketch Project
## Second major project from [The Odin Project](https://www.theodinproject.com/lessons/foundations-etch-a-sketch) curriculum. 

Although called Etch-a-Sketch it functions more like a paint grid. You can choose a color and paint each cell in the grid by clicking/holding the left mouse button. The same gesture with the right mouse button erases the colored in cells. Additional functionality includes resizing the grid, shading or tining the colors, a color sampler and a fill-in an area functionality. 

---
You can try it out [here](https://dead-locke.github.io/etch-a-sketch/)
___


### Goals/Features: 
- [x] create an resizable interactive square grid.
- [x] ensure the square grid stays square regardless of screen size. 
- [x] color in the grid cells based on mouse position.
- [x] erase any colored in cells (right mouse button) 
- [x] allow user to change pen color, background color, and grid color.
- [x] reset button to return to default setup
- [x] clear the grid button
- [x] grid visibility toggle that persists through clears
- [x] shade and tint functionality
- [x] color filler (fill bucket tool)
- [x] color sampler (eye dropper tool)
- [x] rainbow mode, where every new stroke on every new cell has a random color.

### Learning Outcomes: 
- Learned to work with linear gradients and animations together
- Learned how to create an animation within text lettering
- Learned to work with range sliders
- Learned how to make a range slider fill on the left (or right side) in chrome using DOM and adjusting the width of a specific element as there is no equivalent of `::-ms-fill-lower` or `::-moz-range-progress`
- Learned a lot from trying to implement a fill mode in this project. This was by far the most difficult and time consuming aspect of the project. 
    - First was figuring out how to get adjacent cells and the recursively running the function again to on each of the 4 adjacent cells. Required numbering each cell during its creation with a unique id number.
    - Realized that recursion runs into a stack overflow and that I should instead run a single loop that records any adjacent cells while also painting the ones it encounters. See https://en.wikipedia.org/wiki/Flood_fill
    - Optimized it to remember each cell it visited to avoid looking through cells multiple times. 
    - Figured out how to detect edges of the grid, by using the id numbers of each cell and converting them into row/column format as if they were on a 2D grid. If a cell was on a specific edge, it would not have its neighbor added to be checked. 
- Learned about manipulating rgb colors for shading and tinting functionality.
- Learned a lot more about utilizing event listeners for interactive elements on the webpage. 
---
### Future features:
- A history of chosen colors visible to the user to select from. 
- An 'Undo' button or functionality. 
- Save/Download your custom made images directly from the site.