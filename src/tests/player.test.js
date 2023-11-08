import Player from "../modules/player";
import GameBoard from "../modules/gameBoard";

test("player factory returns a valid Player object", () => {
  expect(Player("player1").getName()).toBe("player1");
});

test("player cannot attack same cell twice", () => {
  const player1 = Player("player1");
  const gameBoard = GameBoard();
  expect(player1.attack(4, 2, gameBoard)).toBe(true);
  expect(player1.attack(4, 2, gameBoard)).toBe(false);
});

test("player cannot attack invalid cell", () => {
  const player1 = Player("player1");
  const gameBoard = GameBoard();
  expect(player1.attack(11, 2, gameBoard)).toBe(false);
  
});
