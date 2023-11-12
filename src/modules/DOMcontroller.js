const DOMcontroller = () => {
  // Function to create a single cell
  const createCell = (rowIndex, columnIndex) => {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.setAttribute("row", rowIndex);
    cell.setAttribute("column", columnIndex);
    return cell;
  };

  // Function to create a single row
  const createRow = (rowIndex, rowArray) => {
    const row = document.createElement("div");
    row.classList.add("row");

    for (let j = 0; j < rowArray.length; j += 1) {
      const cell = createCell(rowIndex, j);
      row.appendChild(cell);
    }

    return row;
  };

  // Function to render the game board
  const renderGameBoard = (gameBoard) => {
    const boardArray = gameBoard.getBoard();
    const board = document.createElement("div");
    board.classList.add("board");

    for (let i = 0; i < boardArray.length; i += 1) {
      const row = createRow(i, boardArray[i]);
      board.appendChild(row);
    }

    return board;
  };

  const addCellEvents = (user, computer, userBoard, computerBoard) => {
    const cells = document.querySelectorAll(".userBoardContainer .cell");
    cells.forEach((cell) => {
      cell.addEventListener("click", () => {
        if (
          user.attack(
            cell.getAttribute("row"),
            cell.getAttribute("column"),
            userBoard,
          )
        ) {
          cell.classList.add("missed");
          const computerCellCoords = computer.randomAttack(computerBoard);
          const computerCell = document.querySelector(
            `.board .row:nth-child(${
              computerCellCoords[0] + 1
            }) .cell:nth-child(${computerCellCoords[1] + 1})`,
          );
          computerCell.classList.add("missed");
        }
      });
    });
  };

  return {
    renderGameBoard,
    addCellEvents,
  };
};

export default DOMcontroller;
