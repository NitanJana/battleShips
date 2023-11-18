const Ship = (length, isVertical = false) => {
  let hits = 0;
  let startRow;
  let startColumn;

  const getLength = () => length;
  const getIsVertical = () => isVertical;
  const getHits = () => hits;
  const isSunk = () => hits === length;
  const hit = () => {
    if (hits < length) hits += 1;
  };
  const getStartCell = () => [startRow, startColumn];
  const setStartCell = (row, column) => {
    startRow = row;
    startColumn = column;
  };

  return {
    getLength,
    getIsVertical,
    getHits,
    isSunk,
    hit,
    getStartCell,
    setStartCell,
  };
};

export default Ship;
