import GameBoard from "../modules/gameBoard";
import Ship from "../modules/ship";

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

test("GameBoard places a ship properly", () => {
  const gameBoard = GameBoard();
  const board = gameBoard.fetchBoard();
  const newShip = Ship(3);
  expect(gameBoard.placeShip(0, 0, newShip)).toBe(true);
  expect(board[0][0]).toEqual(newShip);
  expect(board[0][1]).toEqual(newShip);
  expect(board[0][2]).toEqual(newShip);
});

test("Ship start position validity check", () => {
  const gameBoard = GameBoard(10);
  const newShip = Ship(3);
  expect(gameBoard.placeShip(-1, 0, newShip)).toBe(false);
  expect(gameBoard.placeShip(0, -2, newShip)).toBe(false);
  expect(gameBoard.placeShip(-1, -2, newShip)).toBe(false);
});
