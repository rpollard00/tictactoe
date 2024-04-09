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

  const board = ((size) => {
    return [...Array(size)].map(() => Array(size).fill(null).map(Cell));
  })(size);

  const setBoard = (r, c, value) => {
    if (r < 0 || r >= size || c < 0 || c >= size) {
      console.error("Invalid board position");
      return;
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

const controller = Controller();
controller.playRound(1, 1);
controller.playRound(0, 0);
controller.playRound(1, 2);
controller.playRound(2, 2);
controller.playRound(2, 2);
controller.playRound(1, 0);
