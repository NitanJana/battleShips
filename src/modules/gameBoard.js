const GameBoard = (size = 10) => {
  const board = [];
  for (let i = 0; i < size; i += 1) {
    board.push([]);
    for (let j = 0; j < size; j += 1) {
      board[i].push(null);
    }
  }

  const fetchBoard = () => board;

  const isShipStartOutOfBounds = (row, column) =>
    row < 0 || column < 0 || row >= size || column >= size;

  const isValidPosition = (row, column) => {
    if (isShipStartOutOfBounds(row, column)) return false;
    return true;
  };

  const placeShip = (row, column, ship) => {
    if (!isValidPosition(row, column, ship)) return false;
    for (let i = 0; i < ship.getLength(); i += 1) {
      board[row][column + i] = ship;
    }
    return true;
  };

  return {
    fetchBoard,
    placeShip,
  };
};

export default GameBoard;
