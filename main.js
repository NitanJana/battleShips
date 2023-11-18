/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/modules/DOMcontroller.js":
/*!**************************************!*\
  !*** ./src/modules/DOMcontroller.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ship */ "./src/modules/ship.js");
// Import the Ship class from the ship module

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
  const renderGameBoard = gameBoard => {
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
  const renderShips = gameBoard => {
    const boardArray = gameBoard.getBoard();
    const boardContainer = document.querySelector(".computerBoardContainer");

    // Remove existing "ship" class from cells
    boardContainer.querySelectorAll(".ship").forEach(ship => {
      ship.classList.remove("ship");
    });
    boardArray.forEach((rowArray, rowIndex) => {
      rowArray.forEach((cellValue, columnIndex) => {
        const cell = boardContainer.querySelector(`.row:nth-child(${rowIndex + 1}) .cell:nth-child(${columnIndex + 1})`);

        // Check if there is a ship at this cell
        if (cellValue) {
          cell.classList.add("ship"); // Add a class to indicate a ship at this cell
          cell.setAttribute("draggable", true);

          // Add dragstart event listener for dragging ship cells
          cell.addEventListener("dragstart", event => {
            event.dataTransfer.setData("text/plain", JSON.stringify({
              rowIndex,
              columnIndex,
              cellValue
            }));
          });
        }
      });
    });

    // Add drop event listener to handle dropping ship cells
    boardContainer.addEventListener("drop", event => {
      event.preventDefault();
      const data = JSON.parse(event.dataTransfer.getData("text/plain"));
      console.log("Parsed drag data:", data);
      const oldRowIndex = data.rowIndex;
      const oldColumnIndex = data.columnIndex;
      const ship = (0,_ship__WEBPACK_IMPORTED_MODULE_0__["default"])(data.cellValue.length, data.cellValue.isVertical);
      const newCell = event.target.closest(".cell");

      // Check if the drop target is a valid cell
      if (newCell && !newCell.classList.contains("ship")) {
        const newRowIndex = parseInt(newCell.getAttribute("row"), 10);
        const newColumnIndex = parseInt(newCell.getAttribute("column"), 10);

        // Place ship in new coordinates

        if (gameBoard.placeShip(newRowIndex, newColumnIndex, ship)) {
          // Remove ship from old coordinates
          gameBoard.removeShip(oldRowIndex, oldColumnIndex);

          // Update the visual representation of the ship
          renderShips(gameBoard);
        }
      }
    });

    // Add dragover event listener to allow dropping
    boardContainer.addEventListener("dragover", event => {
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
    shipcells.forEach(shipcell => shipcell.setAttribute("draggable", false));
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
  const getUserMove = () => new Promise(resolve => {
    const userBoardContainer = document.querySelector(".userBoardContainer");

    // Add click event listener to handle user's move
    const handleClick = event => {
      handleCellClick(event, resolve);
    };
    userBoardContainer.addEventListener("click", handleClick);
  });

  // Function to initialize the "Start" button
  const initializeStartBtn = () => {
    const startBtn = document.querySelector(".startBtn");
    startBtn.addEventListener("click", startGame, {
      once: true
    });
  };

  // Function to handle cell state change (hit or missed)
  const handleCellUpdate = (coords, missedShots, player) => {
    const [row, column] = coords;
    let cell;

    // Determine the target cell based on the player (user or computer)
    if (player.getName() === "user") {
      cell = document.querySelector(`.userBoardContainer .row:nth-child(${row + 1}) .cell:nth-child(${column + 1})`);
    } else {
      cell = document.querySelector(`.computerBoardContainer .row:nth-child(${row + 1}) .cell:nth-child(${column + 1})`);
    }
    const isHit = !missedShots[row][column];
    cell.classList.add(isHit ? "hit" : "missed");
  };

  // Function to display the winner in a modal
  const showWinner = winner => {
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
    showWinner
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DOMcontroller);

/***/ }),

/***/ "./src/modules/game.js":
/*!*****************************!*\
  !*** ./src/modules/game.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _DOMcontroller__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./DOMcontroller */ "./src/modules/DOMcontroller.js");
/* harmony import */ var _gameBoard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./gameBoard */ "./src/modules/gameBoard.js");
/* harmony import */ var _player__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./player */ "./src/modules/player.js");



// import Ship from "./ship";

const game = () => {
  const user = (0,_player__WEBPACK_IMPORTED_MODULE_2__["default"])("user");
  const computer = (0,_player__WEBPACK_IMPORTED_MODULE_2__["default"])("computer");
  const userBoard = (0,_gameBoard__WEBPACK_IMPORTED_MODULE_1__["default"])();
  const computerBoard = (0,_gameBoard__WEBPACK_IMPORTED_MODULE_1__["default"])();
  const domController = (0,_DOMcontroller__WEBPACK_IMPORTED_MODULE_0__["default"])();
  // const newShip = Ship(3);
  // userBoard.placeShip(2, 2, newShip);
  // const newShip2 = Ship(3, true);
  // computerBoard.placeShip(4, 2, newShip2);

  const computerBoardContainer = document.querySelector(".computerBoardContainer");
  const userBoardContainer = document.querySelector(".userBoardContainer");
  computerBoardContainer.appendChild(domController.renderGameBoard(computerBoard));
  userBoardContainer.appendChild(domController.renderGameBoard(userBoard));
  const playTurn = async () => {
    const userCellCoords = await domController.getUserMove();
    const userAttackSuccess = user.attack(userCellCoords[0], userCellCoords[1], userBoard);
    if (userAttackSuccess) {
      domController.handleCellUpdate(userCellCoords, userBoard.getMissedShots(), user);
      const computerCellCoords = computer.randomAttack(computerBoard);
      domController.handleCellUpdate(computerCellCoords, computerBoard.getMissedShots(), computer);
    }
  };
  // Function to check for winner
  const checkForWinner = () => {
    if (userBoard.isAllShipsSunk()) {
      domController.showWinner(user.getName());
    } else if (computerBoard.isAllShipsSunk()) {
      domController.showWinner(computer.getName());
    }
  };
  // Game loop
  const gameLoop = async () => {
    // Exit condition
    while (!userBoard.isAllShipsSunk() && !computerBoard.isAllShipsSunk()) {
      // eslint-disable-next-line no-await-in-loop
      await playTurn();
    }
    checkForWinner();
  };
  domController.initializeStartBtn();
  userBoard.placeRandomShips();
  computerBoard.placeRandomShips();
  domController.renderShips(computerBoard);

  // domController.renderShips(userBoard, user);
  // Start the game loop
  gameLoop();
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (game);

/***/ }),

/***/ "./src/modules/gameBoard.js":
/*!**********************************!*\
  !*** ./src/modules/gameBoard.js ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ship */ "./src/modules/ship.js");

const GameBoard = function () {
  let size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;
  const board = [];
  const missedShots = [];
  const ships = [];
  for (let i = 0; i < size; i += 1) {
    board.push([]);
    missedShots.push([]);
    for (let j = 0; j < size; j += 1) {
      board[i].push(null);
      missedShots[i].push(false);
    }
  }
  const getBoard = () => board;
  const getMissedShots = () => missedShots;
  const isPositionOutOfBounds = (row, column) => row < 0 || column < 0 || row >= size || column >= size;
  const isShipEndOutOfBounds = (row, column, ship) => {
    if (ship.getIsVertical()) return row + ship.getLength() > size;
    return column + ship.getLength() > size;
  };
  const isPositionTaken = (row, column, ship) => {
    if (ship.getIsVertical()) {
      for (let i = 0; i < ship.getLength(); i += 1) {
        if (board[row + i][column] !== null) return true;
      }
    } else {
      for (let i = 0; i < ship.getLength(); i += 1) {
        if (board[row][column + i] !== null) return true;
      }
    }
    return false;
  };
  const isNeighborTaken = (row, column, ship) => {
    if (ship.getIsVertical()) {
      for (let i = row - 1; i <= row + ship.getLength(); i += 1) {
        for (let j = column - 1; j <= column + 1; j += 1) {
          if (!isPositionOutOfBounds(i, j) && board[i][j]) return true;
        }
      }
    } else {
      for (let i = row - 1; i <= row + 1; i += 1) {
        for (let j = column - 1; j <= column + ship.getLength(); j += 1) {
          if (!isPositionOutOfBounds(i, j) && board[i][j]) return true;
        }
      }
    }
    return false;
  };
  const isValidPosition = (row, column, ship) => {
    if (isPositionOutOfBounds(row, column)) return false;
    if (isShipEndOutOfBounds(row, column, ship)) return false;
    if (isPositionTaken(row, column, ship)) return false;
    if (isNeighborTaken(row, column, ship)) return false;
    return true;
  };
  const placeShip = (row, column, ship) => {
    if (!isValidPosition(row, column, ship)) return false;
    if (ship.getIsVertical()) {
      for (let i = 0; i < ship.getLength(); i += 1) {
        board[row + i][column] = ship;
      }
    } else {
      for (let i = 0; i < ship.getLength(); i += 1) {
        board[row][column + i] = ship;
      }
    }
    ship.setStartCell(row, column);
    ships.push(ship);
    return true;
  };
  const removeShip = (row, column) => {
    const ship = board[row][column];
    const startRow = ship.getStartCell()[0];
    const startColumn = ship.getStartCell()[1];
    if (ship.getIsVertical()) {
      for (let i = 0; i < ship.getLength(); i += 1) {
        board[startRow + i][startColumn] = null;
      }
    } else {
      for (let i = 0; i < ship.getLength(); i += 1) {
        board[startRow][startColumn + i] = null;
      }
    }
    ships.splice(ships.indexOf(ship), 1);
    return true;
  };
  const placeRandomShips = () => {
    const shipLengths = [5, 4, 3, 3, 2];
    shipLengths.forEach(length => {
      let isShipPlaced = false;
      while (!isShipPlaced) {
        const isVertical = Math.random() < 0.5;
        const row = Math.floor(Math.random() * size);
        const column = Math.floor(Math.random() * size);
        const newShip = (0,_ship__WEBPACK_IMPORTED_MODULE_0__["default"])(length, isVertical);
        if (isValidPosition(row, column, newShip)) {
          placeShip(row, column, newShip);
          isShipPlaced = true;
        }
      }
    });
  };
  const recieveAttack = (row, column) => {
    if (isPositionOutOfBounds(row, column)) return false;
    if (board[row][column]) {
      board[row][column].hit();
      return true;
    }
    missedShots[row][column] = true;
    return false;
  };
  const isAllShipsSunk = () => ships.every(ship => ship.isSunk() === true);
  return {
    getBoard,
    placeShip,
    removeShip,
    placeRandomShips,
    recieveAttack,
    getMissedShots,
    isAllShipsSunk
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GameBoard);

/***/ }),

