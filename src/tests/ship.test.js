import Ship from "../modules/ship";

let newShip;
beforeEach(() => {
  newShip = Ship(3);
});

test("Ship factory should return a valid ship object", () => {
  expect(newShip.getLength()).toBe(3);
  expect(newShip.getHits()).toBe(0);
  expect(newShip.isSunk()).toBe(false);
});

test("Hit count should increase when hit method is called", () => {
  newShip.hit();
  expect(newShip.getHits()).toBe(1);
});

test("isSunk should return true when all ship segments are hit", () => {
  newShip.hit();
  newShip.hit();
  newShip.hit();
  expect(newShip.isSunk()).toBe(true);
});

test("sunk ship cannot be hit", () => {
  newShip.hit();
  newShip.hit();
  newShip.hit();
  newShip.hit();
  expect(newShip.isSunk()).toBe(true);
});
