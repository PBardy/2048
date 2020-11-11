import { padStart, setCookie, getCookie } from './util.js';
import { Board } from './board.js';

let xDown = null;
let yDown = null;

let score = 0;
let bestScore = 0;

let board;
let scoreEl;
let gameBoard;
let bestScoreEl;
let newGameButton;

function handleTouchEnd(event) {
  if (board.isFull()) return showEndScreen(); // game ended
  if (!xDown || !yDown) return;

  const xUp = event.changedTouches[0].clientX; // calculate swipe direction
  const yUp = event.changedTouches[0].clientY;
  const xDiff = xDown - xUp;
  const yDiff = yDown - yUp; 

  if (Math.abs(xDiff) >= Math.abs(yDiff)) (xDiff > 0) ? shift(0, -1) : shift(0, 1); // shift tiles based on grid direction.
  if (Math.abs(xDiff) <= Math.abs(yDiff)) (yDiff > 0) ? shift(-1, 0) : shift(1, 0);

  if (board.winConditionFulfilled()) return showEndScreen();

  xDown = null; // reset positions for next swipe
  yDown = null;

  scoreEl.innerHTML = padStart(score, '0', 4); // update score after each swipe
  bestScoreEl.innerHTML = padStart(bestScore, '0', 4);

}

// record position of cursor/pointer at first touch
function handleTouchStart(event) {
  event.preventDefault();
  const firstTouch = event.touches[0];
  xDown = firstTouch.clientX;
  yDown = firstTouch.clientY;
}

// on resize, reposition tiles to their equivalent position (as they
// are styled so that they're positoned absolutely).
function onResize(event) {
  const cell = document.querySelector('.cell')
  const rect = cell.getBoundingClientRect()
  const blocks = Array.from(document.querySelectorAll('.block'))
  blocks.forEach(block => {
    const pos = block.getAttribute('data-pos')
    const split = pos.split(',')
    const row = Number.parseInt(split[0].charAt(1), 10)
    const col = Number.parseInt(split[1].charAt(1), 10)
    const value = Number.parseInt(block.innerHTML, 10)
    block.style.width = rect.width + 'px'
    block.style.height = rect.height + 'px'
    board.moveTile(row, col, row, col, value)
  })
}

function start() {
  score = 0;
  scoreEl.innerHTML = padStart(score, '0', 4);
  gameBoard.innerHTML = ""; // clear the board

  board = new Board(gameBoard); // create an empty board
  board.create();
  board.setInitialState(); // add starting tiles

  window.addEventListener('resize', onResize, false); // listen for events
  window.addEventListener('keyup', onKeypress, false);
  window.addEventListener('touchend', handleTouchEnd, false);
  window.addEventListener('touchstart', handleTouchStart, false);
}

// end screen shows when page1 is active. So force this with JS.
function showEndScreen() {
  window.location.href = '#page1';
}

// after shifting tiles, update score variables
function shift(deltaRow, deltaCol) {
  score += board.shift(deltaRow, deltaCol);
  if (score > bestScore) {
    bestScore = score;
    setCookie('bestScore', bestScore, 30);
  }
}

// handle keypresses
function onKeypress(event) {
  if (board.isFull()) return showEndScreen(); // game ended
  if (event.keyCode === 87 || event.keyCode === 38) shift(-1, 0); // UP
  if (event.keyCode === 65 || event.keyCode === 37) shift(0, -1); // LEFT
  if (event.keyCode === 83 || event.keyCode === 40) shift(1, 0);  // DOWN
  if (event.keyCode === 68 || event.keyCode === 39) shift(0, 1);  // RIGHT
  if (board.winConditionFulfilled()) return showEndScreen();

  scoreEl.innerHTML = padStart(score, '0', 4); // if game hasn't ended, update scores on screen after keypress
  bestScoreEl.innerHTML = padStart(bestScore, '0', 4);
}

// start the game when the 'new game' button is clicked
function addEventListeners() {
  newGameButton.addEventListener('click', start, false);
}

// Set up the initial UI screen
function initUI() {
  bestScore = getCookie('bestScore'); // get the best score from a cookie
  scoreEl = document.getElementById('score');
  gameBoard = document.getElementById('board');
  bestScoreEl = document.getElementById('best-score');
  newGameButton = document.getElementById('new-game');
  bestScoreEl.innerHTML = padStart(bestScore, '0', 4);
}

initUI();
addEventListeners();