/***/ "./src/modules/player.js":
/*!*******************************!*\
  !*** ./src/modules/player.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const Player = name => {
  const hitRecord = new Set();
  const hasAlreayHit = (row, column) => hitRecord.has(`${row}-${column}`);
  const isInvalidPosition = (row, column, size) => row < 0 || column < 0 || row >= size || column >= size;
  const getRandomPosition = gameBoard => Math.floor(Math.random() * gameBoard.getBoard().length);
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
  const randomAttack = gameBoard => {
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
    randomAttack
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Player);

/***/ }),

/***/ "./src/modules/ship.js":
/*!*****************************!*\
  !*** ./src/modules/ship.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const Ship = function (length) {
  let isVertical = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
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
  const toJSON = () => ({
    length: getLength(),
    isVertical: getIsVertical(),
    hits: getHits(),
    startCell: getStartCell()
  });
  return {
    getLength,
    getIsVertical,
    getHits,
    isSunk,
    hit,
    getStartCell,
    setStartCell,
    toJSON
  };
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Ship);

/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/styles/styles.css":
/*!*********************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./src/styles/styles.css ***!
  \*********************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
___CSS_LOADER_EXPORT___.push([module.id, "@import url(https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap);"]);
// Module
___CSS_LOADER_EXPORT___.push([module.id, `*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  height: 100%;
  width: 100%;
}

.game-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5rem;
  padding: 2rem;
  font-family: 'Roboto', sans-serif;
}

.header {
  font-size: 5rem;
  color: #9ae29a;
}

.boards {
  display: flex;
  gap: 10rem;
}

.board {
  width: max-content;
}

.row {
  display: flex;
  flex-direction: row;
}

.cell {
  width: 2rem;
  aspect-ratio: 1;
  border: 1px solid #ccccf5;
  text-align: center;
  cursor: pointer;
}

.ship {
  background-color: #9ae29a;
  border: none;
}

.missed {
  background-color: #ccccf5;
}

.hit {
  background-color: rgb(255, 112, 112);
}

.winnerModal {
  padding: 2rem 5rem;
  outline: none;
  border: none;
  margin: auto;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  text-align: center;
  gap: 1rem;
}

.winnerMessage {
  font-size: 1.5rem;
  font-weight: bold;
  font-family: 'Roboto', sans-serif;
  color: #9191ca;
}

.buttonContainer {
  display: flex;
  justify-content: center;
}

.startBtn,
.restartBtn {
  font-size: 1.5rem;
  padding: 0.5rem 1.5rem;
  border-radius: 1rem;
  border: none;
  outline: none;
  cursor: pointer;
  color: #ffffff;
  background-color: #9ae29a;
  font-weight: 700;
}`, "",{"version":3,"sources":["webpack://./src/styles/styles.css"],"names":[],"mappings":"AAEA;;;EAGE,SAAS;EACT,UAAU;EACV,sBAAsB;AACxB;;AAEA;;EAEE,YAAY;EACZ,WAAW;AACb;;AAEA;EACE,aAAa;EACb,sBAAsB;EACtB,mBAAmB;EACnB,SAAS;EACT,aAAa;EACb,iCAAiC;AACnC;;AAEA;EACE,eAAe;EACf,cAAc;AAChB;;AAEA;EACE,aAAa;EACb,UAAU;AACZ;;AAEA;EACE,kBAAkB;AACpB;;AAEA;EACE,aAAa;EACb,mBAAmB;AACrB;;AAEA;EACE,WAAW;EACX,eAAe;EACf,yBAAyB;EACzB,kBAAkB;EAClB,eAAe;AACjB;;AAEA;EACE,yBAAyB;EACzB,YAAY;AACd;;AAEA;EACE,yBAAyB;AAC3B;;AAEA;EACE,oCAAoC;AACtC;;AAEA;EACE,kBAAkB;EAClB,aAAa;EACb,YAAY;EACZ,YAAY;EACZ,mBAAmB;EACnB,aAAa;EACb,sBAAsB;EACtB,kBAAkB;EAClB,SAAS;AACX;;AAEA;EACE,iBAAiB;EACjB,iBAAiB;EACjB,iCAAiC;EACjC,cAAc;AAChB;;AAEA;EACE,aAAa;EACb,uBAAuB;AACzB;;AAEA;;EAEE,iBAAiB;EACjB,sBAAsB;EACtB,mBAAmB;EACnB,YAAY;EACZ,aAAa;EACb,eAAe;EACf,cAAc;EACd,yBAAyB;EACzB,gBAAgB;AAClB","sourcesContent":["@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@500&display=swap');\n\n*,\n*::before,\n*::after {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\nhtml,\nbody {\n  height: 100%;\n  width: 100%;\n}\n\n.game-container {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 5rem;\n  padding: 2rem;\n  font-family: 'Roboto', sans-serif;\n}\n\n.header {\n  font-size: 5rem;\n  color: #9ae29a;\n}\n\n.boards {\n  display: flex;\n  gap: 10rem;\n}\n\n.board {\n  width: max-content;\n}\n\n.row {\n  display: flex;\n  flex-direction: row;\n}\n\n.cell {\n  width: 2rem;\n  aspect-ratio: 1;\n  border: 1px solid #ccccf5;\n  text-align: center;\n  cursor: pointer;\n}\n\n.ship {\n  background-color: #9ae29a;\n  border: none;\n}\n\n.missed {\n  background-color: #ccccf5;\n}\n\n.hit {\n  background-color: rgb(255, 112, 112);\n}\n\n.winnerModal {\n  padding: 2rem 5rem;\n  outline: none;\n  border: none;\n  margin: auto;\n  border-radius: 1rem;\n  display: flex;\n  flex-direction: column;\n  text-align: center;\n  gap: 1rem;\n}\n\n.winnerMessage {\n  font-size: 1.5rem;\n  font-weight: bold;\n  font-family: 'Roboto', sans-serif;\n  color: #9191ca;\n}\n\n.buttonContainer {\n  display: flex;\n  justify-content: center;\n}\n\n.startBtn,\n.restartBtn {\n  font-size: 1.5rem;\n  padding: 0.5rem 1.5rem;\n  border-radius: 1rem;\n  border: none;\n  outline: none;\n  cursor: pointer;\n  color: #ffffff;\n  background-color: #9ae29a;\n  font-weight: 700;\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./src/styles/styles.css":
/*!*******************************!*\
  !*** ./src/styles/styles.css ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!./styles.css */ "./node_modules/css-loader/dist/cjs.js!./src/styles/styles.css");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_styles_css__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {



var stylesInDOM = [];
function getIndexByIdentifier(identifier) {
  var result = -1;
  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }
  return result;
}
function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];
  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };
    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }
    identifiers.push(identifier);
  }
  return identifiers;
}
function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);
  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }
      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };
  return updater;
}
module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];
    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }
    var newLastIdentifiers = modulesToDom(newList, options);
    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];
      var _index = getIndexByIdentifier(_identifier);
      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();
        stylesInDOM.splice(_index, 1);
      }
    }
    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {



var memo = {};

/* istanbul ignore next  */
function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target);

    // Special case to return head of iframe instead of iframe itself
    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }
    memo[target] = styleTarget;
  }
  return memo[target];
}

/* istanbul ignore next  */
function insertBySelector(insert, style) {
  var target = getTarget(insert);
  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}
module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}
module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  }

  // For old IE
  /* istanbul ignore if  */
  options.styleTagTransform(css, styleElement, options.options);
}
function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }
  styleElement.parentNode.removeChild(styleElement);
}

/* istanbul ignore next  */
function domAPI(options) {
  if (typeof document === "undefined") {
    return {
      update: function update() {},
      remove: function remove() {}
    };
  }
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}
module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }
    styleElement.appendChild(document.createTextNode(css));
  }
}
module.exports = styleTagTransform;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _styles_styles_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./styles/styles.css */ "./src/styles/styles.css");
/* harmony import */ var _modules_game__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./modules/game */ "./src/modules/game.js");


