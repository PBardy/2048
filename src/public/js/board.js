import { inRange, randInt } from './util.js';
 
export class Board {

  grid = [];

  constructor(domElement) {
    this.domElement = domElement;
  }

  isFull() {
    let count = 0;
    for(let r = 1; r < 5; r++) {
      for(let c = 1; c < 5; c++) {
        if(this.grid[r][c]) (count++);
      }
    }
    
    return count === 16;
  }

  isOccupied(row, column) {
    if(!inRange(row, 1, 4)) return false;
    if(!inRange(column, 1, 4)) return false;
    if(this.grid[row] == null) return false;
    return this.grid[row][column];
  }

  getRandomUnoccupiedPositon() {
    if(this.isFull()) return false;
    let i = 0;
    let maxTries = 50;
    let randRow = randInt(1, 4);
    let randColumn = randInt(1, 4);
    while(i++ < maxTries) {
      randRow = randInt(1, 4);
      randRow = randInt(1, 4);
      if(!this.isOccupied(randRow, randColumn)) {
        return { row: randRow, column: randColumn }
      }
    }
    
    for(let r = 1; r < 5; r++) {
      for(let c = 1; c < 5; c++) {
        if(!this.grid[r][c]) {
          return {row: r, column: c };
        }
      }
    }

  }

  winConditionFulfilled() {
    return this.maxTile === 2048;
  }

  removeTile(row, column) {
    const id = `[data-pos='(${row}, ${column})']`;
    const block = this.domElement.querySelector(id);
    this.domElement.removeChild(block);
  }

  createTile(row, column, value) {
    const index = ((row - 1) * 4) + (column - 1);
    const above = this.domElement.children[index];
    const rect = above.getBoundingClientRect();
    const div = document.createElement('div');
    div.classList.add(`block`);
    div.classList.add(`block--new`);
    div.classList.add(`block--${value}`);
    div.innerHTML = value;
    div.style.gridRow = row;
    div.style.gridColumn = column;
    div.style.top = `${rect.y}px`;
    div.style.left = `${rect.x}px`;
    div.style.width = `${rect.width}px`;
    div.style.height = `${rect.height}px`;
    div.setAttribute('data-pos', `(${row}, ${column})`);
    this.domElement.appendChild(div);
    this.grid[row][column] = value;
  }

  moveTile(row, column, nextRow, nextCol, value) {
    const index = ((nextRow - 1) * 4) + (nextCol - 1);
    const target = this.domElement.children[index];
    const rect = target.getBoundingClientRect();
    const id = `[data-pos='(${row}, ${column})']`;
    const block = this.domElement.querySelector(id);
    block.setAttribute('data-pos', `(${nextRow}, ${nextCol})`);
    block.style.transition = "all 0.2s ease";
    block.style.top = `${rect.y}px`;
    block.style.left = `${rect.x}px`;
    if(value == null) return;
    block.innerHTML = value;
    block.classList.add(`block--${value}`);
  }

  createEmptyTile(row, column) {
    const div = document.createElement('div');
    div.classList.add('cell');
    div.style.gridRow = row;
    div.style.gridColumn = column;
    this.grid[row][column] = false;
    this.domElement.appendChild(div);
  }

  shift(deltaRow, deltaCol) {

    let pointsToAdd = 0;

    for(let i = 0; i < 4; i++) {
      for(let row = 1; row < 5; row++) {
        for(let col = 1; col < 5; col++) {
          const position = this.grid[row][col];
          if(position) {
            const nextRow = row + deltaRow;
            const nextCol = col + deltaCol;
            if(nextRow > 4 || nextRow < 1) continue;
            if(nextCol > 4 || nextCol < 1) continue;
            const adjacent = this.grid[nextRow][nextCol];
            if(adjacent === position) {
              this.grid[row][col] = false;
              this.grid[nextRow][nextCol] = position * 2;
              this.removeTile(nextRow, nextCol);
              this.moveTile(row, col, nextRow, nextCol, position * 2);
              if(position * 2 > this.maxTile) (this.maxTile = position * 2);
              pointsToAdd = (position * 2);
            } else if(!adjacent) {
              this.grid[row][col] = false;
              this.grid[nextRow][nextCol] = position;
              this.moveTile(row, col, nextRow, nextCol);
            }
          }
        }
      } 
    }
    this.spawnRandomTile();
    return pointsToAdd;
  }

  spawnRandomTile() {
    const position = this.getRandomUnoccupiedPositon();
    if(!position) return;
    const { row, column } = position;
    this.createTile(row, column, 2);
  }

  setInitialState() {
    this.maxTile = 2;
    this.spawnRandomTile();
    this.spawnRandomTile();
  }

  create() {
    for(let r = 1; r < 5; r++) {
      this.grid[r] = [];
      for(let c = 1; c < 5; c++) {
        this.createEmptyTile(r, c);
      }
    }
  }

}