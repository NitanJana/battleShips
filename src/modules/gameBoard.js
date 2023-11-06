const GameBoard = (size = 10) => {
  const board = [];
  for (let i = 0; i < size; i += 1) {
    board.push([]);
    for (let j = 0; j < size; j += 1) {
      board[i].push(null);
    }
  }

  const fetchBoard = () => board;

  return {
    fetchBoard,
  };
};

export default GameBoard;
