const GameBoard = (size = 10) => {
  const board = [];
  for (let i = 0; i < size; i += 1) {
    board.push([]);
    for (let j = 0; j < size; j += 1) {
      board[i].push(null);
    }
  }

  const fetchBoard = () => board;

  const isPositionOutOfBounds = (row, column) =>
    row < 0 || column < 0 || row >= size || column >= size;

  const isShipEndOutOfBounds = (row, column, ship, isVertical) => {
    if (isVertical) return row + ship.getLength() >= size;
    return column + ship.getLength() >= size;
  };

  const isPositionTaken = (row, column, ship) => {
    for (let i = 0; i < ship.getLength(); i += 1) {
      if (board[row][column + i] !== null) return true;
    }
    return false;
  };

  const isNeighborTaken = (row, column, ship) => {
    for (let i = row - 1; i <= row + 1; i += 1) {
      for (let j = column - 1; j <= column + ship.getLength(); j += 1) {
        if (!isPositionOutOfBounds(i, j) && board[i][j]) return true;
      }
    }
    return false;
  };

  const isValidPosition = (row, column, ship, isVertical) => {
    if (isPositionOutOfBounds(row, column)) return false;
    if (isShipEndOutOfBounds(row, column, ship, isVertical)) return false;
    if (isPositionTaken(row, column, ship)) return false;
    if (isNeighborTaken(row, column, ship)) return false;
    return true;
  };

  const placeShip = (row, column, ship, isVertical = false) => {
    if (!isValidPosition(row, column, ship, isVertical)) return false;
    if (isVertical) {
      for (let i = 0; i < ship.getLength(); i += 1) {
        board[row + i][column] = ship;
      }
    } else {
      for (let i = 0; i < ship.getLength(); i += 1) {
        board[row][column + i] = ship;
      }
    }
    return true;
  };

  return {
    fetchBoard,
    placeShip,
  };
};

export default GameBoard;
