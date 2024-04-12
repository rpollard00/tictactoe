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

const Board = (size = 3) => {
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

  // init on load
  init();

  const setBoard = (row, col, value) => {
    // coerce to number;
    // console.log(`Set board: ${row}, ${col} to ${value}`);
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

    // console.log(`${r} === ${size - 1 - c}`);
    if (r === size - 1 - c) {
      diagCountRight[value]++;
    }

    board[r][c].set(value);
    // console.log(`Board ${r},${c} set to ${board[r][c].get()}`);
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

  let gameOver = false;
  let activePlayer = CellValue.PLAYER_1;

  let round = 1;

  const init = () => {
    // board.init();
    gameOver = false;
    activePlayer = CellValue.PLAYER_1;
    round = 1;
  };

  // init on creation but, allos init to be exported as a method and recycled
  init();

  const playRound = (r, c) => {
    if (gameOver) {
      console.log("Game is over");
      return;
    }
    // check r, c is unoccupied
    if (board.checkBoard(r, c) !== CellValue.EMPTY) {
      console.error("Board position is occupied, please choose another cell");
      return;
    }
    if (board.checkBoard(r, c) === null) {
      console.error("Out of bounds. Please try again.");
      return;
    }

    // console.log(`Playing round ${round}...`);
    // console.log(`Active ${activePlayer}: ${players[activePlayer].getName()}`);
    board.setBoard(r, c, activePlayer);

    // board.printBoard();
    let winVal = board.checkForWin();
    if (winVal > 0) {
      gameOver = true;
    }
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

  const getActivePlayer = () => {
    return activePlayer;
  };

  const isGameOver = () => gameOver;

  return { playRound, init, isGameOver, getActivePlayer };
};

const Interface = (controller, board, players) => {
  const size = board.size;
  const cells = [];

  const generateGrid = ((size) => {
    const container = document.querySelector(".container");
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
    board.getBoard().map((row, r) =>
      row.map((col, c) => {
        let cell = document.querySelector(`#cell-${r}-${c}`);
        cell.textContent = players[col.get()].getSymbol();
      }),
    );
  };
  renderActive = () => {
    const active = controller.getActivePlayer();
    console.log("Active is", active);
    const inactive = active === 1 ? 2 : 1;

    const activeHeader = document.querySelector(`#player-${active}-name`);
    const inactiveHeader = document.querySelector(`#player-${inactive}-name`);
    activeHeader.classList.add("active-player");
    inactiveHeader.classList.remove("active-player");

    const banner = document.querySelector(`#banner`);
    if (controller.isGameOver()) {
      let winner = board.checkForWin();
      banner.classList.remove("hidden");
      if (winner === 1 || winner === 2) {
        banner.textContent = `Player ${winner} wins!`;
      } else {
        banner.textContent = "Game ended in a draw!";
      }
    } else {
      banner.classList.add("hidden");
    }
  };

  cells.map((cell) => {
    cell.addEventListener("click", (e) => {
      const row = e.target.dataset.row;
      const col = e.target.dataset.col;
      controller.playRound(row, col);
      renderActive();
      renderGrid();
    });
  });

  const resetInterface = () => {
    let container = document.querySelector(".container");
    console.log(container.children);
  };

  return {
    renderGrid,
    resetInterface,
    renderActive,
  };
};

const Game = () => {
  const player0 = Player("dummy", " ");
  let player1 = Player("Player1", "X");
  let player2 = Player("Player2", "O");
  const players = [player0, player1, player2];
  let board = Board();
  let controller = Controller(board, players);
  let interface = Interface(controller, board, players);

  const restartGame = () => {
    board.init();
    controller.init();
    interface.renderActive();
    interface.renderGrid();
  };

  const initUI = (() => {
    newGame = document.querySelector("#new-game-button");
    newGame.addEventListener("click", () => {
      restartGame();
    });

    player1NameHeader = document.querySelector("#player-1-name");
    player1NameHeader.textContent = player1.getName();
    player2NameHeader = document.querySelector("#player-2-name");
    player2NameHeader.textContent = player2.getName();
    player1Button = document.querySelector("#player-1-button");
    player2Button = document.querySelector("#player-2-button");

    player1Button.addEventListener("click", () => {
      player1Input = document.querySelector("#player-1-input");
      player1.setName(player1Input.value);
      player1NameHeader.textContent = player1.getName();
      player1Input.textContent = "";
    });

    player2Button.addEventListener("click", () => {
      player2Input = document.querySelector("#player-2-input");
      player2.setName(player2Input.value);
      player2NameHeader.textContent = player2.getName();
      player2Input.textContent = "";
    });

    interface.renderActive();
  })();
  return { restartGame };
};

let game = Game();
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
