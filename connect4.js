/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const DEFAULTWIDTH = 7;
const DEFAULTHEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard(height, width) {
	/* These lines check if a value was passed into the array
	 if not the height and width are set to the default values */
	if (!height) height = DEFAULTHEIGHT;
	if (!width) width = DEFAULTWIDTH;
	for (let i = 0; i < height; i++) board.push(new Array(width).fill(null));
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
	const htmlBoard = document.getElementById("board");

	/* this area of code creates the top row of the game board
	that will let the user see which row they are currently 
	aiming at */
	let top = document.createElement("tr");
	top.setAttribute("id", "column-top");
	top.addEventListener("click", handleClick);

	/* this creates the columns for the top row that the game pieces 
	will be placed in */
	for (let x = 0; x < board[0].length; x++) {
		let headCell = document.createElement("td");
		headCell.setAttribute("id", x);
		top.append(headCell);
	}
	htmlBoard.append(top);

	/* this code creates the squares for each row of the 
	current column to fill in the rest of the game board */
	for (let y = 0; y < board.length; y++) {
		const row = document.createElement("tr");
		for (let x = 0; x < board[0].length; x++) {
			const cell = document.createElement("td");
			cell.setAttribute("id", `${y}-${x}`);
			cell.classList.add(`cell`);
			row.append(cell);
		}
		htmlBoard.append(row);
	}
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

function findSpotForCol(x) {
	// TODO: write the real version of this, rather than always returning 0

	// console.log(
	// 	document.getElementsByClassName(`col-${x}`),
	// 	Array.prototype.slice
	// 		.call(document.getElementsByClassName(`col-${x}`))
	// 		.map((cell) => cell.innerText),
	// 	board
	// );
	console.log(board);
	for (let i = board.length - 1; i >= 0; i--) {
		if (!board[i][x]) return i;
		// console.log(board[i][x]);
	}

	return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
	let newPiece = document.createElement("div");
	newPiece.classList.add("piece", `p${currPlayer}`, `row${y}`);
	document
		.getElementById("board")
		.children[y + 1].children[x].append(newPiece);
}

/** endGame: announce game end */

function endGame(msg) {
	// TODO: pop up alert message
	alert(msg);
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
	// get x from ID of clicked cell
	let x = +evt.target.id;

	// get next spot in column (if none, ignore click)
	let y = findSpotForCol(x);
	if (y === null) {
		return;
	}

	// place piece in board and add to HTML table
	// TODO: add line to update in-memory board
	placeInTable(y, x);
	board[y][x] = currPlayer;

	// check for win
	if (checkForWin()) return endGame(`Player ${currPlayer} won!`);

	// check for tie
	if (!checkForWin() && checkForFull()) return endGame(`It's a draw!`);

	// switch players
	currPlayer = currPlayer == 1 ? 2 : 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
	function _win(cells) {
		// Check four cells to see if they're all color of current player
		//  - cells: list of four (y, x) cells
		//  - returns true if all are legal coordinates & all match currPlayer
		return cells.every(
			([y, x]) =>
				y >= 0 &&
				y < board.length &&
				x >= 0 &&
				x < board[0].length &&
				board[y][x] === currPlayer
		);
	}

	// TODO: read and understand this code. Add comments to help you.
	// loops through each row of the array/matrix
	for (let y = 0; y < board[0].length; y++) {
		// loops each item of the array/matrix
		for (let x = 0; x < board[1].length; x++) {
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
	return board.every((row) => row.every((cell) => cell !== null));
};

makeBoard();
makeHtmlBoard();
