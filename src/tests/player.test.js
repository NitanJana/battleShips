import Player from "../modules/player";
import GameBoard from "../modules/gameBoard";

let player;
let gameBoard;

beforeEach(() => {
  player = Player("player");
  gameBoard = GameBoard();
});

test("player factory returns a valid Player object", () => {
  expect(player.getName()).toBe("player");
});

test("player cannot attack same cell twice", () => {
  expect(player.attack(4, 2, gameBoard)).toBe(true);
  expect(player.attack(4, 2, gameBoard)).toBe(false);
});

test("player cannot attack invalid cell", () => {
  expect(player.attack(11, 2, gameBoard)).toBe(false);
});

test("should not make an attack if all positions have been hit", () => {
  // Fill the hitRecord to simulate all positions being hit
  for (let i = 0; i < 100; i += 1) {
    player.randomAttack(gameBoard);
  }
  expect(player.randomAttack(gameBoard)).toBe(false);
});
