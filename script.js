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

const Board = () => {
  const size = 3;
  let rowCount = {};
  let colCount = {};
  let diagCountLeft = {};
  let diagCountRight = {};

  const totalCells = size * size;

  let board;

  const buildBoard = (size) => {
    return [...Array(size)].map(() => Array(size).fill(null).map(Cell));
  };

  const initScoring = () => {
    occupiedCells = 0;
    rowCount = {
      1: Array(size).fill(0),
      2: Array(size).fill(0),
    };

    colCount = {
      1: Array(size).fill(0),
      2: Array(size).fill(0),
    };

    diagCountLeft = {
      0: 0,
      1: 0,
      2: 0,
    };

    diagCountRight = {
      0: 0,
      1: 0,
      2: 0,
    };
  };
  const init = () => {
    board = buildBoard(size);
    initScoring();
  };

  const setBoard = (row, col, value) => {
    // coerce to number;
    console.log(`Set board: ${row}, ${col} to ${value}`);
    let r = +row;
    let c = +col;
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

    console.log(`${r} === ${size - 1 - c}`);
    if (r === size - 1 - c) {
      diagCountRight[value]++;
    }

    board[r][c].set(value);
    console.log(`Board ${r},${c} set to ${board[r][c].get()}`);
  };

  const getBoard = () => {
    return board;
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

  // const printBoard = () => {
  //   for (let r = 0; r < board.length; r++) {
  //     board[r].map((c) => {
  //       process.stdout.write(
  //         `|${c.get() === 0 ? " " : players[c.get()].getSymbol()}`,
  //       );
  //     });
  //     process.stdout.write("|\r\n");
  //   }
  // };
  const printBoard = () => {
    for (let r = 0; r < board.length; r++) {
      console.log(board[r]);
    }
  };

  return {
    size,
    getBoard,
    setBoard,
    printBoard,
    checkBoard,
    checkForWin,
    init,
  };
};

const Player = (playerName, playerSymbol) => {
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

const Controller = (board, players) => {
  const { CellValue } = Cell();

  let activePlayer = CellValue.PLAYER_1;

  let round = 1;

  const init = (() => {
    board.init();
    activePlayer = CellValue.PLAYER_1;
    round = 1;
  })();

  const playRound = (r, c) => {
    // check r, c is unoccupied
    if (board.checkBoard(r, c) !== CellValue.EMPTY) {
      console.error("Board position is occupied, please choose another cell");
      return;
    }
    if (board.checkBoard(r, c) === null) {
      console.error("Out of bounds. Please try again.");
      return;
    }

    console.log(`Playing round ${round}...`);
    console.log(`Active ${activePlayer}: ${players[activePlayer].getName()}`);
    board.setBoard(r, c, activePlayer);

    board.printBoard();
    let winVal = board.checkForWin();
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

  return { playRound, init };
};

const RenderInterface = (controller, board, players) => {
  const container = document.querySelector(".container");
  const size = board.size;
  const cells = [];

  const generateGrid = ((size) => {
    for (let r = 0; r < size; ++r) {
      let row = document.createElement("div");
      row.classList = "grid-row";
      row.id = `row-${r}`;
      for (let c = 0; c < size; ++c) {
        let cell = document.createElement("div");
        cell.classList = "grid-cell";
        cell.id = `cell-${r}-${c}`;
        cell.dataset.row = r;
        cell.dataset.col = c;
        row.appendChild(cell);
        cells.push(cell);
      }
      container.appendChild(row);
    }
  })(size);

  renderGrid = () => {
    // console.log("Render board", board);
    console.log("players", players);
    board.getBoard().map((row, r) =>
      row.map((col, c) => {
        let cell = document.querySelector(`#cell-${r}-${c}`);
        console.log(`Selector: #cell-${r}-${c}`);
        // console.log(`SYMBOL: ${col.get()}`, players[col.get()].getSymbol());

        cell.textContent = players[col.get()].getSymbol();
        console.log("Players: ", players[1].getSymbol());
        console.log("Col", col.get());
        // console.log("Cell", Cell);
        // console.log("Cell innerText", Cell.innerText);
      }),
    );
  };

  cells.map((cell) => {
    cell.addEventListener("click", (e) => {
      console.log(e.target.id);
      const row = e.target.dataset.row;
      const col = e.target.dataset.col;
      console.log("Controller", controller);
      controller.playRound(row, col);
      renderGrid();
    });
  });

  const resetInterface = () => {
    controller.resetController();
    renderGrid(controller.game.board, controller.players);
  };

  return {
    renderGrid,
    resetInterface,
  };
};

const startGame = () => {
  const player0 = Player("dummy", " ");
  let player1 = Player("Corbin", "C");
  let player2 = Player("Marco", "M");
  const players = [player0, player1, player2];
  let board = Board(players);
  let controller = Controller(board, players);
  let interface = RenderInterface(controller, board, players);
};

startGame();
// controller.playRound(1, 1);
// controller.playRound(0, 0);
// controller.playRound(1, 2);
// controller.playRound(2, 2);
// controller.playRound(2, 2);
// controller.playRound(1, 0);
//
// controller = Controller();
// controller.playRound(0, 2);
// controller.playRound(0, 0);
// controller.playRound(1, 1);
// controller.playRound(0, 1);
// controller.playRound(2, 0);
//
// // tie game
// controller = Controller();
// controller.playRound(0, 0);
// controller.playRound(1, 0);
// controller.playRound(2, 0);
// controller.playRound(1, 1);
// controller.playRound(0, 1);
// controller.playRound(2, 1);
// controller.playRound(1, 2);
// controller.playRound(0, 2);
// controller.playRound(2, 2);
