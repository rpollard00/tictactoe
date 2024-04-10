// Game - IIFE
const Cell = () => {
  const CellValue = {
    EMPTY: 0,
    PLAYER_1: 1,
    PLAYER_2: 2,
  };

  let value = CellValue.EMPTY;

  const set = (v) => (value = v);
  const get = () => value;

  return {
    set,
    get,
    CellValue,
  };
};

const newBoard = (players) => {
  const size = 3;
  const rowCount = {
    1: Array(size).fill(0),
    2: Array(size).fill(0),
  };

  const colCount = {
    1: Array(size).fill(0),
    2: Array(size).fill(0),
  };

  const diagCountLeft = {
    0: 0,
    1: 0,
    2: 0,
  };

  const diagCountRight = {
    0: 0,
    1: 0,
    2: 0,
  };
  const totalCells = size * size;
  let occupiedCells = 0;

  const board = ((size) => {
    return [...Array(size)].map(() => Array(size).fill(null).map(Cell));
  })(size);

  const setBoard = (r, c, value) => {
    if (r < 0 || r >= size || c < 0 || c >= size) {
      console.error("Invalid board position");
      return;
    }

    occupiedCells++;
    rowCount[value][r]++;
    colCount[value][c]++;

    // handle diagonals
    if (r === c) {
      diagCountLeft[value]++;
    }

    if (r === size - 1 - c) {
      diagCountRight[value]++;
    }

    board[r][c].set(value);
  };

  const checkBoard = (r, c) => {
    if (r < 0 || r >= size || c < 0 || c >= size) {
      console.error("Invalid board position");
      return null;
    }
    return board[r][c].get();
  };

  const checkForWin = () => {
    if (diagCountLeft[1] === size || diagCountRight[1] === size) {
      return 1;
    }
    if (diagCountLeft[2] === size || diagCountRight[2] === size) {
      return 2;
    }
    for (let i = 0; i < size; i++) {
      if (colCount[1][i] === size || rowCount[1][i] === size) {
        return 1;
      } else if (colCount[2][i] === size || rowCount[2][i] === size) {
        return 2;
      }
    }

    // no winner
    if (occupiedCells === totalCells) {
      return 3;
    }
  };

  const printBoard = () => {
    for (let r = 0; r < board.length; r++) {
      board[r].map((c) => {
        process.stdout.write(
          `|${c.get() === 0 ? " " : players[c.get()].getSymbol()}`,
        );
      });
      process.stdout.write("|\r\n");
    }
  };

  return {
    board,
    setBoard,
    printBoard,
    checkBoard,
    checkForWin,
  };
};

const newPlayer = (playerName, playerSymbol) => {
  let name = "";
  let symbol = "";

  const setName = (newName) => {
    if (typeof newName !== "string" || newName.trim().length === 0) {
      throw new Error("Name must be a non-empty string");
    }

    name = newName.trim();
  };

  const getName = () => {
    return name;
  };

  const setSymbol = (newSymbol) => {
    if (typeof newSymbol !== "string" || newSymbol.trim().length > 1) {
      throw new Error("Invalid player symbol, must be length 1.");
    }
    symbol = newSymbol.trim();
  };

  const getSymbol = () => {
    return symbol;
  };

  setName(playerName);
  setSymbol(playerSymbol);

  return {
    setName,
    getName,
    getSymbol,
    setSymbol,
  };
};

const Controller = () => {
  const player1 = newPlayer("Corbin", "C");
  const player2 = newPlayer("Marco", "M");
  const players = [null, player1, player2];
  const { CellValue } = Cell();

  const game = newBoard(players);

  let activePlayer = CellValue.PLAYER_1;
  let round = 1;

  const playRound = (r, c) => {
    // check r, c is unoccupied
    if (game.checkBoard(r, c) !== CellValue.EMPTY) {
      console.error("Board position is occupied, please choose another cell");
      return;
    }
    if (game.checkBoard(r, c) === null) {
      console.error("Out of bounds. Please try again.");
      return;
    }

    console.log(`Playing round ${round}...`);
    console.log(`Active ${activePlayer}: ${players[activePlayer].getName()}`);
    game.setBoard(r, c, activePlayer);

    game.printBoard();
    let winVal = game.checkForWin();
    if (winVal === 3) {
      console.log("Game ended in a tie.");
      return;
    }
    if (winVal === 1 || winVal === 2) {
      console.log(`Game won by ${winVal}`);
      return;
    }

    switchActivePlayer();

    ++round;
  };

  const switchActivePlayer = () => {
    activePlayer =
      activePlayer === CellValue.PLAYER_1
        ? CellValue.PLAYER_2
        : CellValue.PLAYER_1;
  };

  game.printBoard();
  return { playRound };
};

let controller = Controller();
controller.playRound(1, 1);
controller.playRound(0, 0);
controller.playRound(1, 2);
controller.playRound(2, 2);
controller.playRound(2, 2);
controller.playRound(1, 0);

controller = Controller();
controller.playRound(0, 2);
controller.playRound(0, 0);
controller.playRound(1, 1);
controller.playRound(0, 1);
controller.playRound(2, 0);

// tie game
controller = Controller();
controller.playRound(0, 0);
controller.playRound(1, 0);
controller.playRound(2, 0);
controller.playRound(1, 1);
controller.playRound(0, 1);
controller.playRound(2, 1);
controller.playRound(1, 2);
controller.playRound(0, 2);
controller.playRound(2, 2);
