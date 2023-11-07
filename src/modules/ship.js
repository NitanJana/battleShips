const Ship = (length) => {
  let hits = 0;

  const getLength = () => length;
  const getHits = () => hits;
  const isSunk = () => hits === length;
  const hit = () => {
    if (hits < length) hits += 1;
  };
  return {
    getLength,
    getHits,
    isSunk,
    hit,
  };
};

export default Ship;
