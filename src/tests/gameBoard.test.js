import GameBoard from "../modules/gameBoard";

test("Returns a board with default size", () => {
  const gameBoard = GameBoard();
  const board = gameBoard.fetchBoard();
  expect(board.length).toBe(10);
  expect(board.every((row) => row.length === 10)).toBe(true);
});

test("Returns a board with custom size", () => {
  const gameBoard = GameBoard(15);
  const board = gameBoard.fetchBoard();
  expect(board.length).toBe(15);
  expect(board.every((row) => row.length === 15)).toBe(true);
});

test("Board cells are null", () => {
  const gameBoard = GameBoard();
  const board = gameBoard.fetchBoard();
  expect(board.length).toBe(10);
  expect(board.every((row) => row.length === 10)).toBe(true);
  expect(board.every((row) => row.every((cell) => cell === null))).toBe(true);
});
