// Game - IIFE
const newGame = (() => {
  const size = 3;

  const newBoard = (size) => {
    return [...Array(size)].map(() => Array(size).fill(""));
  };

  const board = newBoard(size);

  const setBoard = (r, c, value) => {
    if (r < 0 || r >= size || c < 0 || c >= size) {
      console.error("Invalid board position");
      return;
    }

    board[r][c] = value;
  };

  return {
    board,
    setBoard,
  };
})();

const game = newGame;
game.setBoard(0, 0, "X");
console.log(game.board);
// Display - IIFE
// Player
