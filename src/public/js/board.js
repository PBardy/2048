import { inRange, randInt } from './util.js';

export class Board {

  grid = [];

  constructor(domElement) {
    this.domElement = domElement;
  }

  // Iterate through all columns to determine if there is value
  // in the board array at that position. If so, update the count. 
  isFull() {
    let count = 0;
    for (let r = 1; r < 5; r++) {
      for (let c = 1; c < 5; c++) {
        if (this.grid[r][c]) (count++);
      }
    }

    return count === 16; // a count of 16 indicates the board is full.
  }

  // Return value at a given position in the board array. A value
  // other than false indicates a tile.
  isOccupied(row, column) {
    if (!inRange(row, 1, 4)) return false; // guard against invalid call parameters
    if (!inRange(column, 1, 4)) return false;
    if (this.grid[row] == null) return false;
    return this.grid[row][column];
  }

  getRandomUnoccupiedPositon() {
    if (this.isFull()) return false;
    let i = 0;
    let maxTries = 50;
    let randRow = randInt(1, 4); // pick random coords
    let randColumn = randInt(1, 4);
    while (i++ < maxTries) {
      randRow = randInt(1, 4);
      randRow = randInt(1, 4);
      if (!this.isOccupied(randRow, randColumn)) { // if position is unoccupied return coords
        return { row: randRow, column: randColumn }
      }
    }

    // if, after 50 tries, we didn't find an empty tile randomly, simply search for it.
    for (let r = 1; r < 5; r++) { 
      for (let c = 1; c < 5; c++) {
        if (!this.grid[r][c]) {
          return { row: r, column: c };
        }
      }
    }

  }

  winConditionFulfilled() {
    return this.maxTile === 2048;
  }

  // Remove the domElement of the tile, at the given position.
  removeTile(row, column) {
    const id = `[data-pos='(${row}, ${column})']`;
    const block = this.domElement.querySelector(id);
    this.domElement.removeChild(block);
  }

  // Creates the domElement of a tile, and places it on the board
  // at its given position.
  createTile(row, column, value) {

    // we use display: grid for the board, so we must first calculate the index
    // the tile will occupy as a child node
    const index = ((row - 1) * 4) + (column - 1); 

    /**
     * To enable animation of tiles, all tiles are absolutely positioned.
     * By using the relatively positoned grid tile (the light grey tile)
     * below we can dynamically fix tiles in position, even when the viewport
     * changes size (this fixes a bug where tiles would not line up with the grid).
     */
    const above = this.domElement.children[index];
    const rect = above.getBoundingClientRect();
    const div = document.createElement('div'); // create the tile element
    div.classList.add(`block`);
    div.classList.add(`block--new`);
    div.classList.add(`block--${value}`);
    div.innerHTML = value;
    div.style.gridRow = row; // position in the grid layout
    div.style.gridColumn = column;
    div.style.top = `${rect.y}px`; // ensure it is fixed to the grid layout
    div.style.left = `${rect.x}px`;
    div.style.width = `${rect.width}px`;
    div.style.height = `${rect.height}px`;
    div.setAttribute('data-pos', `(${row}, ${column})`); // store its row and column as an attribute
    this.domElement.appendChild(div);
    this.grid[row][column] = value; // update the board array
  }

  // Animate the movement of the tile, from one position to the other.
  moveTile(row, column, nextRow, nextCol, value) {
    const index = ((nextRow - 1) * 4) + (nextCol - 1);
    const target = this.domElement.children[index]; // get the target grid position (so we know where on screen to move the tile to).
    const rect = target.getBoundingClientRect();
    const id = `[data-pos='(${row}, ${column})']`;
    const block = this.domElement.querySelector(id);
    block.setAttribute('data-pos', `(${nextRow}, ${nextCol})`); // update its position on the attribute
    block.style.transition = "all 0.2s ease";
    block.style.top = `${rect.y}px`; // update the tile's position
    block.style.left = `${rect.x}px`;
    if (value == null) return;
    block.innerHTML = value;
    block.classList.add(`block--${value}`); // add a tile value class (to style it the appropriate colour)
  }

  // Creates the light grey tiles which go behind the tiles
  // with points on them. 
  createEmptyTile(row, column) {
    const div = document.createElement('div');
    div.classList.add('cell');
    div.style.gridRow = row;
    div.style.gridColumn = column;
    this.grid[row][column] = false;
    this.domElement.appendChild(div);
  }

  shift(deltaRow, deltaCol) {

    let pointsToAdd = 0; // calculate number of points to add after a swipe

    // iterate through the board four times, as each tile can move
    // a maximum of 4 positions (if stacking) ...
    for (let i = 0; i < 4; i++) { 
      for (let row = 1; row < 5; row++) { 
        for (let col = 1; col < 5; col++) {
          const position = this.grid[row][col]; 
          // if there is a tile at the given position
          if (position) { 
            const nextRow = row + deltaRow; // calculate its next position
            const nextCol = col + deltaCol;
            if (nextRow > 4 || nextRow < 1) continue; // ignore if the next pos is outside the grid
            if (nextCol > 4 || nextCol < 1) continue;
            const adjacent = this.grid[nextRow][nextCol];
            // if the tile adjacent (in the swiped direction) is of the same value as the
            // tile being moved ...
            if (adjacent === position) {
              this.grid[row][col] = false;
              this.grid[nextRow][nextCol] = position * 2; // double its value (as the tiles stack)
              this.removeTile(nextRow, nextCol); // remove the other dom element of the tile it's stacking on
              this.moveTile(row, col, nextRow, nextCol, position * 2); // move the current tile
              if (position * 2 > this.maxTile) (this.maxTile = position * 2); // update maxtile if its greater than the current
              pointsToAdd = (position * 2); // update points
            } 
            // if the tile adjacent is empty, just move and don't stack
            else if (!adjacent) {
              this.grid[row][col] = false;
              this.grid[nextRow][nextCol] = position;
              this.moveTile(row, col, nextRow, nextCol);
            }
          }
        }
      }
    }

    this.spawnRandomTile(); // add a new tile after each move
    return pointsToAdd;
  }

  // Creates a tile at a random, unoccupied position.
  spawnRandomTile() {
    const position = this.getRandomUnoccupiedPositon();
    if (!position) return;
    const { row, column } = position;
    this.createTile(row, column, 2);
  }

  // Set up the initial state by spawning two random tiles
  // of value 2. 
  setInitialState() {
    this.maxTile = 2;
    this.spawnRandomTile();
    this.spawnRandomTile();
  }

  // Create the grid of DOM elements tiles, as well as
  // the 2d array of tile positions.
  create() {
    for (let r = 1; r < 5; r++) {
      this.grid[r] = [];
      for (let c = 1; c < 5; c++) {
        this.createEmptyTile(r, c);
      }
    }
  }

}