import Player from "../modules/player";

test("player factory returns a valid Player object", () => {
  expect(Player("player1").getName()).toBe("player1");
});
