/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const DEFAULT_WIDTH = 7;
const DEFAULT_HEIGHT = 6;

let currentPlayer = 1; // active player: 1 or 2
const BOARD = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard(height = DEFAULT_HEIGHT, width = DEFAULT_WIDTH) {
	for (let i = 0; i < height; i++) {
		BOARD.push(new Array(width).fill(null));
	}
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
	const HTML_BOARD = document.getElementById("board");

	/* this area of code creates the top row of the game board
	that will let the user see which row they are currently 
	aiming at */
	const TOP = document.createElement("tr");
	TOP.setAttribute("id", "column-top");
	TOP.addEventListener("click", handleClick);

	/* this creates the columns for the top row that the game pieces 
	will be placed in */
	for (let x = 0; x < BOARD[0].length; x++) {
		const HEAD_CELL = document.createElement("td");
		HEAD_CELL.setAttribute("id", x);
		TOP.append(HEAD_CELL);
	}
	HTML_BOARD.append(TOP);

	/* this code creates the squares for each row of the 
	current column to fill in the rest of the game board */
	for (let y = 0; y < BOARD.length; y++) {
		const ROW = document.createElement("tr");
		for (let x = 0; x < BOARD[0].length; x++) {
			const CELL = document.createElement("td");
			CELL.setAttribute("id", `${y}-${x}`);
			CELL.classList.add(`cell`);
			ROW.append(CELL);
		}
		HTML_BOARD.append(ROW);
	}
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
	for (let i = BOARD.length - 1; i >= 0; i--) {
		if (!BOARD[i][x]) {
			return i;
		}
	}

	return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
	const NEW_PIECE = document.createElement("div");
	NEW_PIECE.classList.add("piece", `p${currentPlayer}`);
	const START_POS = -y * 100 - 150;
	NEW_PIECE.style.top = `${START_POS}%`;
	const BOARDDOM = document.getElementById("board");
	const ROW = BOARDDOM.children[y + 1];
	const TILE = ROW.children[x];
	TILE.append(NEW_PIECE);
}

/** endGame: announce game end */

function endGame(msg) {
	alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
	// get x from ID of clicked cell
	let x = +evt.target.id;

	// get next spot in column (if none, ignore click)
	let y = findSpotForCol(x);
	if (y) {
		// place piece in board and add to HTML table
		placeInTable(y, x);
		BOARD[y][x] = currentPlayer;

		// check for win
		const GAME_STATUS = checkForWin();
		const BOARD_STATUS = checkForFull();
		if (GAME_STATUS) {
			endGame(`Player ${currentPlayer} won!`);
		} // check for tie
		else if (BOARD_STATUS) {
			endGame(`It's a draw!`);
		} else {
			currentPlayer = currentPlayer == 1 ? 2 : 1;
		}
	}
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
	function _win(cells) {
		// Check four cells to see if they're all color of current player
		//  - cells: list of four (y, x) cells
		//  - returns true if all are legal coordinates & all match currentPlayer
		return cells.every(
			([y, x]) =>
				y >= 0 &&
				y < BOARD.length &&
				x >= 0 &&
				x < BOARD[0].length &&
				BOARD[y][x] === currentPlayer
		);
	}

	// loops through each row of the array/matrix
	for (let y = 0; y < BOARD[0].length; y++) {
		// loops each item of the array/matrix
		for (let x = 0; x < BOARD[1].length; x++) {
			// this creates an array of horizontal pieces
			let horiz = [
				[y, x],
				[y, x + 1],
				[y, x + 2],
				[y, x + 3],
			];
			// this creates an array of vertical pieces
			let vert = [
				[y, x],
				[y + 1, x],
				[y + 2, x],
				[y + 3, x],
			];
			// this creates an array of diagonally down right pieces
			let diagDR = [
				[y, x],
				[y + 1, x + 1],
				[y + 2, x + 2],
				[y + 3, x + 3],
			];
			// this creates an array of diagonally down left pieces
			let diagDL = [
				[y, x],
				[y + 1, x - 1],
				[y + 2, x - 2],
				[y + 3, x - 3],
			];

			if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
				return true;
			}
		}
	}
}

const checkForFull = () => {
	return BOARD.every((row) => row.every((cell) => cell !== null));
};

makeBoard();
makeHtmlBoard();
