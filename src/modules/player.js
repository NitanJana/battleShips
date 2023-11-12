const Player = (name) => {
  const hitRecord = new Set();

  const hasAlreayHit = (row, column) => hitRecord.has(`${row}-${column}`);

  const isInvalidPosition = (row, column, size) =>
    row < 0 || column < 0 || row >= size || column >= size;

  const getRandomPosition = (gameBoard) =>
    Math.floor(Math.random() * gameBoard.getBoard().length);

  const getName = () => name;

  const attack = (row, column, gameBoard) => {
    if (hasAlreayHit(row, column)) return false;
    if (!isInvalidPosition(row, column, gameBoard.getBoard().length)) {
      gameBoard.recieveAttack(row, column);
      hitRecord.add(`${row}-${column}`);
      return true;
    }
    return false;
  };

  const randomAttack = (gameBoard) => {
    if (hitRecord.size === 100) return false;
    let randomRow = getRandomPosition(gameBoard);
    let randomCol = getRandomPosition(gameBoard);

    while (hasAlreayHit(randomRow, randomCol)) {
      randomRow = getRandomPosition(gameBoard);
      randomCol = getRandomPosition(gameBoard);
    }
    gameBoard.recieveAttack(randomRow, randomCol);
    hitRecord.add(`${randomRow}-${randomCol}`);
    return [randomRow, randomCol];
  };

  return {
    getName,
    attack,
    randomAttack,
  };
};

export default Player;
