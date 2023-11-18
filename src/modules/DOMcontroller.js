// Import the Ship class from the ship module
import Ship from "./ship";

const DOMcontroller = () => {
  // Function to create a single cell element
  const createCell = (rowIndex, columnIndex) => {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.setAttribute("row", rowIndex);
    cell.setAttribute("column", columnIndex);
    return cell;
  };

  // Function to create a single row element
  const createRow = (rowArray, rowIndex) => {
    const row = document.createElement("div");
    row.classList.add("row");
    rowArray.forEach((_, column) => {
      const cell = createCell(rowIndex, column);
      row.appendChild(cell);
    });
    return row;
  };

  // Function to render the game board on the HTML page
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

  // Function to render the ships on the game board
  const renderShips = (gameBoard) => {
    const boardArray = gameBoard.getBoard();
    const boardContainer = document.querySelector(".computerBoardContainer");

    // Remove existing "ship" class from cells
    boardContainer.querySelectorAll(".ship").forEach((ship) => {
      ship.classList.remove("ship");
    });

    boardArray.forEach((rowArray, rowIndex) => {
      rowArray.forEach((cellValue, columnIndex) => {
        const cell = boardContainer.querySelector(
          `.row:nth-child(${rowIndex + 1}) .cell:nth-child(${columnIndex + 1})`,
        );

        // Check if there is a ship at this cell
        if (cellValue) {
          cell.classList.add("ship"); // Add a class to indicate a ship at this cell
          cell.setAttribute("draggable", true);

          // Add dragstart event listener for dragging ship cells
          cell.addEventListener("dragstart", (event) => {
            event.dataTransfer.setData(
              "text/plain",
              JSON.stringify({
                rowIndex,
                columnIndex,
                cellValue,
              }),
            );
          });
        }
      });
    });

    // Add drop event listener to handle dropping ship cells
    boardContainer.addEventListener("drop", (event) => {
      event.preventDefault();

      const data = JSON.parse(event.dataTransfer.getData("text/plain"));
      console.log("Parsed drag data:", data);

      const oldRowIndex = data.rowIndex;
      const oldColumnIndex = data.columnIndex;
      const ship = Ship(data.cellValue.length, data.cellValue.isVertical);
      const newCell = event.target.closest(".cell");

      // Check if the drop target is a valid cell
      if (newCell && !newCell.classList.contains("ship")) {
        const newRowIndex = parseInt(newCell.getAttribute("row"), 10);
        const newColumnIndex = parseInt(newCell.getAttribute("column"), 10);

        // Remove ship from old coordinates
        gameBoard.removeShip(oldRowIndex, oldColumnIndex);
        

        // Place ship in new coordinates
        gameBoard.placeShip(newRowIndex, newColumnIndex, ship);

        // Update the visual representation of the ship
        renderShips(gameBoard);
      }
    });

    // Add dragover event listener to allow dropping
    boardContainer.addEventListener("dragover", (event) => {
      event.preventDefault();
    });
  };

  // Function to initialize the "Restart" button
  const initializeRestartBtn = () => {
    const restartBtn = document.querySelector(".restartBtn");
    restartBtn.addEventListener("click", () => {
      window.location.reload();
    });
  };

  let gameStarted = false;

  // Function to start the game
  const startGame = () => {
    gameStarted = true;
    const startBtn = document.querySelector(".startBtn");
    startBtn.textContent = "Restart";
    startBtn.addEventListener("click", () => {
      window.location.reload();
    });

    // Disable dragging for ship cells after the game has started
    const shipcells = document.querySelectorAll(".ship");
    shipcells.forEach((shipcell) => shipcell.setAttribute("draggable", false));
  };

  // Function to handle cell click during the user's turn
  const handleCellClick = (event, resolve) => {
    if (!gameStarted) {
      // Do nothing if the game hasn't started
      return;
    }
    const cell = event.target.closest(".cell");
    if (cell) {
      const row = parseInt(cell.getAttribute("row"), 10);
      const column = parseInt(cell.getAttribute("column"), 10);
      resolve([row, column]);
    }
  };

  // Function to get the user's move as a Promise
  const getUserMove = () =>
    new Promise((resolve) => {
      const userBoardContainer = document.querySelector(".userBoardContainer");

      // Add click event listener to handle user's move
      const handleClick = (event) => {
        handleCellClick(event, resolve);
      };

      userBoardContainer.addEventListener("click", handleClick);
    });

  // Function to initialize the "Start" button
  const initializeStartBtn = () => {
    const startBtn = document.querySelector(".startBtn");
    startBtn.addEventListener("click", startGame, { once: true });
  };

  // Function to handle cell state change (hit or missed)
  const handleCellUpdate = (coords, missedShots, player) => {
    const [row, column] = coords;
    let cell;

    // Determine the target cell based on the player (user or computer)
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

  // Function to display the winner in a modal
  const showWinner = (winner) => {
    const winnerModal = document.querySelector(".winnerModal");
    const winnerMessage = document.createElement("div");
    const restartBtn = document.createElement("button");

    winnerMessage.classList.add("winnerMessage");
    restartBtn.classList.add("restartBtn");

    restartBtn.textContent = "Restart";
    winnerMessage.textContent = `${winner} won`;

    winnerModal.append(winnerMessage, restartBtn);
    winnerModal.showModal();

    initializeRestartBtn();
  };

  return {
    renderGameBoard,
    renderShips,
    initializeStartBtn,
    initializeRestartBtn,
    getUserMove,
    handleCellUpdate,
    showWinner,
  };
};

export default DOMcontroller;
