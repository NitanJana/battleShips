const Player = (name) => {
  const hitRecord = new Set();
  const hasAlreayHit = (row, column) => hitRecord.has(`${row}-${column}`);
  const isInvalidPosition = (row, column, size) =>
    row < 0 || column < 0 || row >= size || column >= size;

  const getName = () => name;

  const attack = (row, column, gameBoard) => {
    if (hasAlreayHit(row, column)) return false;
    if (!isInvalidPosition(row, column, gameBoard.getBoard().length)) {
      gameBoard.recieveAttack(row, column);
      hitRecord.add(`${row}-${column}`);
      console.log(hitRecord);
      return true;
    }
    return false;
  };

  return {
    getName,
    attack,
  };
};

export default Player;
