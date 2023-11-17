const Ship = (length, isVertical = false) => {
  let hits = 0;

  const getLength = () => length;
  const getIsVertical = () => isVertical;
  const getHits = () => hits;
  const isSunk = () => hits === length;
  const hit = () => {
    if (hits < length) hits += 1;
  };
  return {
    getLength,
    getIsVertical,
    getHits,
    isSunk,
    hit,
  };
};

export default Ship;
