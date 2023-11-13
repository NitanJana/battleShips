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
  const createRow = (rowArray, rowIndex) => {
    const row = document.createElement("div");
    row.classList.add("row");
    rowArray.forEach((_, column) => {
      const cell = createCell(rowIndex, column);
      row.appendChild(cell);
    });
    return row;
  };

  // Function to render the game board
  const renderGameBoard = (gameBoard) => {
    const boardArray = gameBoard.getBoard();
    const board = document.createElement("div");
    board.classList.add("board");

    boardArray.forEach((rowArray, rowIndex) => {
      const row = createRow(rowArray, rowIndex);
      board.appendChild(row);
    });
    return board;
  };
  // Function to check for winner
  const checkForWinner = (userBoard, computerBoard) => {
    if (userBoard.isAllShipsSunk()) {
      console.log("User wins! All computer ships are sunk.");
    } else if (computerBoard.isAllShipsSunk()) {
      console.log("Computer wins! All user ships are sunk.");
    }
  };
  // Function to handle cell color change
  const handleCellUpdate = (cell, missedShots, coords) => {
    const isHit = !missedShots[coords[0]][coords[1]];

    cell.classList.add(isHit ? "hit" : "missed");
  };

  const addCellEvents = (user, computer, userBoard, computerBoard) => {
    const userBoardContainer = document.querySelector(".userBoardContainer");

    userBoardContainer.addEventListener("click", (event) => {
      const cell = event.target.closest(".cell");
      if (cell) {
        const userAttackSuccess = user.attack(
          cell.getAttribute("row"),
          cell.getAttribute("column"),
          userBoard,
        );

        if (userAttackSuccess) {
          const userCellCoords = [
            parseInt(cell.getAttribute("row"), 10),
            parseInt(cell.getAttribute("column"), 10),
          ];

          handleCellUpdate(cell, userBoard.getMissedShots(), userCellCoords);

          const computerCellCoords = computer.randomAttack(computerBoard);
          const computerCell = document.querySelector(
            `.board .row:nth-child(${
              computerCellCoords[0] + 1
            }) .cell:nth-child(${computerCellCoords[1] + 1})`,
          );

          handleCellUpdate(
            computerCell,
            computerBoard.getMissedShots(),
            computerCellCoords,
          );
          checkForWinner(userBoard, computerBoard);
        }
      }
    });
  };

  return {
    renderGameBoard,
    addCellEvents,
  };
};

export default DOMcontroller;
