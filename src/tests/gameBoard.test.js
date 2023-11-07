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

test("Board cells are null initially ", () => {
  const gameBoard = GameBoard();
  const board = gameBoard.fetchBoard();
  expect(board.length).toBe(10);
  expect(board.every((row) => row.length === 10)).toBe(true);
  expect(board.every((row) => row.every((cell) => cell === null))).toBe(true);
});

test("(horizontal) GameBoard places a ship properly", () => {
  const gameBoard = GameBoard();
  const board = gameBoard.fetchBoard();
  const newShip = Ship(3);
  expect(gameBoard.placeShip(0, 0, newShip)).toBe(true);
  expect(board[0][0]).toEqual(newShip);
  expect(board[0][1]).toEqual(newShip);
  expect(board[0][2]).toEqual(newShip);
});

test("(horizontal) Ship start position validity check", () => {
  const gameBoard = GameBoard(10);
  const newShip = Ship(3);
  expect(gameBoard.placeShip(-1, 0, newShip)).toBe(false);
  expect(gameBoard.placeShip(0, -2, newShip)).toBe(false);
  expect(gameBoard.placeShip(-1, -2, newShip)).toBe(false);
});

test("(horizontal) Ending position validity of ships", () => {
  const gameBoard = GameBoard(10);
  const newShip = Ship(3);
  expect(gameBoard.placeShip(1, 7, newShip)).toBe(false);
  expect(gameBoard.placeShip(7, 15, newShip)).toBe(false);
  expect(gameBoard.placeShip(-1, 10, newShip)).toBe(false);
});

test("(horizontal) Cannot place ship if position is already taken", () => {
  const gameBoard = GameBoard(10);
  const newShip = Ship(3);
  expect(gameBoard.placeShip(1, 1, newShip)).toBe(true);
  const newShip2 = Ship(4);
  expect(gameBoard.placeShip(1, 1, newShip2)).toBe(false);
});

test("(horizontal) Cannot place ship if neighbouring positions are already taken", () => {
  const gameBoard = GameBoard(10);
  const newShip = Ship(3);
  expect(gameBoard.placeShip(2, 5, newShip)).toBe(true);
  const newShip2 = Ship(4);
  expect(gameBoard.placeShip(2, 0, newShip2)).toBe(true);
  expect(gameBoard.placeShip(2, 0, newShip2)).toBe(false);
  expect(gameBoard.placeShip(3, 1, newShip2)).toBe(false);
});

test("(vertical) GameBoard places a ship properly", () => {
  const gameBoard = GameBoard();
  const board = gameBoard.fetchBoard();
  const newShip = Ship(3);
  expect(gameBoard.placeShip(0, 0, newShip, true)).toBe(true);
  expect(board[0][0]).toEqual(newShip);
  expect(board[1][0]).toEqual(newShip);
  expect(board[2][0]).toEqual(newShip);
});

test("(vertical) Ending position validity of ship", () => {
  const gameBoard = GameBoard(10);
  const newShip = Ship(3);
  expect(gameBoard.placeShip(7, 1, newShip, true)).toBe(false);
  expect(gameBoard.placeShip(15, 7, newShip, true)).toBe(false);
  expect(gameBoard.placeShip(10, -1, newShip, true)).toBe(false);
});

test("(vertical) Cannot place ship if position is already taken", () => {
  const gameBoard = GameBoard(10);
  const newShip = Ship(3);
  expect(gameBoard.placeShip(1, 1, newShip, true)).toBe(true);
  const newShip2 = Ship(4);
  expect(gameBoard.placeShip(3, 1, newShip2, true)).toBe(false);
});

test("(vertical) Cannot place ship if neighbouring positions are already taken", () => {
  const gameBoard = GameBoard(10);
  const newShip = Ship(3);
  expect(gameBoard.placeShip(4, 2, newShip, true)).toBe(true);
  const newShip2 = Ship(4);
  expect(gameBoard.placeShip(0, 2, newShip2, true)).toBe(false);
  expect(gameBoard.placeShip(1, 3, newShip2, true)).toBe(false);
  expect(gameBoard.placeShip(1, 1, newShip2, true)).toBe(false);
});
