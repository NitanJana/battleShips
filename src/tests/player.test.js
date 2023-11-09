import Player from "../modules/player";
import GameBoard from "../modules/gameBoard";

let player1;
let gameBoard;

beforeEach(() => {
  player1 = Player("player1");
  gameBoard = GameBoard();
});

test("player factory returns a valid Player object", () => {
  expect(player1.getName()).toBe("player1");
});

test("player cannot attack same cell twice", () => {
  expect(player1.attack(4, 2, gameBoard)).toBe(true);
  expect(player1.attack(4, 2, gameBoard)).toBe(false);
});

test("player cannot attack invalid cell", () => {
  expect(player1.attack(11, 2, gameBoard)).toBe(false);
});