(0,_modules_game__WEBPACK_IMPORTED_MODULE_1__["default"])();
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EseURBQXlEO0FBQ3pEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0M7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDNURhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7VUNiQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7V0NOQTs7Ozs7Ozs7Ozs7OztBQ0E2QjtBQUNLO0FBRWxDeUYseURBQUksQ0FBQyxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy8uL3NyYy9tb2R1bGVzL0RPTWNvbnRyb2xsZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcHMvLi9zcmMvbW9kdWxlcy9nYW1lLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXBzLy4vc3JjL21vZHVsZXMvZ2FtZUJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXBzLy4vc3JjL21vZHVsZXMvcGxheWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXBzLy4vc3JjL21vZHVsZXMvc2hpcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy8uL3NyYy9zdHlsZXMvc3R5bGVzLmNzcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcHMvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy8uL3NyYy9zdHlsZXMvc3R5bGVzLmNzcz9lNDViIiwid2VicGFjazovL2JhdHRsZXNoaXBzLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXBzLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXBzLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcHMvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcHMvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcHMvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXBzL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcHMvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy93ZWJwYWNrL3J1bnRpbWUvbm9uY2UiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcHMvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gSW1wb3J0IHRoZSBTaGlwIGNsYXNzIGZyb20gdGhlIHNoaXAgbW9kdWxlXG5pbXBvcnQgU2hpcCBmcm9tIFwiLi9zaGlwXCI7XG5cbmNvbnN0IERPTWNvbnRyb2xsZXIgPSAoKSA9PiB7XG4gIC8vIEZ1bmN0aW9uIHRvIGNyZWF0ZSBhIHNpbmdsZSBjZWxsIGVsZW1lbnRcbiAgY29uc3QgY3JlYXRlQ2VsbCA9IChyb3dJbmRleCwgY29sdW1uSW5kZXgpID0+IHtcbiAgICBjb25zdCBjZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBjZWxsLmNsYXNzTGlzdC5hZGQoXCJjZWxsXCIpO1xuICAgIGNlbGwuc2V0QXR0cmlidXRlKFwicm93XCIsIHJvd0luZGV4KTtcbiAgICBjZWxsLnNldEF0dHJpYnV0ZShcImNvbHVtblwiLCBjb2x1bW5JbmRleCk7XG4gICAgcmV0dXJuIGNlbGw7XG4gIH07XG5cbiAgLy8gRnVuY3Rpb24gdG8gY3JlYXRlIGEgc2luZ2xlIHJvdyBlbGVtZW50XG4gIGNvbnN0IGNyZWF0ZVJvdyA9IChyb3dBcnJheSwgcm93SW5kZXgpID0+IHtcbiAgICBjb25zdCByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIHJvdy5jbGFzc0xpc3QuYWRkKFwicm93XCIpO1xuICAgIHJvd0FycmF5LmZvckVhY2goKF8sIGNvbHVtbikgPT4ge1xuICAgICAgY29uc3QgY2VsbCA9IGNyZWF0ZUNlbGwocm93SW5kZXgsIGNvbHVtbik7XG4gICAgICByb3cuYXBwZW5kQ2hpbGQoY2VsbCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJvdztcbiAgfTtcblxuICAvLyBGdW5jdGlvbiB0byByZW5kZXIgdGhlIGdhbWUgYm9hcmQgb24gdGhlIEhUTUwgcGFnZVxuICBjb25zdCByZW5kZXJHYW1lQm9hcmQgPSAoZ2FtZUJvYXJkKSA9PiB7XG4gICAgY29uc3QgYm9hcmRBcnJheSA9IGdhbWVCb2FyZC5nZXRCb2FyZCgpO1xuICAgIGNvbnN0IGJvYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBib2FyZC5jbGFzc0xpc3QuYWRkKFwiYm9hcmRcIik7XG5cbiAgICBib2FyZEFycmF5LmZvckVhY2goKHJvd0FycmF5LCByb3dJbmRleCkgPT4ge1xuICAgICAgY29uc3Qgcm93ID0gY3JlYXRlUm93KHJvd0FycmF5LCByb3dJbmRleCk7XG4gICAgICBib2FyZC5hcHBlbmRDaGlsZChyb3cpO1xuICAgIH0pO1xuICAgIHJldHVybiBib2FyZDtcbiAgfTtcblxuICAvLyBGdW5jdGlvbiB0byByZW5kZXIgdGhlIHNoaXBzIG9uIHRoZSBnYW1lIGJvYXJkXG4gIGNvbnN0IHJlbmRlclNoaXBzID0gKGdhbWVCb2FyZCkgPT4ge1xuICAgIGNvbnN0IGJvYXJkQXJyYXkgPSBnYW1lQm9hcmQuZ2V0Qm9hcmQoKTtcbiAgICBjb25zdCBib2FyZENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY29tcHV0ZXJCb2FyZENvbnRhaW5lclwiKTtcblxuICAgIC8vIFJlbW92ZSBleGlzdGluZyBcInNoaXBcIiBjbGFzcyBmcm9tIGNlbGxzXG4gICAgYm9hcmRDb250YWluZXIucXVlcnlTZWxlY3RvckFsbChcIi5zaGlwXCIpLmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgIHNoaXAuY2xhc3NMaXN0LnJlbW92ZShcInNoaXBcIik7XG4gICAgfSk7XG5cbiAgICBib2FyZEFycmF5LmZvckVhY2goKHJvd0FycmF5LCByb3dJbmRleCkgPT4ge1xuICAgICAgcm93QXJyYXkuZm9yRWFjaCgoY2VsbFZhbHVlLCBjb2x1bW5JbmRleCkgPT4ge1xuICAgICAgICBjb25zdCBjZWxsID0gYm9hcmRDb250YWluZXIucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICBgLnJvdzpudGgtY2hpbGQoJHtyb3dJbmRleCArIDF9KSAuY2VsbDpudGgtY2hpbGQoJHtjb2x1bW5JbmRleCArIDF9KWAsXG4gICAgICAgICk7XG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgdGhlcmUgaXMgYSBzaGlwIGF0IHRoaXMgY2VsbFxuICAgICAgICBpZiAoY2VsbFZhbHVlKSB7XG4gICAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwic2hpcFwiKTsgLy8gQWRkIGEgY2xhc3MgdG8gaW5kaWNhdGUgYSBzaGlwIGF0IHRoaXMgY2VsbFxuICAgICAgICAgIGNlbGwuc2V0QXR0cmlidXRlKFwiZHJhZ2dhYmxlXCIsIHRydWUpO1xuXG4gICAgICAgICAgLy8gQWRkIGRyYWdzdGFydCBldmVudCBsaXN0ZW5lciBmb3IgZHJhZ2dpbmcgc2hpcCBjZWxsc1xuICAgICAgICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdzdGFydFwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhKFxuICAgICAgICAgICAgICBcInRleHQvcGxhaW5cIixcbiAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgIHJvd0luZGV4LFxuICAgICAgICAgICAgICAgIGNvbHVtbkluZGV4LFxuICAgICAgICAgICAgICAgIGNlbGxWYWx1ZSxcbiAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8vIEFkZCBkcm9wIGV2ZW50IGxpc3RlbmVyIHRvIGhhbmRsZSBkcm9wcGluZyBzaGlwIGNlbGxzXG4gICAgYm9hcmRDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcihcImRyb3BcIiwgKGV2ZW50KSA9PiB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICBjb25zdCBkYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhVHJhbnNmZXIuZ2V0RGF0YShcInRleHQvcGxhaW5cIikpO1xuICAgICAgY29uc29sZS5sb2coXCJQYXJzZWQgZHJhZyBkYXRhOlwiLCBkYXRhKTtcblxuICAgICAgY29uc3Qgb2xkUm93SW5kZXggPSBkYXRhLnJvd0luZGV4O1xuICAgICAgY29uc3Qgb2xkQ29sdW1uSW5kZXggPSBkYXRhLmNvbHVtbkluZGV4O1xuICAgICAgY29uc3Qgc2hpcCA9IFNoaXAoZGF0YS5jZWxsVmFsdWUubGVuZ3RoLCBkYXRhLmNlbGxWYWx1ZS5pc1ZlcnRpY2FsKTtcbiAgICAgIGNvbnN0IG5ld0NlbGwgPSBldmVudC50YXJnZXQuY2xvc2VzdChcIi5jZWxsXCIpO1xuXG4gICAgICAvLyBDaGVjayBpZiB0aGUgZHJvcCB0YXJnZXQgaXMgYSB2YWxpZCBjZWxsXG4gICAgICBpZiAobmV3Q2VsbCAmJiAhbmV3Q2VsbC5jbGFzc0xpc3QuY29udGFpbnMoXCJzaGlwXCIpKSB7XG4gICAgICAgIGNvbnN0IG5ld1Jvd0luZGV4ID0gcGFyc2VJbnQobmV3Q2VsbC5nZXRBdHRyaWJ1dGUoXCJyb3dcIiksIDEwKTtcbiAgICAgICAgY29uc3QgbmV3Q29sdW1uSW5kZXggPSBwYXJzZUludChuZXdDZWxsLmdldEF0dHJpYnV0ZShcImNvbHVtblwiKSwgMTApO1xuXG4gICAgICAgIC8vIFBsYWNlIHNoaXAgaW4gbmV3IGNvb3JkaW5hdGVzXG4gICAgICAgIFxuICAgICAgICBpZiAoZ2FtZUJvYXJkLnBsYWNlU2hpcChuZXdSb3dJbmRleCwgbmV3Q29sdW1uSW5kZXgsIHNoaXApKSB7XG4gICAgICAgICAgXG4gICAgICAgICAgXG4gICAgICAgICAgLy8gUmVtb3ZlIHNoaXAgZnJvbSBvbGQgY29vcmRpbmF0ZXNcbiAgICAgICAgICBnYW1lQm9hcmQucmVtb3ZlU2hpcChvbGRSb3dJbmRleCwgb2xkQ29sdW1uSW5kZXgpO1xuICAgICAgICAgIFxuICAgICAgICAgIFxuICAgICAgICAgIC8vIFVwZGF0ZSB0aGUgdmlzdWFsIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBzaGlwXG4gICAgICAgICAgcmVuZGVyU2hpcHMoZ2FtZUJvYXJkKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gQWRkIGRyYWdvdmVyIGV2ZW50IGxpc3RlbmVyIHRvIGFsbG93IGRyb3BwaW5nXG4gICAgYm9hcmRDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdvdmVyXCIsIChldmVudCkgPT4ge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBGdW5jdGlvbiB0byBpbml0aWFsaXplIHRoZSBcIlJlc3RhcnRcIiBidXR0b25cbiAgY29uc3QgaW5pdGlhbGl6ZVJlc3RhcnRCdG4gPSAoKSA9PiB7XG4gICAgY29uc3QgcmVzdGFydEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucmVzdGFydEJ0blwiKTtcbiAgICByZXN0YXJ0QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gICAgfSk7XG4gIH07XG5cbiAgbGV0IGdhbWVTdGFydGVkID0gZmFsc2U7XG5cbiAgLy8gRnVuY3Rpb24gdG8gc3RhcnQgdGhlIGdhbWVcbiAgY29uc3Qgc3RhcnRHYW1lID0gKCkgPT4ge1xuICAgIGdhbWVTdGFydGVkID0gdHJ1ZTtcbiAgICBjb25zdCBzdGFydEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc3RhcnRCdG5cIik7XG4gICAgc3RhcnRCdG4udGV4dENvbnRlbnQgPSBcIlJlc3RhcnRcIjtcbiAgICBzdGFydEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICAgIH0pO1xuXG4gICAgLy8gRGlzYWJsZSBkcmFnZ2luZyBmb3Igc2hpcCBjZWxscyBhZnRlciB0aGUgZ2FtZSBoYXMgc3RhcnRlZFxuICAgIGNvbnN0IHNoaXBjZWxscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuc2hpcFwiKTtcbiAgICBzaGlwY2VsbHMuZm9yRWFjaCgoc2hpcGNlbGwpID0+IHNoaXBjZWxsLnNldEF0dHJpYnV0ZShcImRyYWdnYWJsZVwiLCBmYWxzZSkpO1xuICB9O1xuXG4gIC8vIEZ1bmN0aW9uIHRvIGhhbmRsZSBjZWxsIGNsaWNrIGR1cmluZyB0aGUgdXNlcidzIHR1cm5cbiAgY29uc3QgaGFuZGxlQ2VsbENsaWNrID0gKGV2ZW50LCByZXNvbHZlKSA9PiB7XG4gICAgaWYgKCFnYW1lU3RhcnRlZCkge1xuICAgICAgLy8gRG8gbm90aGluZyBpZiB0aGUgZ2FtZSBoYXNuJ3Qgc3RhcnRlZFxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBjZWxsID0gZXZlbnQudGFyZ2V0LmNsb3Nlc3QoXCIuY2VsbFwiKTtcbiAgICBpZiAoY2VsbCkge1xuICAgICAgY29uc3Qgcm93ID0gcGFyc2VJbnQoY2VsbC5nZXRBdHRyaWJ1dGUoXCJyb3dcIiksIDEwKTtcbiAgICAgIGNvbnN0IGNvbHVtbiA9IHBhcnNlSW50KGNlbGwuZ2V0QXR0cmlidXRlKFwiY29sdW1uXCIpLCAxMCk7XG4gICAgICByZXNvbHZlKFtyb3csIGNvbHVtbl0pO1xuICAgIH1cbiAgfTtcblxuICAvLyBGdW5jdGlvbiB0byBnZXQgdGhlIHVzZXIncyBtb3ZlIGFzIGEgUHJvbWlzZVxuICBjb25zdCBnZXRVc2VyTW92ZSA9ICgpID0+XG4gICAgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgIGNvbnN0IHVzZXJCb2FyZENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudXNlckJvYXJkQ29udGFpbmVyXCIpO1xuXG4gICAgICAvLyBBZGQgY2xpY2sgZXZlbnQgbGlzdGVuZXIgdG8gaGFuZGxlIHVzZXIncyBtb3ZlXG4gICAgICBjb25zdCBoYW5kbGVDbGljayA9IChldmVudCkgPT4ge1xuICAgICAgICBoYW5kbGVDZWxsQ2xpY2soZXZlbnQsIHJlc29sdmUpO1xuICAgICAgfTtcblxuICAgICAgdXNlckJvYXJkQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBoYW5kbGVDbGljayk7XG4gICAgfSk7XG5cbiAgLy8gRnVuY3Rpb24gdG8gaW5pdGlhbGl6ZSB0aGUgXCJTdGFydFwiIGJ1dHRvblxuICBjb25zdCBpbml0aWFsaXplU3RhcnRCdG4gPSAoKSA9PiB7XG4gICAgY29uc3Qgc3RhcnRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnN0YXJ0QnRuXCIpO1xuICAgIHN0YXJ0QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBzdGFydEdhbWUsIHsgb25jZTogdHJ1ZSB9KTtcbiAgfTtcblxuICAvLyBGdW5jdGlvbiB0byBoYW5kbGUgY2VsbCBzdGF0ZSBjaGFuZ2UgKGhpdCBvciBtaXNzZWQpXG4gIGNvbnN0IGhhbmRsZUNlbGxVcGRhdGUgPSAoY29vcmRzLCBtaXNzZWRTaG90cywgcGxheWVyKSA9PiB7XG4gICAgY29uc3QgW3JvdywgY29sdW1uXSA9IGNvb3JkcztcbiAgICBsZXQgY2VsbDtcblxuICAgIC8vIERldGVybWluZSB0aGUgdGFyZ2V0IGNlbGwgYmFzZWQgb24gdGhlIHBsYXllciAodXNlciBvciBjb21wdXRlcilcbiAgICBpZiAocGxheWVyLmdldE5hbWUoKSA9PT0gXCJ1c2VyXCIpIHtcbiAgICAgIGNlbGwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBgLnVzZXJCb2FyZENvbnRhaW5lciAucm93Om50aC1jaGlsZCgke3JvdyArIDF9KSAuY2VsbDpudGgtY2hpbGQoJHtcbiAgICAgICAgICBjb2x1bW4gKyAxXG4gICAgICAgIH0pYCxcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNlbGwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBgLmNvbXB1dGVyQm9hcmRDb250YWluZXIgLnJvdzpudGgtY2hpbGQoJHtyb3cgKyAxfSkgLmNlbGw6bnRoLWNoaWxkKCR7XG4gICAgICAgICAgY29sdW1uICsgMVxuICAgICAgICB9KWAsXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IGlzSGl0ID0gIW1pc3NlZFNob3RzW3Jvd11bY29sdW1uXTtcblxuICAgIGNlbGwuY2xhc3NMaXN0LmFkZChpc0hpdCA/IFwiaGl0XCIgOiBcIm1pc3NlZFwiKTtcbiAgfTtcblxuICAvLyBGdW5jdGlvbiB0byBkaXNwbGF5IHRoZSB3aW5uZXIgaW4gYSBtb2RhbFxuICBjb25zdCBzaG93V2lubmVyID0gKHdpbm5lcikgPT4ge1xuICAgIGNvbnN0IHdpbm5lck1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi53aW5uZXJNb2RhbFwiKTtcbiAgICBjb25zdCB3aW5uZXJNZXNzYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBjb25zdCByZXN0YXJ0QnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcblxuICAgIHdpbm5lck1lc3NhZ2UuY2xhc3NMaXN0LmFkZChcIndpbm5lck1lc3NhZ2VcIik7XG4gICAgcmVzdGFydEJ0bi5jbGFzc0xpc3QuYWRkKFwicmVzdGFydEJ0blwiKTtcblxuICAgIHJlc3RhcnRCdG4udGV4dENvbnRlbnQgPSBcIlJlc3RhcnRcIjtcbiAgICB3aW5uZXJNZXNzYWdlLnRleHRDb250ZW50ID0gYCR7d2lubmVyfSB3b25gO1xuXG4gICAgd2lubmVyTW9kYWwuYXBwZW5kKHdpbm5lck1lc3NhZ2UsIHJlc3RhcnRCdG4pO1xuICAgIHdpbm5lck1vZGFsLnNob3dNb2RhbCgpO1xuXG4gICAgaW5pdGlhbGl6ZVJlc3RhcnRCdG4oKTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIHJlbmRlckdhbWVCb2FyZCxcbiAgICByZW5kZXJTaGlwcyxcbiAgICBpbml0aWFsaXplU3RhcnRCdG4sXG4gICAgaW5pdGlhbGl6ZVJlc3RhcnRCdG4sXG4gICAgZ2V0VXNlck1vdmUsXG4gICAgaGFuZGxlQ2VsbFVwZGF0ZSxcbiAgICBzaG93V2lubmVyLFxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgRE9NY29udHJvbGxlcjtcbiIsImltcG9ydCBET01jb250cm9sbGVyIGZyb20gXCIuL0RPTWNvbnRyb2xsZXJcIjtcbmltcG9ydCBHYW1lQm9hcmQgZnJvbSBcIi4vZ2FtZUJvYXJkXCI7XG5pbXBvcnQgUGxheWVyIGZyb20gXCIuL3BsYXllclwiO1xuLy8gaW1wb3J0IFNoaXAgZnJvbSBcIi4vc2hpcFwiO1xuXG5jb25zdCBnYW1lID0gKCkgPT4ge1xuICBjb25zdCB1c2VyID0gUGxheWVyKFwidXNlclwiKTtcbiAgY29uc3QgY29tcHV0ZXIgPSBQbGF5ZXIoXCJjb21wdXRlclwiKTtcbiAgY29uc3QgdXNlckJvYXJkID0gR2FtZUJvYXJkKCk7XG4gIGNvbnN0IGNvbXB1dGVyQm9hcmQgPSBHYW1lQm9hcmQoKTtcbiAgY29uc3QgZG9tQ29udHJvbGxlciA9IERPTWNvbnRyb2xsZXIoKTtcbiAgLy8gY29uc3QgbmV3U2hpcCA9IFNoaXAoMyk7XG4gIC8vIHVzZXJCb2FyZC5wbGFjZVNoaXAoMiwgMiwgbmV3U2hpcCk7XG4gIC8vIGNvbnN0IG5ld1NoaXAyID0gU2hpcCgzLCB0cnVlKTtcbiAgLy8gY29tcHV0ZXJCb2FyZC5wbGFjZVNoaXAoNCwgMiwgbmV3U2hpcDIpO1xuXG4gIGNvbnN0IGNvbXB1dGVyQm9hcmRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgIFwiLmNvbXB1dGVyQm9hcmRDb250YWluZXJcIixcbiAgKTtcbiAgY29uc3QgdXNlckJvYXJkQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi51c2VyQm9hcmRDb250YWluZXJcIik7XG4gIGNvbXB1dGVyQm9hcmRDb250YWluZXIuYXBwZW5kQ2hpbGQoXG4gICAgZG9tQ29udHJvbGxlci5yZW5kZXJHYW1lQm9hcmQoY29tcHV0ZXJCb2FyZCksXG4gICk7XG4gIHVzZXJCb2FyZENvbnRhaW5lci5hcHBlbmRDaGlsZChkb21Db250cm9sbGVyLnJlbmRlckdhbWVCb2FyZCh1c2VyQm9hcmQpKTtcblxuICBjb25zdCBwbGF5VHVybiA9IGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB1c2VyQ2VsbENvb3JkcyA9IGF3YWl0IGRvbUNvbnRyb2xsZXIuZ2V0VXNlck1vdmUoKTtcbiAgICBjb25zdCB1c2VyQXR0YWNrU3VjY2VzcyA9IHVzZXIuYXR0YWNrKFxuICAgICAgdXNlckNlbGxDb29yZHNbMF0sXG4gICAgICB1c2VyQ2VsbENvb3Jkc1sxXSxcbiAgICAgIHVzZXJCb2FyZCxcbiAgICApO1xuXG4gICAgaWYgKHVzZXJBdHRhY2tTdWNjZXNzKSB7XG4gICAgICBkb21Db250cm9sbGVyLmhhbmRsZUNlbGxVcGRhdGUoXG4gICAgICAgIHVzZXJDZWxsQ29vcmRzLFxuICAgICAgICB1c2VyQm9hcmQuZ2V0TWlzc2VkU2hvdHMoKSxcbiAgICAgICAgdXNlcixcbiAgICAgICk7XG5cbiAgICAgIGNvbnN0IGNvbXB1dGVyQ2VsbENvb3JkcyA9IGNvbXB1dGVyLnJhbmRvbUF0dGFjayhjb21wdXRlckJvYXJkKTtcblxuICAgICAgZG9tQ29udHJvbGxlci5oYW5kbGVDZWxsVXBkYXRlKFxuICAgICAgICBjb21wdXRlckNlbGxDb29yZHMsXG4gICAgICAgIGNvbXB1dGVyQm9hcmQuZ2V0TWlzc2VkU2hvdHMoKSxcbiAgICAgICAgY29tcHV0ZXIsXG4gICAgICApO1xuICAgIH1cbiAgfTtcbiAgLy8gRnVuY3Rpb24gdG8gY2hlY2sgZm9yIHdpbm5lclxuICBjb25zdCBjaGVja0Zvcldpbm5lciA9ICgpID0+IHtcbiAgICBpZiAodXNlckJvYXJkLmlzQWxsU2hpcHNTdW5rKCkpIHtcbiAgICAgIGRvbUNvbnRyb2xsZXIuc2hvd1dpbm5lcih1c2VyLmdldE5hbWUoKSk7XG4gICAgfSBlbHNlIGlmIChjb21wdXRlckJvYXJkLmlzQWxsU2hpcHNTdW5rKCkpIHtcbiAgICAgIGRvbUNvbnRyb2xsZXIuc2hvd1dpbm5lcihjb21wdXRlci5nZXROYW1lKCkpO1xuICAgIH1cbiAgfTtcbiAgLy8gR2FtZSBsb29wXG4gIGNvbnN0IGdhbWVMb29wID0gYXN5bmMgKCkgPT4ge1xuICAgIC8vIEV4aXQgY29uZGl0aW9uXG4gICAgd2hpbGUgKCF1c2VyQm9hcmQuaXNBbGxTaGlwc1N1bmsoKSAmJiAhY29tcHV0ZXJCb2FyZC5pc0FsbFNoaXBzU3VuaygpKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tYXdhaXQtaW4tbG9vcFxuICAgICAgYXdhaXQgcGxheVR1cm4oKTtcbiAgICB9XG4gICAgY2hlY2tGb3JXaW5uZXIoKTtcbiAgfTtcblxuICBkb21Db250cm9sbGVyLmluaXRpYWxpemVTdGFydEJ0bigpO1xuICBcbiAgdXNlckJvYXJkLnBsYWNlUmFuZG9tU2hpcHMoKTtcbiAgY29tcHV0ZXJCb2FyZC5wbGFjZVJhbmRvbVNoaXBzKCk7XG4gIGRvbUNvbnRyb2xsZXIucmVuZGVyU2hpcHMoY29tcHV0ZXJCb2FyZCk7XG4gIFxuICAvLyBkb21Db250cm9sbGVyLnJlbmRlclNoaXBzKHVzZXJCb2FyZCwgdXNlcik7XG4gIC8vIFN0YXJ0IHRoZSBnYW1lIGxvb3BcbiAgZ2FtZUxvb3AoKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGdhbWU7XG4iLCJpbXBvcnQgU2hpcCBmcm9tIFwiLi9zaGlwXCI7XG5cbmNvbnN0IEdhbWVCb2FyZCA9IChzaXplID0gMTApID0+IHtcbiAgY29uc3QgYm9hcmQgPSBbXTtcbiAgY29uc3QgbWlzc2VkU2hvdHMgPSBbXTtcbiAgY29uc3Qgc2hpcHMgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpICs9IDEpIHtcbiAgICBib2FyZC5wdXNoKFtdKTtcbiAgICBtaXNzZWRTaG90cy5wdXNoKFtdKTtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IHNpemU7IGogKz0gMSkge1xuICAgICAgYm9hcmRbaV0ucHVzaChudWxsKTtcbiAgICAgIG1pc3NlZFNob3RzW2ldLnB1c2goZmFsc2UpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGdldEJvYXJkID0gKCkgPT4gYm9hcmQ7XG4gIGNvbnN0IGdldE1pc3NlZFNob3RzID0gKCkgPT4gbWlzc2VkU2hvdHM7XG5cbiAgY29uc3QgaXNQb3NpdGlvbk91dE9mQm91bmRzID0gKHJvdywgY29sdW1uKSA9PlxuICAgIHJvdyA8IDAgfHwgY29sdW1uIDwgMCB8fCByb3cgPj0gc2l6ZSB8fCBjb2x1bW4gPj0gc2l6ZTtcblxuICBjb25zdCBpc1NoaXBFbmRPdXRPZkJvdW5kcyA9IChyb3csIGNvbHVtbiwgc2hpcCkgPT4ge1xuICAgIGlmIChzaGlwLmdldElzVmVydGljYWwoKSkgcmV0dXJuIHJvdyArIHNoaXAuZ2V0TGVuZ3RoKCkgPiBzaXplO1xuICAgIHJldHVybiBjb2x1bW4gKyBzaGlwLmdldExlbmd0aCgpID4gc2l6ZTtcbiAgfTtcblxuICBjb25zdCBpc1Bvc2l0aW9uVGFrZW4gPSAocm93LCBjb2x1bW4sIHNoaXApID0+IHtcbiAgICBpZiAoc2hpcC5nZXRJc1ZlcnRpY2FsKCkpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5nZXRMZW5ndGgoKTsgaSArPSAxKSB7XG4gICAgICAgIGlmIChib2FyZFtyb3cgKyBpXVtjb2x1bW5dICE9PSBudWxsKSByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmdldExlbmd0aCgpOyBpICs9IDEpIHtcbiAgICAgICAgaWYgKGJvYXJkW3Jvd11bY29sdW1uICsgaV0gIT09IG51bGwpIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgY29uc3QgaXNOZWlnaGJvclRha2VuID0gKHJvdywgY29sdW1uLCBzaGlwKSA9PiB7XG4gICAgaWYgKHNoaXAuZ2V0SXNWZXJ0aWNhbCgpKSB7XG4gICAgICBmb3IgKGxldCBpID0gcm93IC0gMTsgaSA8PSByb3cgKyBzaGlwLmdldExlbmd0aCgpOyBpICs9IDEpIHtcbiAgICAgICAgZm9yIChsZXQgaiA9IGNvbHVtbiAtIDE7IGogPD0gY29sdW1uICsgMTsgaiArPSAxKSB7XG4gICAgICAgICAgaWYgKCFpc1Bvc2l0aW9uT3V0T2ZCb3VuZHMoaSwgaikgJiYgYm9hcmRbaV1bal0pIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAobGV0IGkgPSByb3cgLSAxOyBpIDw9IHJvdyArIDE7IGkgKz0gMSkge1xuICAgICAgICBmb3IgKGxldCBqID0gY29sdW1uIC0gMTsgaiA8PSBjb2x1bW4gKyBzaGlwLmdldExlbmd0aCgpOyBqICs9IDEpIHtcbiAgICAgICAgICBpZiAoIWlzUG9zaXRpb25PdXRPZkJvdW5kcyhpLCBqKSAmJiBib2FyZFtpXVtqXSkgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIGNvbnN0IGlzVmFsaWRQb3NpdGlvbiA9IChyb3csIGNvbHVtbiwgc2hpcCkgPT4ge1xuICAgIGlmIChpc1Bvc2l0aW9uT3V0T2ZCb3VuZHMocm93LCBjb2x1bW4pKSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKGlzU2hpcEVuZE91dE9mQm91bmRzKHJvdywgY29sdW1uLCBzaGlwKSkgcmV0dXJuIGZhbHNlO1xuICAgIGlmIChpc1Bvc2l0aW9uVGFrZW4ocm93LCBjb2x1bW4sIHNoaXApKSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKGlzTmVpZ2hib3JUYWtlbihyb3csIGNvbHVtbiwgc2hpcCkpIHJldHVybiBmYWxzZTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICBjb25zdCBwbGFjZVNoaXAgPSAocm93LCBjb2x1bW4sIHNoaXApID0+IHtcbiAgICBpZiAoIWlzVmFsaWRQb3NpdGlvbihyb3csIGNvbHVtbiwgc2hpcCkpIHJldHVybiBmYWxzZTtcbiAgICBpZiAoc2hpcC5nZXRJc1ZlcnRpY2FsKCkpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5nZXRMZW5ndGgoKTsgaSArPSAxKSB7XG4gICAgICAgIGJvYXJkW3JvdyArIGldW2NvbHVtbl0gPSBzaGlwO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAuZ2V0TGVuZ3RoKCk7IGkgKz0gMSkge1xuICAgICAgICBib2FyZFtyb3ddW2NvbHVtbiArIGldID0gc2hpcDtcbiAgICAgIH1cbiAgICB9XG4gICAgc2hpcC5zZXRTdGFydENlbGwocm93LCBjb2x1bW4pO1xuICAgIHNoaXBzLnB1c2goc2hpcCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgY29uc3QgcmVtb3ZlU2hpcCA9IChyb3csIGNvbHVtbikgPT4ge1xuICAgIGNvbnN0IHNoaXAgPSBib2FyZFtyb3ddW2NvbHVtbl07XG4gICAgY29uc3Qgc3RhcnRSb3cgPSBzaGlwLmdldFN0YXJ0Q2VsbCgpWzBdO1xuICAgIGNvbnN0IHN0YXJ0Q29sdW1uID0gc2hpcC5nZXRTdGFydENlbGwoKVsxXTtcbiAgICBpZiAoc2hpcC5nZXRJc1ZlcnRpY2FsKCkpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5nZXRMZW5ndGgoKTsgaSArPSAxKSB7XG4gICAgICAgIGJvYXJkW3N0YXJ0Um93ICsgaV1bc3RhcnRDb2x1bW5dID0gbnVsbDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmdldExlbmd0aCgpOyBpICs9IDEpIHtcbiAgICAgICAgYm9hcmRbc3RhcnRSb3ddW3N0YXJ0Q29sdW1uICsgaV0gPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICBzaGlwcy5zcGxpY2Uoc2hpcHMuaW5kZXhPZihzaGlwKSwgMSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgY29uc3QgcGxhY2VSYW5kb21TaGlwcyA9ICgpID0+IHtcbiAgICBjb25zdCBzaGlwTGVuZ3RocyA9IFs1LCA0LCAzLCAzLCAyXTtcblxuICAgIHNoaXBMZW5ndGhzLmZvckVhY2goKGxlbmd0aCkgPT4ge1xuICAgICAgbGV0IGlzU2hpcFBsYWNlZCA9IGZhbHNlO1xuXG4gICAgICB3aGlsZSAoIWlzU2hpcFBsYWNlZCkge1xuICAgICAgICBjb25zdCBpc1ZlcnRpY2FsID0gTWF0aC5yYW5kb20oKSA8IDAuNTtcbiAgICAgICAgY29uc3Qgcm93ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogc2l6ZSk7XG4gICAgICAgIGNvbnN0IGNvbHVtbiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHNpemUpO1xuICAgICAgICBjb25zdCBuZXdTaGlwID0gU2hpcChsZW5ndGgsIGlzVmVydGljYWwpO1xuXG4gICAgICAgIGlmIChpc1ZhbGlkUG9zaXRpb24ocm93LCBjb2x1bW4sIG5ld1NoaXApKSB7XG4gICAgICAgICAgcGxhY2VTaGlwKHJvdywgY29sdW1uLCBuZXdTaGlwKTtcbiAgICAgICAgICBpc1NoaXBQbGFjZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgY29uc3QgcmVjaWV2ZUF0dGFjayA9IChyb3csIGNvbHVtbikgPT4ge1xuICAgIGlmIChpc1Bvc2l0aW9uT3V0T2ZCb3VuZHMocm93LCBjb2x1bW4pKSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKGJvYXJkW3Jvd11bY29sdW1uXSkge1xuICAgICAgYm9hcmRbcm93XVtjb2x1bW5dLmhpdCgpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIG1pc3NlZFNob3RzW3Jvd11bY29sdW1uXSA9IHRydWU7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIGNvbnN0IGlzQWxsU2hpcHNTdW5rID0gKCkgPT4gc2hpcHMuZXZlcnkoKHNoaXApID0+IHNoaXAuaXNTdW5rKCkgPT09IHRydWUpO1xuXG4gIHJldHVybiB7XG4gICAgZ2V0Qm9hcmQsXG4gICAgcGxhY2VTaGlwLFxuICAgIHJlbW92ZVNoaXAsXG4gICAgcGxhY2VSYW5kb21TaGlwcyxcbiAgICByZWNpZXZlQXR0YWNrLFxuICAgIGdldE1pc3NlZFNob3RzLFxuICAgIGlzQWxsU2hpcHNTdW5rLFxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgR2FtZUJvYXJkO1xuIiwiY29uc3QgUGxheWVyID0gKG5hbWUpID0+IHtcbiAgY29uc3QgaGl0UmVjb3JkID0gbmV3IFNldCgpO1xuXG4gIGNvbnN0IGhhc0FscmVheUhpdCA9IChyb3csIGNvbHVtbikgPT4gaGl0UmVjb3JkLmhhcyhgJHtyb3d9LSR7Y29sdW1ufWApO1xuXG4gIGNvbnN0IGlzSW52YWxpZFBvc2l0aW9uID0gKHJvdywgY29sdW1uLCBzaXplKSA9PlxuICAgIHJvdyA8IDAgfHwgY29sdW1uIDwgMCB8fCByb3cgPj0gc2l6ZSB8fCBjb2x1bW4gPj0gc2l6ZTtcblxuICBjb25zdCBnZXRSYW5kb21Qb3NpdGlvbiA9IChnYW1lQm9hcmQpID0+XG4gICAgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogZ2FtZUJvYXJkLmdldEJvYXJkKCkubGVuZ3RoKTtcblxuICBjb25zdCBnZXROYW1lID0gKCkgPT4gbmFtZTtcblxuICBjb25zdCBhdHRhY2sgPSAocm93LCBjb2x1bW4sIGdhbWVCb2FyZCkgPT4ge1xuICAgIGlmIChoYXNBbHJlYXlIaXQocm93LCBjb2x1bW4pKSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKCFpc0ludmFsaWRQb3NpdGlvbihyb3csIGNvbHVtbiwgZ2FtZUJvYXJkLmdldEJvYXJkKCkubGVuZ3RoKSkge1xuICAgICAgZ2FtZUJvYXJkLnJlY2lldmVBdHRhY2socm93LCBjb2x1bW4pO1xuICAgICAgaGl0UmVjb3JkLmFkZChgJHtyb3d9LSR7Y29sdW1ufWApO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICBjb25zdCByYW5kb21BdHRhY2sgPSAoZ2FtZUJvYXJkKSA9PiB7XG4gICAgaWYgKGhpdFJlY29yZC5zaXplID09PSAxMDApIHJldHVybiBmYWxzZTtcbiAgICBsZXQgcmFuZG9tUm93ID0gZ2V0UmFuZG9tUG9zaXRpb24oZ2FtZUJvYXJkKTtcbiAgICBsZXQgcmFuZG9tQ29sID0gZ2V0UmFuZG9tUG9zaXRpb24oZ2FtZUJvYXJkKTtcblxuICAgIHdoaWxlIChoYXNBbHJlYXlIaXQocmFuZG9tUm93LCByYW5kb21Db2wpKSB7XG4gICAgICByYW5kb21Sb3cgPSBnZXRSYW5kb21Qb3NpdGlvbihnYW1lQm9hcmQpO1xuICAgICAgcmFuZG9tQ29sID0gZ2V0UmFuZG9tUG9zaXRpb24oZ2FtZUJvYXJkKTtcbiAgICB9XG4gICAgZ2FtZUJvYXJkLnJlY2lldmVBdHRhY2socmFuZG9tUm93LCByYW5kb21Db2wpO1xuICAgIGhpdFJlY29yZC5hZGQoYCR7cmFuZG9tUm93fS0ke3JhbmRvbUNvbH1gKTtcbiAgICByZXR1cm4gW3JhbmRvbVJvdywgcmFuZG9tQ29sXTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGdldE5hbWUsXG4gICAgYXR0YWNrLFxuICAgIHJhbmRvbUF0dGFjayxcbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFBsYXllcjtcbiIsImNvbnN0IFNoaXAgPSAobGVuZ3RoLCBpc1ZlcnRpY2FsID0gZmFsc2UpID0+IHtcbiAgbGV0IGhpdHMgPSAwO1xuICBsZXQgc3RhcnRSb3c7XG4gIGxldCBzdGFydENvbHVtbjtcblxuICBjb25zdCBnZXRMZW5ndGggPSAoKSA9PiBsZW5ndGg7XG4gIGNvbnN0IGdldElzVmVydGljYWwgPSAoKSA9PiBpc1ZlcnRpY2FsO1xuICBjb25zdCBnZXRIaXRzID0gKCkgPT4gaGl0cztcbiAgY29uc3QgaXNTdW5rID0gKCkgPT4gaGl0cyA9PT0gbGVuZ3RoO1xuICBjb25zdCBoaXQgPSAoKSA9PiB7XG4gICAgaWYgKGhpdHMgPCBsZW5ndGgpIGhpdHMgKz0gMTtcbiAgfTtcbiAgY29uc3QgZ2V0U3RhcnRDZWxsID0gKCkgPT4gW3N0YXJ0Um93LCBzdGFydENvbHVtbl07XG4gIGNvbnN0IHNldFN0YXJ0Q2VsbCA9IChyb3csIGNvbHVtbikgPT4ge1xuICAgIHN0YXJ0Um93ID0gcm93O1xuICAgIHN0YXJ0Q29sdW1uID0gY29sdW1uO1xuICB9O1xuICBjb25zdCB0b0pTT04gPSAoKSA9PiAoe1xuICAgIGxlbmd0aDogZ2V0TGVuZ3RoKCksXG4gICAgaXNWZXJ0aWNhbDogZ2V0SXNWZXJ0aWNhbCgpLFxuICAgIGhpdHM6IGdldEhpdHMoKSxcbiAgICBzdGFydENlbGw6IGdldFN0YXJ0Q2VsbCgpLFxuICB9KTtcblxuICByZXR1cm4ge1xuICAgIGdldExlbmd0aCxcbiAgICBnZXRJc1ZlcnRpY2FsLFxuICAgIGdldEhpdHMsXG4gICAgaXNTdW5rLFxuICAgIGhpdCxcbiAgICBnZXRTdGFydENlbGwsXG4gICAgc2V0U3RhcnRDZWxsLFxuICAgIHRvSlNPTixcbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFNoaXA7XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgXCJAaW1wb3J0IHVybChodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tL2NzczI/ZmFtaWx5PVJvYm90bzp3Z2h0QDUwMCZkaXNwbGF5PXN3YXApO1wiXSk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYCosXG4qOjpiZWZvcmUsXG4qOjphZnRlciB7XG4gIG1hcmdpbjogMDtcbiAgcGFkZGluZzogMDtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbn1cblxuaHRtbCxcbmJvZHkge1xuICBoZWlnaHQ6IDEwMCU7XG4gIHdpZHRoOiAxMDAlO1xufVxuXG4uZ2FtZS1jb250YWluZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBnYXA6IDVyZW07XG4gIHBhZGRpbmc6IDJyZW07XG4gIGZvbnQtZmFtaWx5OiAnUm9ib3RvJywgc2Fucy1zZXJpZjtcbn1cblxuLmhlYWRlciB7XG4gIGZvbnQtc2l6ZTogNXJlbTtcbiAgY29sb3I6ICM5YWUyOWE7XG59XG5cbi5ib2FyZHMge1xuICBkaXNwbGF5OiBmbGV4O1xuICBnYXA6IDEwcmVtO1xufVxuXG4uYm9hcmQge1xuICB3aWR0aDogbWF4LWNvbnRlbnQ7XG59XG5cbi5yb3cge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogcm93O1xufVxuXG4uY2VsbCB7XG4gIHdpZHRoOiAycmVtO1xuICBhc3BlY3QtcmF0aW86IDE7XG4gIGJvcmRlcjogMXB4IHNvbGlkICNjY2NjZjU7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgY3Vyc29yOiBwb2ludGVyO1xufVxuXG4uc2hpcCB7XG4gIGJhY2tncm91bmQtY29sb3I6ICM5YWUyOWE7XG4gIGJvcmRlcjogbm9uZTtcbn1cblxuLm1pc3NlZCB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNjY2NjZjU7XG59XG5cbi5oaXQge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMjU1LCAxMTIsIDExMik7XG59XG5cbi53aW5uZXJNb2RhbCB7XG4gIHBhZGRpbmc6IDJyZW0gNXJlbTtcbiAgb3V0bGluZTogbm9uZTtcbiAgYm9yZGVyOiBub25lO1xuICBtYXJnaW46IGF1dG87XG4gIGJvcmRlci1yYWRpdXM6IDFyZW07XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgZ2FwOiAxcmVtO1xufVxuXG4ud2lubmVyTWVzc2FnZSB7XG4gIGZvbnQtc2l6ZTogMS41cmVtO1xuICBmb250LXdlaWdodDogYm9sZDtcbiAgZm9udC1mYW1pbHk6ICdSb2JvdG8nLCBzYW5zLXNlcmlmO1xuICBjb2xvcjogIzkxOTFjYTtcbn1cblxuLmJ1dHRvbkNvbnRhaW5lciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xufVxuXG4uc3RhcnRCdG4sXG4ucmVzdGFydEJ0biB7XG4gIGZvbnQtc2l6ZTogMS41cmVtO1xuICBwYWRkaW5nOiAwLjVyZW0gMS41cmVtO1xuICBib3JkZXItcmFkaXVzOiAxcmVtO1xuICBib3JkZXI6IG5vbmU7XG4gIG91dGxpbmU6IG5vbmU7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgY29sb3I6ICNmZmZmZmY7XG4gIGJhY2tncm91bmQtY29sb3I6ICM5YWUyOWE7XG4gIGZvbnQtd2VpZ2h0OiA3MDA7XG59YCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvc3R5bGVzL3N0eWxlcy5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBRUE7OztFQUdFLFNBQVM7RUFDVCxVQUFVO0VBQ1Ysc0JBQXNCO0FBQ3hCOztBQUVBOztFQUVFLFlBQVk7RUFDWixXQUFXO0FBQ2I7O0FBRUE7RUFDRSxhQUFhO0VBQ2Isc0JBQXNCO0VBQ3RCLG1CQUFtQjtFQUNuQixTQUFTO0VBQ1QsYUFBYTtFQUNiLGlDQUFpQztBQUNuQzs7QUFFQTtFQUNFLGVBQWU7RUFDZixjQUFjO0FBQ2hCOztBQUVBO0VBQ0UsYUFBYTtFQUNiLFVBQVU7QUFDWjs7QUFFQTtFQUNFLGtCQUFrQjtBQUNwQjs7QUFFQTtFQUNFLGFBQWE7RUFDYixtQkFBbUI7QUFDckI7O0FBRUE7RUFDRSxXQUFXO0VBQ1gsZUFBZTtFQUNmLHlCQUF5QjtFQUN6QixrQkFBa0I7RUFDbEIsZUFBZTtBQUNqQjs7QUFFQTtFQUNFLHlCQUF5QjtFQUN6QixZQUFZO0FBQ2Q7O0FBRUE7RUFDRSx5QkFBeUI7QUFDM0I7O0FBRUE7RUFDRSxvQ0FBb0M7QUFDdEM7O0FBRUE7RUFDRSxrQkFBa0I7RUFDbEIsYUFBYTtFQUNiLFlBQVk7RUFDWixZQUFZO0VBQ1osbUJBQW1CO0VBQ25CLGFBQWE7RUFDYixzQkFBc0I7RUFDdEIsa0JBQWtCO0VBQ2xCLFNBQVM7QUFDWDs7QUFFQTtFQUNFLGlCQUFpQjtFQUNqQixpQkFBaUI7RUFDakIsaUNBQWlDO0VBQ2pDLGNBQWM7QUFDaEI7O0FBRUE7RUFDRSxhQUFhO0VBQ2IsdUJBQXVCO0FBQ3pCOztBQUVBOztFQUVFLGlCQUFpQjtFQUNqQixzQkFBc0I7RUFDdEIsbUJBQW1CO0VBQ25CLFlBQVk7RUFDWixhQUFhO0VBQ2IsZUFBZTtFQUNmLGNBQWM7RUFDZCx5QkFBeUI7RUFDekIsZ0JBQWdCO0FBQ2xCXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIkBpbXBvcnQgdXJsKCdodHRwczovL2ZvbnRzLmdvb2dsZWFwaXMuY29tL2NzczI/ZmFtaWx5PVJvYm90bzp3Z2h0QDUwMCZkaXNwbGF5PXN3YXAnKTtcXG5cXG4qLFxcbio6OmJlZm9yZSxcXG4qOjphZnRlciB7XFxuICBtYXJnaW46IDA7XFxuICBwYWRkaW5nOiAwO1xcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG59XFxuXFxuaHRtbCxcXG5ib2R5IHtcXG4gIGhlaWdodDogMTAwJTtcXG4gIHdpZHRoOiAxMDAlO1xcbn1cXG5cXG4uZ2FtZS1jb250YWluZXIge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAgZ2FwOiA1cmVtO1xcbiAgcGFkZGluZzogMnJlbTtcXG4gIGZvbnQtZmFtaWx5OiAnUm9ib3RvJywgc2Fucy1zZXJpZjtcXG59XFxuXFxuLmhlYWRlciB7XFxuICBmb250LXNpemU6IDVyZW07XFxuICBjb2xvcjogIzlhZTI5YTtcXG59XFxuXFxuLmJvYXJkcyB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZ2FwOiAxMHJlbTtcXG59XFxuXFxuLmJvYXJkIHtcXG4gIHdpZHRoOiBtYXgtY29udGVudDtcXG59XFxuXFxuLnJvdyB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcXG59XFxuXFxuLmNlbGwge1xcbiAgd2lkdGg6IDJyZW07XFxuICBhc3BlY3QtcmF0aW86IDE7XFxuICBib3JkZXI6IDFweCBzb2xpZCAjY2NjY2Y1O1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbn1cXG5cXG4uc2hpcCB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjOWFlMjlhO1xcbiAgYm9yZGVyOiBub25lO1xcbn1cXG5cXG4ubWlzc2VkIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNjY2NjZjU7XFxufVxcblxcbi5oaXQge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiKDI1NSwgMTEyLCAxMTIpO1xcbn1cXG5cXG4ud2lubmVyTW9kYWwge1xcbiAgcGFkZGluZzogMnJlbSA1cmVtO1xcbiAgb3V0bGluZTogbm9uZTtcXG4gIGJvcmRlcjogbm9uZTtcXG4gIG1hcmdpbjogYXV0bztcXG4gIGJvcmRlci1yYWRpdXM6IDFyZW07XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGdhcDogMXJlbTtcXG59XFxuXFxuLndpbm5lck1lc3NhZ2Uge1xcbiAgZm9udC1zaXplOiAxLjVyZW07XFxuICBmb250LXdlaWdodDogYm9sZDtcXG4gIGZvbnQtZmFtaWx5OiAnUm9ib3RvJywgc2Fucy1zZXJpZjtcXG4gIGNvbG9yOiAjOTE5MWNhO1xcbn1cXG5cXG4uYnV0dG9uQ29udGFpbmVyIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG59XFxuXFxuLnN0YXJ0QnRuLFxcbi5yZXN0YXJ0QnRuIHtcXG4gIGZvbnQtc2l6ZTogMS41cmVtO1xcbiAgcGFkZGluZzogMC41cmVtIDEuNXJlbTtcXG4gIGJvcmRlci1yYWRpdXM6IDFyZW07XFxuICBib3JkZXI6IG5vbmU7XFxuICBvdXRsaW5lOiBub25lO1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbiAgY29sb3I6ICNmZmZmZmY7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjOWFlMjlhO1xcbiAgZm9udC13ZWlnaHQ6IDcwMDtcXG59XCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xuICB2YXIgbGlzdCA9IFtdO1xuXG4gIC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBpdGVtWzVdICE9PSBcInVuZGVmaW5lZFwiO1xuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KS5qb2luKFwiXCIpO1xuICB9O1xuXG4gIC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG4gIGxpc3QuaSA9IGZ1bmN0aW9uIGkobW9kdWxlcywgbWVkaWEsIGRlZHVwZSwgc3VwcG9ydHMsIGxheWVyKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcbiAgICB9XG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRoaXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIGlkID0gdGhpc1trXVswXTtcbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG4gICAgICBpZiAoZGVkdXBlICYmIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGxheWVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVs1XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzdXBwb3J0cykge1xuICAgICAgICBpZiAoIWl0ZW1bNF0pIHtcbiAgICAgICAgICBpdGVtWzRdID0gXCJcIi5jb25jYXQoc3VwcG9ydHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs0XSA9IHN1cHBvcnRzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGNvbnRlbnQgPSBpdGVtWzFdO1xuICB2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG4gIGlmICghY3NzTWFwcGluZykge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG4gIGlmICh0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGNzc01hcHBpbmcpKSkpO1xuICAgIHZhciBkYXRhID0gXCJzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIi5jb25jYXQoYmFzZTY0KTtcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IFwiLyojIFwiLmNvbmNhdChkYXRhLCBcIiAqL1wiKTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oXCJcXG5cIik7XG4gIH1cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xufTsiLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGVzLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGVzLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3R5bGVzSW5ET00gPSBbXTtcbmZ1bmN0aW9uIGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpIHtcbiAgdmFyIHJlc3VsdCA9IC0xO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlc0luRE9NLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN0eWxlc0luRE9NW2ldLmlkZW50aWZpZXIgPT09IGlkZW50aWZpZXIpIHtcbiAgICAgIHJlc3VsdCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKSB7XG4gIHZhciBpZENvdW50TWFwID0ge307XG4gIHZhciBpZGVudGlmaWVycyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV07XG4gICAgdmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG4gICAgdmFyIGNvdW50ID0gaWRDb3VudE1hcFtpZF0gfHwgMDtcbiAgICB2YXIgaWRlbnRpZmllciA9IFwiXCIuY29uY2F0KGlkLCBcIiBcIikuY29uY2F0KGNvdW50KTtcbiAgICBpZENvdW50TWFwW2lkXSA9IGNvdW50ICsgMTtcbiAgICB2YXIgaW5kZXhCeUlkZW50aWZpZXIgPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICB2YXIgb2JqID0ge1xuICAgICAgY3NzOiBpdGVtWzFdLFxuICAgICAgbWVkaWE6IGl0ZW1bMl0sXG4gICAgICBzb3VyY2VNYXA6IGl0ZW1bM10sXG4gICAgICBzdXBwb3J0czogaXRlbVs0XSxcbiAgICAgIGxheWVyOiBpdGVtWzVdXG4gICAgfTtcbiAgICBpZiAoaW5kZXhCeUlkZW50aWZpZXIgIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHVwZGF0ZXIgPSBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKTtcbiAgICAgIG9wdGlvbnMuYnlJbmRleCA9IGk7XG4gICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoaSwgMCwge1xuICAgICAgICBpZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuICAgICAgICB1cGRhdGVyOiB1cGRhdGVyLFxuICAgICAgICByZWZlcmVuY2VzOiAxXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgfVxuICByZXR1cm4gaWRlbnRpZmllcnM7XG59XG5mdW5jdGlvbiBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKSB7XG4gIHZhciBhcGkgPSBvcHRpb25zLmRvbUFQSShvcHRpb25zKTtcbiAgYXBpLnVwZGF0ZShvYmopO1xuICB2YXIgdXBkYXRlciA9IGZ1bmN0aW9uIHVwZGF0ZXIobmV3T2JqKSB7XG4gICAgaWYgKG5ld09iaikge1xuICAgICAgaWYgKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcCAmJiBuZXdPYmouc3VwcG9ydHMgPT09IG9iai5zdXBwb3J0cyAmJiBuZXdPYmoubGF5ZXIgPT09IG9iai5sYXllcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBhcGkudXBkYXRlKG9iaiA9IG5ld09iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwaS5yZW1vdmUoKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiB1cGRhdGVyO1xufVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGlzdCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgbGlzdCA9IGxpc3QgfHwgW107XG4gIHZhciBsYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucyk7XG4gIHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuICAgIG5ld0xpc3QgPSBuZXdMaXN0IHx8IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tpXTtcbiAgICAgIHZhciBpbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhdLnJlZmVyZW5jZXMtLTtcbiAgICB9XG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIF9pZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW19pXTtcbiAgICAgIHZhciBfaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihfaWRlbnRpZmllcik7XG4gICAgICBpZiAoc3R5bGVzSW5ET01bX2luZGV4XS5yZWZlcmVuY2VzID09PSAwKSB7XG4gICAgICAgIHN0eWxlc0luRE9NW19pbmRleF0udXBkYXRlcigpO1xuICAgICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoX2luZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGFzdElkZW50aWZpZXJzID0gbmV3TGFzdElkZW50aWZpZXJzO1xuICB9O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIG1lbW8gPSB7fTtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBnZXRUYXJnZXQodGFyZ2V0KSB7XG4gIGlmICh0eXBlb2YgbWVtb1t0YXJnZXRdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgdmFyIHN0eWxlVGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xuXG4gICAgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcbiAgICBpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuICAgICAgICAvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuICAgICAgICBzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICBzdHlsZVRhcmdldCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIG1lbW9bdGFyZ2V0XSA9IHN0eWxlVGFyZ2V0O1xuICB9XG4gIHJldHVybiBtZW1vW3RhcmdldF07XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0QnlTZWxlY3RvcihpbnNlcnQsIHN0eWxlKSB7XG4gIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQoaW5zZXJ0KTtcbiAgaWYgKCF0YXJnZXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydCcgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuICB9XG4gIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydEJ5U2VsZWN0b3I7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gIG9wdGlvbnMuc2V0QXR0cmlidXRlcyhlbGVtZW50LCBvcHRpb25zLmF0dHJpYnV0ZXMpO1xuICBvcHRpb25zLmluc2VydChlbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xuICByZXR1cm4gZWxlbWVudDtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0U3R5bGVFbGVtZW50OyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcyhzdHlsZUVsZW1lbnQpIHtcbiAgdmFyIG5vbmNlID0gdHlwZW9mIF9fd2VicGFja19ub25jZV9fICE9PSBcInVuZGVmaW5lZFwiID8gX193ZWJwYWNrX25vbmNlX18gOiBudWxsO1xuICBpZiAobm9uY2UpIHtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgbm9uY2UpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlczsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaikge1xuICB2YXIgY3NzID0gXCJcIjtcbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KG9iai5zdXBwb3J0cywgXCIpIHtcIik7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpO1xuICB9XG4gIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2Ygb2JqLmxheWVyICE9PSBcInVuZGVmaW5lZFwiO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwiQGxheWVyXCIuY29uY2F0KG9iai5sYXllci5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KG9iai5sYXllcikgOiBcIlwiLCBcIiB7XCIpO1xuICB9XG4gIGNzcyArPSBvYmouY3NzO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICB2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcbiAgaWYgKHNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIuY29uY2F0KGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSksIFwiICovXCIpO1xuICB9XG5cbiAgLy8gRm9yIG9sZCBJRVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgICovXG4gIG9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG59XG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XG4gIC8vIGlzdGFuYnVsIGlnbm9yZSBpZlxuICBpZiAoc3R5bGVFbGVtZW50LnBhcmVudE5vZGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBkb21BUEkob3B0aW9ucykge1xuICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKCkge30sXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgfTtcbiAgfVxuICB2YXIgc3R5bGVFbGVtZW50ID0gb3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG4gIHJldHVybiB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUob2JqKSB7XG4gICAgICBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaik7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuICAgIH1cbiAgfTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZG9tQVBJOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50KSB7XG4gIGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XG4gICAgICBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgIH1cbiAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc3R5bGVUYWdUcmFuc2Zvcm07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubmMgPSB1bmRlZmluZWQ7IiwiaW1wb3J0IFwiLi9zdHlsZXMvc3R5bGVzLmNzc1wiO1xuaW1wb3J0IGdhbWUgZnJvbSBcIi4vbW9kdWxlcy9nYW1lXCI7XG5cbmdhbWUoKTsiXSwibmFtZXMiOlsiU2hpcCIsIkRPTWNvbnRyb2xsZXIiLCJjcmVhdGVDZWxsIiwicm93SW5kZXgiLCJjb2x1bW5JbmRleCIsImNlbGwiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc0xpc3QiLCJhZGQiLCJzZXRBdHRyaWJ1dGUiLCJjcmVhdGVSb3ciLCJyb3dBcnJheSIsInJvdyIsImZvckVhY2giLCJfIiwiY29sdW1uIiwiYXBwZW5kQ2hpbGQiLCJyZW5kZXJHYW1lQm9hcmQiLCJnYW1lQm9hcmQiLCJib2FyZEFycmF5IiwiZ2V0Qm9hcmQiLCJib2FyZCIsInJlbmRlclNoaXBzIiwiYm9hcmRDb250YWluZXIiLCJxdWVyeVNlbGVjdG9yIiwicXVlcnlTZWxlY3RvckFsbCIsInNoaXAiLCJyZW1vdmUiLCJjZWxsVmFsdWUiLCJhZGRFdmVudExpc3RlbmVyIiwiZXZlbnQiLCJkYXRhVHJhbnNmZXIiLCJzZXREYXRhIiwiSlNPTiIsInN0cmluZ2lmeSIsInByZXZlbnREZWZhdWx0IiwiZGF0YSIsInBhcnNlIiwiZ2V0RGF0YSIsImNvbnNvbGUiLCJsb2ciLCJvbGRSb3dJbmRleCIsIm9sZENvbHVtbkluZGV4IiwibGVuZ3RoIiwiaXNWZXJ0aWNhbCIsIm5ld0NlbGwiLCJ0YXJnZXQiLCJjbG9zZXN0IiwiY29udGFpbnMiLCJuZXdSb3dJbmRleCIsInBhcnNlSW50IiwiZ2V0QXR0cmlidXRlIiwibmV3Q29sdW1uSW5kZXgiLCJwbGFjZVNoaXAiLCJyZW1vdmVTaGlwIiwiaW5pdGlhbGl6ZVJlc3RhcnRCdG4iLCJyZXN0YXJ0QnRuIiwid2luZG93IiwibG9jYXRpb24iLCJyZWxvYWQiLCJnYW1lU3RhcnRlZCIsInN0YXJ0R2FtZSIsInN0YXJ0QnRuIiwidGV4dENvbnRlbnQiLCJzaGlwY2VsbHMiLCJzaGlwY2VsbCIsImhhbmRsZUNlbGxDbGljayIsInJlc29sdmUiLCJnZXRVc2VyTW92ZSIsIlByb21pc2UiLCJ1c2VyQm9hcmRDb250YWluZXIiLCJoYW5kbGVDbGljayIsImluaXRpYWxpemVTdGFydEJ0biIsIm9uY2UiLCJoYW5kbGVDZWxsVXBkYXRlIiwiY29vcmRzIiwibWlzc2VkU2hvdHMiLCJwbGF5ZXIiLCJnZXROYW1lIiwiaXNIaXQiLCJzaG93V2lubmVyIiwid2lubmVyIiwid2lubmVyTW9kYWwiLCJ3aW5uZXJNZXNzYWdlIiwiYXBwZW5kIiwic2hvd01vZGFsIiwiR2FtZUJvYXJkIiwiUGxheWVyIiwiZ2FtZSIsInVzZXIiLCJjb21wdXRlciIsInVzZXJCb2FyZCIsImNvbXB1dGVyQm9hcmQiLCJkb21Db250cm9sbGVyIiwiY29tcHV0ZXJCb2FyZENvbnRhaW5lciIsInBsYXlUdXJuIiwidXNlckNlbGxDb29yZHMiLCJ1c2VyQXR0YWNrU3VjY2VzcyIsImF0dGFjayIsImdldE1pc3NlZFNob3RzIiwiY29tcHV0ZXJDZWxsQ29vcmRzIiwicmFuZG9tQXR0YWNrIiwiY2hlY2tGb3JXaW5uZXIiLCJpc0FsbFNoaXBzU3VuayIsImdhbWVMb29wIiwicGxhY2VSYW5kb21TaGlwcyIsInNpemUiLCJhcmd1bWVudHMiLCJ1bmRlZmluZWQiLCJzaGlwcyIsImkiLCJwdXNoIiwiaiIsImlzUG9zaXRpb25PdXRPZkJvdW5kcyIsImlzU2hpcEVuZE91dE9mQm91bmRzIiwiZ2V0SXNWZXJ0aWNhbCIsImdldExlbmd0aCIsImlzUG9zaXRpb25UYWtlbiIsImlzTmVpZ2hib3JUYWtlbiIsImlzVmFsaWRQb3NpdGlvbiIsInNldFN0YXJ0Q2VsbCIsInN0YXJ0Um93IiwiZ2V0U3RhcnRDZWxsIiwic3RhcnRDb2x1bW4iLCJzcGxpY2UiLCJpbmRleE9mIiwic2hpcExlbmd0aHMiLCJpc1NoaXBQbGFjZWQiLCJNYXRoIiwicmFuZG9tIiwiZmxvb3IiLCJuZXdTaGlwIiwicmVjaWV2ZUF0dGFjayIsImhpdCIsImV2ZXJ5IiwiaXNTdW5rIiwibmFtZSIsImhpdFJlY29yZCIsIlNldCIsImhhc0FscmVheUhpdCIsImhhcyIsImlzSW52YWxpZFBvc2l0aW9uIiwiZ2V0UmFuZG9tUG9zaXRpb24iLCJyYW5kb21Sb3ciLCJyYW5kb21Db2wiLCJoaXRzIiwiZ2V0SGl0cyIsInRvSlNPTiIsInN0YXJ0Q2VsbCJdLCJzb3VyY2VSb290IjoiIn0=