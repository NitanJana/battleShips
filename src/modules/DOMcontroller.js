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

  const renderShips = (gameBoard) => {
    const boardArray = gameBoard.getBoard();
    // const boardContainer =
    //   player.getName() === "user"
    //     ? document.querySelector(".userBoardContainer")
    //     : document.querySelector(".computerBoardContainer");
    const boardContainer = document.querySelector(".computerBoardContainer");
    boardArray.forEach((rowArray, rowIndex) => {
      rowArray.forEach((cellValue, columnIndex) => {
        const cell = boardContainer.querySelector(
          `.row:nth-child(${rowIndex + 1}) .cell:nth-child(${columnIndex + 1})`,
        );

        // Check if there is a ship at this cell
        if (cellValue) {
          cell.classList.add("ship"); // Add a class to indicate a ship at this cell
        }
      });
    });
  };

  const initializeRestartBtn = () => {
    const restartBtn = document.querySelector(".restartBtn");
    restartBtn.addEventListener("click", () => {
      window.location.reload();
    });
  };

  // Function to get user move
  const getUserMove = () =>
    new Promise((resolve) => {
      const userBoardContainer = document.querySelector(".userBoardContainer");

      const handleClick = (event) => {
        const cell = event.target.closest(".cell");
        if (cell) {
          const row = parseInt(cell.getAttribute("row"), 10);
          const column = parseInt(cell.getAttribute("column"), 10);
          userBoardContainer.removeEventListener("click", handleClick);
          resolve([row, column]);
        }
      };

      userBoardContainer.addEventListener("click", handleClick);
    });

  // Function to handle cell state change
  const handleCellUpdate = (coords, missedShots, player) => {
    const [row, column] = coords;
    let cell;
    if (player.getName() === "user") {
      cell = document.querySelector(
        `.userBoardContainer .row:nth-child(${row + 1}) .cell:nth-child(${
          column + 1
        })`,
      );
    } else {
      cell = document.querySelector(
        `.computerBoardContainer .row:nth-child(${row + 1}) .cell:nth-child(${
          column + 1
        })`,
      );
    }
    const isHit = !missedShots[row][column];

    cell.classList.add(isHit ? "hit" : "missed");
  };

  const showWinner = (winner) => {
    const winnerModal = document.querySelector(".winnerModal");
    const winnerMessage = winnerModal.querySelector(".winnerMessage");
    winnerMessage.textContent = `${winner} won`;
    winnerModal.showModal();
  };

  return {
    renderGameBoard,
    renderShips,
    initializeRestartBtn,
    getUserMove,
    handleCellUpdate,
    showWinner,
  };
};

export default DOMcontroller;
