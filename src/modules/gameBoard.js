import Ship from "./ship";

const GameBoard = (size = 10) => {
  const board = [];
  const missedShots = [];
  const ships = [];
  for (let i = 0; i < size; i += 1) {
    board.push([]);
    missedShots.push([]);
    for (let j = 0; j < size; j += 1) {
      board[i].push(null);
      missedShots[i].push(false);
    }
  }

  const getBoard = () => board;
  const getMissedShots = () => missedShots;

  const isPositionOutOfBounds = (row, column) =>
    row < 0 || column < 0 || row >= size || column >= size;

  const isShipEndOutOfBounds = (row, column, ship) => {
    if (ship.getIsVertical()) return row + ship.getLength() > size;
    return column + ship.getLength() > size;
  };

  const isPositionTaken = (row, column, ship) => {
    if (ship.getIsVertical()) {
      for (let i = 0; i < ship.getLength(); i += 1) {
        if (board[row + i][column] !== null) return true;
      }
    } else {
      for (let i = 0; i < ship.getLength(); i += 1) {
        if (board[row][column + i] !== null) return true;
      }
    }
    return false;
  };

  const isNeighborTaken = (row, column, ship) => {
    if (ship.getIsVertical()) {
      for (let i = row - 1; i <= row + ship.getLength(); i += 1) {
        for (let j = column - 1; j <= column + 1; j += 1) {
          if (!isPositionOutOfBounds(i, j) && board[i][j]) return true;
        }
      }
    } else {
      for (let i = row - 1; i <= row + 1; i += 1) {
        for (let j = column - 1; j <= column + ship.getLength(); j += 1) {
          if (!isPositionOutOfBounds(i, j) && board[i][j]) return true;
        }
      }
    }
    return false;
  };

  const isValidPosition = (row, column, ship) => {
    if (isPositionOutOfBounds(row, column)) return false;
    if (isShipEndOutOfBounds(row, column, ship)) return false;
    if (isPositionTaken(row, column, ship)) return false;
    if (isNeighborTaken(row, column, ship)) return false;
    return true;
  };

  const placeShip = (row, column, ship) => {
    if (!isValidPosition(row, column, ship)) return false;
    if (ship.getIsVertical()) {
      for (let i = 0; i < ship.getLength(); i += 1) {
        board[row + i][column] = ship;
      }
    } else {
      for (let i = 0; i < ship.getLength(); i += 1) {
        board[row][column + i] = ship;
      }
    }
    ship.setStartCell(row, column);
    ships.push(ship);
    return true;
  };

  const removeShip = (row, column) => {
    const ship = board[row][column];
    const startRow = ship.getStartCell()[0];
    const startColumn = ship.getStartCell()[1];
    if (ship.getIsVertical()) {
      for (let i = 0; i < ship.getLength(); i += 1) {
        board[startRow + i][startColumn] = null;
      }
    } else {
      for (let i = 0; i < ship.getLength(); i += 1) {
        board[startRow][startColumn + i] = null;
      }
    }
    ships.splice(ships.indexOf(ship), 1);
    return true;
  };

  const placeRandomShips = () => {
    const shipLengths = [5, 4, 3, 3, 2];

    shipLengths.forEach((length) => {
      let isShipPlaced = false;

      while (!isShipPlaced) {
        const isVertical = Math.random() < 0.5;
        const row = Math.floor(Math.random() * size);
        const column = Math.floor(Math.random() * size);
        const newShip = Ship(length, isVertical);

        if (isValidPosition(row, column, newShip)) {
          placeShip(row, column, newShip);
          isShipPlaced = true;
        }
      }
    });
  };

  const recieveAttack = (row, column) => {
    if (isPositionOutOfBounds(row, column)) return false;
    if (board[row][column]) {
      board[row][column].hit();
      return true;
    }
    missedShots[row][column] = true;
    return false;
  };

  const isAllShipsSunk = () => ships.every((ship) => ship.isSunk() === true);

  return {
    getBoard,
    placeShip,
    removeShip,
    placeRandomShips,
    recieveAttack,
    getMissedShots,
    isAllShipsSunk,
  };
};

export default GameBoard;
