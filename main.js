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
            console.log("Setting drag data:", rowIndex, columnIndex, cellValue);
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

        // Remove ship from old coordinates
        gameBoard.removeShip(oldRowIndex, oldColumnIndex);
        const oldCell = boardContainer.querySelector(`.row:nth-child(${oldRowIndex + 1}) .cell:nth-child(${oldColumnIndex + 1})`);
        oldCell.classList.remove("ship");

        // Place ship in new coordinates
        gameBoard.placeShip(newRowIndex, newColumnIndex, ship);

        // Update the visual representation of the ship
        renderShips(gameBoard);
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
    if (ship.getIsVertical()) return row + ship.getLength() >= size;
    return column + ship.getLength() >= size;
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

.boards {
  display: flex;
  justify-content: space-around;
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
  border: 1px solid blue;
  text-align: center;
}

.ship {
  background-color: green;
  border: none;
}

.missed {
  background-color: aqua;
}

.hit {
  background-color: red;
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
}

.buttonContainer {
  display: flex;
  justify-content: center;
}

.startBtn,
.restartBtn {
  font-size: 1rem;
  padding: 0.5rem 1.5rem;
  border-radius: 1rem;
  border: none;
  outline: none;
  cursor: pointer;
}`, "",{"version":3,"sources":["webpack://./src/styles/styles.css"],"names":[],"mappings":"AAAA;;;EAGE,SAAS;EACT,UAAU;EACV,sBAAsB;AACxB;;AAEA;;EAEE,YAAY;EACZ,WAAW;AACb;;AAEA;EACE,aAAa;EACb,6BAA6B;AAC/B;;AAEA;EACE,kBAAkB;AACpB;;AAEA;EACE,aAAa;EACb,mBAAmB;AACrB;;AAEA;EACE,WAAW;EACX,eAAe;EACf,sBAAsB;EACtB,kBAAkB;AACpB;;AAEA;EACE,uBAAuB;EACvB,YAAY;AACd;;AAEA;EACE,sBAAsB;AACxB;;AAEA;EACE,qBAAqB;AACvB;;AAEA;EACE,kBAAkB;EAClB,aAAa;EACb,YAAY;EACZ,YAAY;EACZ,mBAAmB;EACnB,aAAa;EACb,sBAAsB;EACtB,kBAAkB;EAClB,SAAS;AACX;;AAEA;EACE,iBAAiB;EACjB,iBAAiB;AACnB;;AAEA;EACE,aAAa;EACb,uBAAuB;AACzB;;AAEA;;EAEE,eAAe;EACf,sBAAsB;EACtB,mBAAmB;EACnB,YAAY;EACZ,aAAa;EACb,eAAe;AACjB","sourcesContent":["*,\n*::before,\n*::after {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\nhtml,\nbody {\n  height: 100%;\n  width: 100%;\n}\n\n.boards {\n  display: flex;\n  justify-content: space-around;\n}\n\n.board {\n  width: max-content;\n}\n\n.row {\n  display: flex;\n  flex-direction: row;\n}\n\n.cell {\n  width: 2rem;\n  aspect-ratio: 1;\n  border: 1px solid blue;\n  text-align: center;\n}\n\n.ship {\n  background-color: green;\n  border: none;\n}\n\n.missed {\n  background-color: aqua;\n}\n\n.hit {\n  background-color: red;\n}\n\n.winnerModal {\n  padding: 2rem 5rem;\n  outline: none;\n  border: none;\n  margin: auto;\n  border-radius: 1rem;\n  display: flex;\n  flex-direction: column;\n  text-align: center;\n  gap: 1rem;\n}\n\n.winnerMessage {\n  font-size: 1.5rem;\n  font-weight: bold;\n}\n\n.buttonContainer {\n  display: flex;\n  justify-content: center;\n}\n\n.startBtn,\n.restartBtn {\n  font-size: 1rem;\n  padding: 0.5rem 1.5rem;\n  border-radius: 1rem;\n  border: none;\n  outline: none;\n  cursor: pointer;\n}"],"sourceRoot":""}]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQTtBQUMwQjtBQUUxQixNQUFNQyxhQUFhLEdBQUdBLENBQUEsS0FBTTtFQUMxQjtFQUNBLE1BQU1DLFVBQVUsR0FBR0EsQ0FBQ0MsUUFBUSxFQUFFQyxXQUFXLEtBQUs7SUFDNUMsTUFBTUMsSUFBSSxHQUFHQyxRQUFRLENBQUNDLGFBQWEsQ0FBQyxLQUFLLENBQUM7SUFDMUNGLElBQUksQ0FBQ0csU0FBUyxDQUFDQyxHQUFHLENBQUMsTUFBTSxDQUFDO0lBQzFCSixJQUFJLENBQUNLLFlBQVksQ0FBQyxLQUFLLEVBQUVQLFFBQVEsQ0FBQztJQUNsQ0UsSUFBSSxDQUFDSyxZQUFZLENBQUMsUUFBUSxFQUFFTixXQUFXLENBQUM7SUFDeEMsT0FBT0MsSUFBSTtFQUNiLENBQUM7O0VBRUQ7RUFDQSxNQUFNTSxTQUFTLEdBQUdBLENBQUNDLFFBQVEsRUFBRVQsUUFBUSxLQUFLO0lBQ3hDLE1BQU1VLEdBQUcsR0FBR1AsUUFBUSxDQUFDQyxhQUFhLENBQUMsS0FBSyxDQUFDO0lBQ3pDTSxHQUFHLENBQUNMLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDLEtBQUssQ0FBQztJQUN4QkcsUUFBUSxDQUFDRSxPQUFPLENBQUMsQ0FBQ0MsQ0FBQyxFQUFFQyxNQUFNLEtBQUs7TUFDOUIsTUFBTVgsSUFBSSxHQUFHSCxVQUFVLENBQUNDLFFBQVEsRUFBRWEsTUFBTSxDQUFDO01BQ3pDSCxHQUFHLENBQUNJLFdBQVcsQ0FBQ1osSUFBSSxDQUFDO0lBQ3ZCLENBQUMsQ0FBQztJQUNGLE9BQU9RLEdBQUc7RUFDWixDQUFDOztFQUVEO0VBQ0EsTUFBTUssZUFBZSxHQUFJQyxTQUFTLElBQUs7SUFDckMsTUFBTUMsVUFBVSxHQUFHRCxTQUFTLENBQUNFLFFBQVEsQ0FBQyxDQUFDO0lBQ3ZDLE1BQU1DLEtBQUssR0FBR2hCLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLEtBQUssQ0FBQztJQUMzQ2UsS0FBSyxDQUFDZCxTQUFTLENBQUNDLEdBQUcsQ0FBQyxPQUFPLENBQUM7SUFFNUJXLFVBQVUsQ0FBQ04sT0FBTyxDQUFDLENBQUNGLFFBQVEsRUFBRVQsUUFBUSxLQUFLO01BQ3pDLE1BQU1VLEdBQUcsR0FBR0YsU0FBUyxDQUFDQyxRQUFRLEVBQUVULFFBQVEsQ0FBQztNQUN6Q21CLEtBQUssQ0FBQ0wsV0FBVyxDQUFDSixHQUFHLENBQUM7SUFDeEIsQ0FBQyxDQUFDO0lBQ0YsT0FBT1MsS0FBSztFQUNkLENBQUM7O0VBRUQ7RUFDQSxNQUFNQyxXQUFXLEdBQUlKLFNBQVMsSUFBSztJQUNqQyxNQUFNQyxVQUFVLEdBQUdELFNBQVMsQ0FBQ0UsUUFBUSxDQUFDLENBQUM7SUFDdkMsTUFBTUcsY0FBYyxHQUFHbEIsUUFBUSxDQUFDbUIsYUFBYSxDQUFDLHlCQUF5QixDQUFDOztJQUV4RTtJQUNBRCxjQUFjLENBQUNFLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxDQUFDWixPQUFPLENBQUVhLElBQUksSUFBSztNQUN6REEsSUFBSSxDQUFDbkIsU0FBUyxDQUFDb0IsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUMvQixDQUFDLENBQUM7SUFFRlIsVUFBVSxDQUFDTixPQUFPLENBQUMsQ0FBQ0YsUUFBUSxFQUFFVCxRQUFRLEtBQUs7TUFDekNTLFFBQVEsQ0FBQ0UsT0FBTyxDQUFDLENBQUNlLFNBQVMsRUFBRXpCLFdBQVcsS0FBSztRQUMzQyxNQUFNQyxJQUFJLEdBQUdtQixjQUFjLENBQUNDLGFBQWEsQ0FDdEMsa0JBQWlCdEIsUUFBUSxHQUFHLENBQUUscUJBQW9CQyxXQUFXLEdBQUcsQ0FBRSxHQUNyRSxDQUFDOztRQUVEO1FBQ0EsSUFBSXlCLFNBQVMsRUFBRTtVQUNieEIsSUFBSSxDQUFDRyxTQUFTLENBQUNDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1VBQzVCSixJQUFJLENBQUNLLFlBQVksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDOztVQUVwQztVQUNBTCxJQUFJLENBQUN5QixnQkFBZ0IsQ0FBQyxXQUFXLEVBQUdDLEtBQUssSUFBSztZQUM1Q0MsT0FBTyxDQUFDQyxHQUFHLENBQUMsb0JBQW9CLEVBQUU5QixRQUFRLEVBQUVDLFdBQVcsRUFBRXlCLFNBQVMsQ0FBQztZQUNuRUUsS0FBSyxDQUFDRyxZQUFZLENBQUNDLE9BQU8sQ0FDeEIsWUFBWSxFQUNaQyxJQUFJLENBQUNDLFNBQVMsQ0FBQztjQUNibEMsUUFBUTtjQUNSQyxXQUFXO2NBQ1h5QjtZQUNGLENBQUMsQ0FDSCxDQUFDO1VBQ0gsQ0FBQyxDQUFDO1FBQ0o7TUFDRixDQUFDLENBQUM7SUFDSixDQUFDLENBQUM7O0lBRUY7SUFDQUwsY0FBYyxDQUFDTSxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUdDLEtBQUssSUFBSztNQUNqREEsS0FBSyxDQUFDTyxjQUFjLENBQUMsQ0FBQztNQUV0QixNQUFNQyxJQUFJLEdBQUdILElBQUksQ0FBQ0ksS0FBSyxDQUFDVCxLQUFLLENBQUNHLFlBQVksQ0FBQ08sT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO01BQ2pFVCxPQUFPLENBQUNDLEdBQUcsQ0FBQyxtQkFBbUIsRUFBRU0sSUFBSSxDQUFDO01BRXRDLE1BQU1HLFdBQVcsR0FBR0gsSUFBSSxDQUFDcEMsUUFBUTtNQUNqQyxNQUFNd0MsY0FBYyxHQUFHSixJQUFJLENBQUNuQyxXQUFXO01BQ3ZDLE1BQU11QixJQUFJLEdBQUczQixpREFBSSxDQUFDdUMsSUFBSSxDQUFDVixTQUFTLENBQUNlLE1BQU0sRUFBRUwsSUFBSSxDQUFDVixTQUFTLENBQUNnQixVQUFVLENBQUM7TUFDbkUsTUFBTUMsT0FBTyxHQUFHZixLQUFLLENBQUNnQixNQUFNLENBQUNDLE9BQU8sQ0FBQyxPQUFPLENBQUM7O01BRTdDO01BQ0EsSUFBSUYsT0FBTyxJQUFJLENBQUNBLE9BQU8sQ0FBQ3RDLFNBQVMsQ0FBQ3lDLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUNsRCxNQUFNQyxXQUFXLEdBQUdDLFFBQVEsQ0FBQ0wsT0FBTyxDQUFDTSxZQUFZLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxDQUFDO1FBQzdELE1BQU1DLGNBQWMsR0FBR0YsUUFBUSxDQUFDTCxPQUFPLENBQUNNLFlBQVksQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFFLENBQUM7O1FBRW5FO1FBQ0FqQyxTQUFTLENBQUNtQyxVQUFVLENBQUNaLFdBQVcsRUFBRUMsY0FBYyxDQUFDO1FBQ2pELE1BQU1ZLE9BQU8sR0FBRy9CLGNBQWMsQ0FBQ0MsYUFBYSxDQUN6QyxrQkFBaUJpQixXQUFXLEdBQUcsQ0FBRSxxQkFDaENDLGNBQWMsR0FBRyxDQUNsQixHQUNILENBQUM7UUFDRFksT0FBTyxDQUFDL0MsU0FBUyxDQUFDb0IsTUFBTSxDQUFDLE1BQU0sQ0FBQzs7UUFFaEM7UUFDQVQsU0FBUyxDQUFDcUMsU0FBUyxDQUFDTixXQUFXLEVBQUVHLGNBQWMsRUFBRTFCLElBQUksQ0FBQzs7UUFFdEQ7UUFDQUosV0FBVyxDQUFDSixTQUFTLENBQUM7TUFDeEI7SUFDRixDQUFDLENBQUM7O0lBRUY7SUFDQUssY0FBYyxDQUFDTSxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUdDLEtBQUssSUFBSztNQUNyREEsS0FBSyxDQUFDTyxjQUFjLENBQUMsQ0FBQztJQUN4QixDQUFDLENBQUM7RUFDSixDQUFDOztFQUVEO0VBQ0EsTUFBTW1CLG9CQUFvQixHQUFHQSxDQUFBLEtBQU07SUFDakMsTUFBTUMsVUFBVSxHQUFHcEQsUUFBUSxDQUFDbUIsYUFBYSxDQUFDLGFBQWEsQ0FBQztJQUN4RGlDLFVBQVUsQ0FBQzVCLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxNQUFNO01BQ3pDNkIsTUFBTSxDQUFDQyxRQUFRLENBQUNDLE1BQU0sQ0FBQyxDQUFDO0lBQzFCLENBQUMsQ0FBQztFQUNKLENBQUM7RUFFRCxJQUFJQyxXQUFXLEdBQUcsS0FBSzs7RUFFdkI7RUFDQSxNQUFNQyxTQUFTLEdBQUdBLENBQUEsS0FBTTtJQUN0QkQsV0FBVyxHQUFHLElBQUk7SUFDbEIsTUFBTUUsUUFBUSxHQUFHMUQsUUFBUSxDQUFDbUIsYUFBYSxDQUFDLFdBQVcsQ0FBQztJQUNwRHVDLFFBQVEsQ0FBQ0MsV0FBVyxHQUFHLFNBQVM7SUFDaENELFFBQVEsQ0FBQ2xDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxNQUFNO01BQ3ZDNkIsTUFBTSxDQUFDQyxRQUFRLENBQUNDLE1BQU0sQ0FBQyxDQUFDO0lBQzFCLENBQUMsQ0FBQzs7SUFFRjtJQUNBLE1BQU1LLFNBQVMsR0FBRzVELFFBQVEsQ0FBQ29CLGdCQUFnQixDQUFDLE9BQU8sQ0FBQztJQUNwRHdDLFNBQVMsQ0FBQ3BELE9BQU8sQ0FBRXFELFFBQVEsSUFBS0EsUUFBUSxDQUFDekQsWUFBWSxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUMsQ0FBQztFQUM1RSxDQUFDOztFQUVEO0VBQ0EsTUFBTTBELGVBQWUsR0FBR0EsQ0FBQ3JDLEtBQUssRUFBRXNDLE9BQU8sS0FBSztJQUMxQyxJQUFJLENBQUNQLFdBQVcsRUFBRTtNQUNoQjtNQUNBO0lBQ0Y7SUFDQSxNQUFNekQsSUFBSSxHQUFHMEIsS0FBSyxDQUFDZ0IsTUFBTSxDQUFDQyxPQUFPLENBQUMsT0FBTyxDQUFDO0lBQzFDLElBQUkzQyxJQUFJLEVBQUU7TUFDUixNQUFNUSxHQUFHLEdBQUdzQyxRQUFRLENBQUM5QyxJQUFJLENBQUMrQyxZQUFZLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxDQUFDO01BQ2xELE1BQU1wQyxNQUFNLEdBQUdtQyxRQUFRLENBQUM5QyxJQUFJLENBQUMrQyxZQUFZLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxDQUFDO01BQ3hEaUIsT0FBTyxDQUFDLENBQUN4RCxHQUFHLEVBQUVHLE1BQU0sQ0FBQyxDQUFDO0lBQ3hCO0VBQ0YsQ0FBQzs7RUFFRDtFQUNBLE1BQU1zRCxXQUFXLEdBQUdBLENBQUEsS0FDbEIsSUFBSUMsT0FBTyxDQUFFRixPQUFPLElBQUs7SUFDdkIsTUFBTUcsa0JBQWtCLEdBQUdsRSxRQUFRLENBQUNtQixhQUFhLENBQUMscUJBQXFCLENBQUM7O0lBRXhFO0lBQ0EsTUFBTWdELFdBQVcsR0FBSTFDLEtBQUssSUFBSztNQUM3QnFDLGVBQWUsQ0FBQ3JDLEtBQUssRUFBRXNDLE9BQU8sQ0FBQztJQUNqQyxDQUFDO0lBRURHLGtCQUFrQixDQUFDMUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFMkMsV0FBVyxDQUFDO0VBQzNELENBQUMsQ0FBQzs7RUFFSjtFQUNBLE1BQU1DLGtCQUFrQixHQUFHQSxDQUFBLEtBQU07SUFDL0IsTUFBTVYsUUFBUSxHQUFHMUQsUUFBUSxDQUFDbUIsYUFBYSxDQUFDLFdBQVcsQ0FBQztJQUNwRHVDLFFBQVEsQ0FBQ2xDLGdCQUFnQixDQUFDLE9BQU8sRUFBRWlDLFNBQVMsRUFBRTtNQUFFWSxJQUFJLEVBQUU7SUFBSyxDQUFDLENBQUM7RUFDL0QsQ0FBQzs7RUFFRDtFQUNBLE1BQU1DLGdCQUFnQixHQUFHQSxDQUFDQyxNQUFNLEVBQUVDLFdBQVcsRUFBRUMsTUFBTSxLQUFLO0lBQ3hELE1BQU0sQ0FBQ2xFLEdBQUcsRUFBRUcsTUFBTSxDQUFDLEdBQUc2RCxNQUFNO0lBQzVCLElBQUl4RSxJQUFJOztJQUVSO0lBQ0EsSUFBSTBFLE1BQU0sQ0FBQ0MsT0FBTyxDQUFDLENBQUMsS0FBSyxNQUFNLEVBQUU7TUFDL0IzRSxJQUFJLEdBQUdDLFFBQVEsQ0FBQ21CLGFBQWEsQ0FDMUIsc0NBQXFDWixHQUFHLEdBQUcsQ0FBRSxxQkFDNUNHLE1BQU0sR0FBRyxDQUNWLEdBQ0gsQ0FBQztJQUNILENBQUMsTUFBTTtNQUNMWCxJQUFJLEdBQUdDLFFBQVEsQ0FBQ21CLGFBQWEsQ0FDMUIsMENBQXlDWixHQUFHLEdBQUcsQ0FBRSxxQkFDaERHLE1BQU0sR0FBRyxDQUNWLEdBQ0gsQ0FBQztJQUNIO0lBRUEsTUFBTWlFLEtBQUssR0FBRyxDQUFDSCxXQUFXLENBQUNqRSxHQUFHLENBQUMsQ0FBQ0csTUFBTSxDQUFDO0lBRXZDWCxJQUFJLENBQUNHLFNBQVMsQ0FBQ0MsR0FBRyxDQUFDd0UsS0FBSyxHQUFHLEtBQUssR0FBRyxRQUFRLENBQUM7RUFDOUMsQ0FBQzs7RUFFRDtFQUNBLE1BQU1DLFVBQVUsR0FBSUMsTUFBTSxJQUFLO0lBQzdCLE1BQU1DLFdBQVcsR0FBRzlFLFFBQVEsQ0FBQ21CLGFBQWEsQ0FBQyxjQUFjLENBQUM7SUFDMUQsTUFBTTRELGFBQWEsR0FBRy9FLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLEtBQUssQ0FBQztJQUNuRCxNQUFNbUQsVUFBVSxHQUFHcEQsUUFBUSxDQUFDQyxhQUFhLENBQUMsUUFBUSxDQUFDO0lBRW5EOEUsYUFBYSxDQUFDN0UsU0FBUyxDQUFDQyxHQUFHLENBQUMsZUFBZSxDQUFDO0lBQzVDaUQsVUFBVSxDQUFDbEQsU0FBUyxDQUFDQyxHQUFHLENBQUMsWUFBWSxDQUFDO0lBRXRDaUQsVUFBVSxDQUFDTyxXQUFXLEdBQUcsU0FBUztJQUNsQ29CLGFBQWEsQ0FBQ3BCLFdBQVcsR0FBSSxHQUFFa0IsTUFBTyxNQUFLO0lBRTNDQyxXQUFXLENBQUNFLE1BQU0sQ0FBQ0QsYUFBYSxFQUFFM0IsVUFBVSxDQUFDO0lBQzdDMEIsV0FBVyxDQUFDRyxTQUFTLENBQUMsQ0FBQztJQUV2QjlCLG9CQUFvQixDQUFDLENBQUM7RUFDeEIsQ0FBQztFQUVELE9BQU87SUFDTHZDLGVBQWU7SUFDZkssV0FBVztJQUNYbUQsa0JBQWtCO0lBQ2xCakIsb0JBQW9CO0lBQ3BCYSxXQUFXO0lBQ1hNLGdCQUFnQjtJQUNoQk07RUFDRixDQUFDO0FBQ0gsQ0FBQztBQUVELGlFQUFlakYsYUFBYTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNqT2dCO0FBQ1I7QUFDTjtBQUM5Qjs7QUFFQSxNQUFNeUYsSUFBSSxHQUFHQSxDQUFBLEtBQU07RUFDakIsTUFBTUMsSUFBSSxHQUFHRixtREFBTSxDQUFDLE1BQU0sQ0FBQztFQUMzQixNQUFNRyxRQUFRLEdBQUdILG1EQUFNLENBQUMsVUFBVSxDQUFDO0VBQ25DLE1BQU1JLFNBQVMsR0FBR0wsc0RBQVMsQ0FBQyxDQUFDO0VBQzdCLE1BQU1NLGFBQWEsR0FBR04sc0RBQVMsQ0FBQyxDQUFDO0VBQ2pDLE1BQU1PLGFBQWEsR0FBRzlGLDBEQUFhLENBQUMsQ0FBQztFQUNyQztFQUNBO0VBQ0E7RUFDQTs7RUFFQSxNQUFNK0Ysc0JBQXNCLEdBQUcxRixRQUFRLENBQUNtQixhQUFhLENBQ25ELHlCQUNGLENBQUM7RUFDRCxNQUFNK0Msa0JBQWtCLEdBQUdsRSxRQUFRLENBQUNtQixhQUFhLENBQUMscUJBQXFCLENBQUM7RUFDeEV1RSxzQkFBc0IsQ0FBQy9FLFdBQVcsQ0FDaEM4RSxhQUFhLENBQUM3RSxlQUFlLENBQUM0RSxhQUFhLENBQzdDLENBQUM7RUFDRHRCLGtCQUFrQixDQUFDdkQsV0FBVyxDQUFDOEUsYUFBYSxDQUFDN0UsZUFBZSxDQUFDMkUsU0FBUyxDQUFDLENBQUM7RUFFeEUsTUFBTUksUUFBUSxHQUFHLE1BQUFBLENBQUEsS0FBWTtJQUMzQixNQUFNQyxjQUFjLEdBQUcsTUFBTUgsYUFBYSxDQUFDekIsV0FBVyxDQUFDLENBQUM7SUFDeEQsTUFBTTZCLGlCQUFpQixHQUFHUixJQUFJLENBQUNTLE1BQU0sQ0FDbkNGLGNBQWMsQ0FBQyxDQUFDLENBQUMsRUFDakJBLGNBQWMsQ0FBQyxDQUFDLENBQUMsRUFDakJMLFNBQ0YsQ0FBQztJQUVELElBQUlNLGlCQUFpQixFQUFFO01BQ3JCSixhQUFhLENBQUNuQixnQkFBZ0IsQ0FDNUJzQixjQUFjLEVBQ2RMLFNBQVMsQ0FBQ1EsY0FBYyxDQUFDLENBQUMsRUFDMUJWLElBQ0YsQ0FBQztNQUVELE1BQU1XLGtCQUFrQixHQUFHVixRQUFRLENBQUNXLFlBQVksQ0FBQ1QsYUFBYSxDQUFDO01BRS9EQyxhQUFhLENBQUNuQixnQkFBZ0IsQ0FDNUIwQixrQkFBa0IsRUFDbEJSLGFBQWEsQ0FBQ08sY0FBYyxDQUFDLENBQUMsRUFDOUJULFFBQ0YsQ0FBQztJQUNIO0VBQ0YsQ0FBQztFQUNEO0VBQ0EsTUFBTVksY0FBYyxHQUFHQSxDQUFBLEtBQU07SUFDM0IsSUFBSVgsU0FBUyxDQUFDWSxjQUFjLENBQUMsQ0FBQyxFQUFFO01BQzlCVixhQUFhLENBQUNiLFVBQVUsQ0FBQ1MsSUFBSSxDQUFDWCxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQzFDLENBQUMsTUFBTSxJQUFJYyxhQUFhLENBQUNXLGNBQWMsQ0FBQyxDQUFDLEVBQUU7TUFDekNWLGFBQWEsQ0FBQ2IsVUFBVSxDQUFDVSxRQUFRLENBQUNaLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDOUM7RUFDRixDQUFDO0VBQ0Q7RUFDQSxNQUFNMEIsUUFBUSxHQUFHLE1BQUFBLENBQUEsS0FBWTtJQUMzQjtJQUNBLE9BQU8sQ0FBQ2IsU0FBUyxDQUFDWSxjQUFjLENBQUMsQ0FBQyxJQUFJLENBQUNYLGFBQWEsQ0FBQ1csY0FBYyxDQUFDLENBQUMsRUFBRTtNQUNyRTtNQUNBLE1BQU1SLFFBQVEsQ0FBQyxDQUFDO0lBQ2xCO0lBQ0FPLGNBQWMsQ0FBQyxDQUFDO0VBQ2xCLENBQUM7RUFFRFQsYUFBYSxDQUFDckIsa0JBQWtCLENBQUMsQ0FBQztFQUVsQ21CLFNBQVMsQ0FBQ2MsZ0JBQWdCLENBQUMsQ0FBQztFQUM1QmIsYUFBYSxDQUFDYSxnQkFBZ0IsQ0FBQyxDQUFDO0VBQ2hDWixhQUFhLENBQUN4RSxXQUFXLENBQUN1RSxhQUFhLENBQUM7O0VBRXhDO0VBQ0E7RUFDQVksUUFBUSxDQUFDLENBQUM7QUFDWixDQUFDO0FBRUQsaUVBQWVoQixJQUFJOzs7Ozs7Ozs7Ozs7Ozs7QUM5RU87QUFFMUIsTUFBTUYsU0FBUyxHQUFHLFNBQUFBLENBQUEsRUFBZTtFQUFBLElBQWRvQixJQUFJLEdBQUFDLFNBQUEsQ0FBQWpFLE1BQUEsUUFBQWlFLFNBQUEsUUFBQUMsU0FBQSxHQUFBRCxTQUFBLE1BQUcsRUFBRTtFQUMxQixNQUFNdkYsS0FBSyxHQUFHLEVBQUU7RUFDaEIsTUFBTXdELFdBQVcsR0FBRyxFQUFFO0VBQ3RCLE1BQU1pQyxLQUFLLEdBQUcsRUFBRTtFQUNoQixLQUFLLElBQUlDLENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsR0FBR0osSUFBSSxFQUFFSSxDQUFDLElBQUksQ0FBQyxFQUFFO0lBQ2hDMUYsS0FBSyxDQUFDMkYsSUFBSSxDQUFDLEVBQUUsQ0FBQztJQUNkbkMsV0FBVyxDQUFDbUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztJQUNwQixLQUFLLElBQUlDLENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsR0FBR04sSUFBSSxFQUFFTSxDQUFDLElBQUksQ0FBQyxFQUFFO01BQ2hDNUYsS0FBSyxDQUFDMEYsQ0FBQyxDQUFDLENBQUNDLElBQUksQ0FBQyxJQUFJLENBQUM7TUFDbkJuQyxXQUFXLENBQUNrQyxDQUFDLENBQUMsQ0FBQ0MsSUFBSSxDQUFDLEtBQUssQ0FBQztJQUM1QjtFQUNGO0VBRUEsTUFBTTVGLFFBQVEsR0FBR0EsQ0FBQSxLQUFNQyxLQUFLO0VBQzVCLE1BQU0rRSxjQUFjLEdBQUdBLENBQUEsS0FBTXZCLFdBQVc7RUFFeEMsTUFBTXFDLHFCQUFxQixHQUFHQSxDQUFDdEcsR0FBRyxFQUFFRyxNQUFNLEtBQ3hDSCxHQUFHLEdBQUcsQ0FBQyxJQUFJRyxNQUFNLEdBQUcsQ0FBQyxJQUFJSCxHQUFHLElBQUkrRixJQUFJLElBQUk1RixNQUFNLElBQUk0RixJQUFJO0VBRXhELE1BQU1RLG9CQUFvQixHQUFHQSxDQUFDdkcsR0FBRyxFQUFFRyxNQUFNLEVBQUVXLElBQUksS0FBSztJQUNsRCxJQUFJQSxJQUFJLENBQUMwRixhQUFhLENBQUMsQ0FBQyxFQUFFLE9BQU94RyxHQUFHLEdBQUdjLElBQUksQ0FBQzJGLFNBQVMsQ0FBQyxDQUFDLElBQUlWLElBQUk7SUFDL0QsT0FBTzVGLE1BQU0sR0FBR1csSUFBSSxDQUFDMkYsU0FBUyxDQUFDLENBQUMsSUFBSVYsSUFBSTtFQUMxQyxDQUFDO0VBRUQsTUFBTVcsZUFBZSxHQUFHQSxDQUFDMUcsR0FBRyxFQUFFRyxNQUFNLEVBQUVXLElBQUksS0FBSztJQUM3QyxJQUFJQSxJQUFJLENBQUMwRixhQUFhLENBQUMsQ0FBQyxFQUFFO01BQ3hCLEtBQUssSUFBSUwsQ0FBQyxHQUFHLENBQUMsRUFBRUEsQ0FBQyxHQUFHckYsSUFBSSxDQUFDMkYsU0FBUyxDQUFDLENBQUMsRUFBRU4sQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUM1QyxJQUFJMUYsS0FBSyxDQUFDVCxHQUFHLEdBQUdtRyxDQUFDLENBQUMsQ0FBQ2hHLE1BQU0sQ0FBQyxLQUFLLElBQUksRUFBRSxPQUFPLElBQUk7TUFDbEQ7SUFDRixDQUFDLE1BQU07TUFDTCxLQUFLLElBQUlnRyxDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLEdBQUdyRixJQUFJLENBQUMyRixTQUFTLENBQUMsQ0FBQyxFQUFFTixDQUFDLElBQUksQ0FBQyxFQUFFO1FBQzVDLElBQUkxRixLQUFLLENBQUNULEdBQUcsQ0FBQyxDQUFDRyxNQUFNLEdBQUdnRyxDQUFDLENBQUMsS0FBSyxJQUFJLEVBQUUsT0FBTyxJQUFJO01BQ2xEO0lBQ0Y7SUFDQSxPQUFPLEtBQUs7RUFDZCxDQUFDO0VBRUQsTUFBTVEsZUFBZSxHQUFHQSxDQUFDM0csR0FBRyxFQUFFRyxNQUFNLEVBQUVXLElBQUksS0FBSztJQUM3QyxJQUFJQSxJQUFJLENBQUMwRixhQUFhLENBQUMsQ0FBQyxFQUFFO01BQ3hCLEtBQUssSUFBSUwsQ0FBQyxHQUFHbkcsR0FBRyxHQUFHLENBQUMsRUFBRW1HLENBQUMsSUFBSW5HLEdBQUcsR0FBR2MsSUFBSSxDQUFDMkYsU0FBUyxDQUFDLENBQUMsRUFBRU4sQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUN6RCxLQUFLLElBQUlFLENBQUMsR0FBR2xHLE1BQU0sR0FBRyxDQUFDLEVBQUVrRyxDQUFDLElBQUlsRyxNQUFNLEdBQUcsQ0FBQyxFQUFFa0csQ0FBQyxJQUFJLENBQUMsRUFBRTtVQUNoRCxJQUFJLENBQUNDLHFCQUFxQixDQUFDSCxDQUFDLEVBQUVFLENBQUMsQ0FBQyxJQUFJNUYsS0FBSyxDQUFDMEYsQ0FBQyxDQUFDLENBQUNFLENBQUMsQ0FBQyxFQUFFLE9BQU8sSUFBSTtRQUM5RDtNQUNGO0lBQ0YsQ0FBQyxNQUFNO01BQ0wsS0FBSyxJQUFJRixDQUFDLEdBQUduRyxHQUFHLEdBQUcsQ0FBQyxFQUFFbUcsQ0FBQyxJQUFJbkcsR0FBRyxHQUFHLENBQUMsRUFBRW1HLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDMUMsS0FBSyxJQUFJRSxDQUFDLEdBQUdsRyxNQUFNLEdBQUcsQ0FBQyxFQUFFa0csQ0FBQyxJQUFJbEcsTUFBTSxHQUFHVyxJQUFJLENBQUMyRixTQUFTLENBQUMsQ0FBQyxFQUFFSixDQUFDLElBQUksQ0FBQyxFQUFFO1VBQy9ELElBQUksQ0FBQ0MscUJBQXFCLENBQUNILENBQUMsRUFBRUUsQ0FBQyxDQUFDLElBQUk1RixLQUFLLENBQUMwRixDQUFDLENBQUMsQ0FBQ0UsQ0FBQyxDQUFDLEVBQUUsT0FBTyxJQUFJO1FBQzlEO01BQ0Y7SUFDRjtJQUNBLE9BQU8sS0FBSztFQUNkLENBQUM7RUFFRCxNQUFNTyxlQUFlLEdBQUdBLENBQUM1RyxHQUFHLEVBQUVHLE1BQU0sRUFBRVcsSUFBSSxLQUFLO0lBQzdDLElBQUl3RixxQkFBcUIsQ0FBQ3RHLEdBQUcsRUFBRUcsTUFBTSxDQUFDLEVBQUUsT0FBTyxLQUFLO0lBQ3BELElBQUlvRyxvQkFBb0IsQ0FBQ3ZHLEdBQUcsRUFBRUcsTUFBTSxFQUFFVyxJQUFJLENBQUMsRUFBRSxPQUFPLEtBQUs7SUFDekQsSUFBSTRGLGVBQWUsQ0FBQzFHLEdBQUcsRUFBRUcsTUFBTSxFQUFFVyxJQUFJLENBQUMsRUFBRSxPQUFPLEtBQUs7SUFDcEQsSUFBSTZGLGVBQWUsQ0FBQzNHLEdBQUcsRUFBRUcsTUFBTSxFQUFFVyxJQUFJLENBQUMsRUFBRSxPQUFPLEtBQUs7SUFDcEQsT0FBTyxJQUFJO0VBQ2IsQ0FBQztFQUVELE1BQU02QixTQUFTLEdBQUdBLENBQUMzQyxHQUFHLEVBQUVHLE1BQU0sRUFBRVcsSUFBSSxLQUFLO0lBQ3ZDLElBQUksQ0FBQzhGLGVBQWUsQ0FBQzVHLEdBQUcsRUFBRUcsTUFBTSxFQUFFVyxJQUFJLENBQUMsRUFBRSxPQUFPLEtBQUs7SUFDckQsSUFBSUEsSUFBSSxDQUFDMEYsYUFBYSxDQUFDLENBQUMsRUFBRTtNQUN4QixLQUFLLElBQUlMLENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsR0FBR3JGLElBQUksQ0FBQzJGLFNBQVMsQ0FBQyxDQUFDLEVBQUVOLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDNUMxRixLQUFLLENBQUNULEdBQUcsR0FBR21HLENBQUMsQ0FBQyxDQUFDaEcsTUFBTSxDQUFDLEdBQUdXLElBQUk7TUFDL0I7SUFDRixDQUFDLE1BQU07TUFDTCxLQUFLLElBQUlxRixDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLEdBQUdyRixJQUFJLENBQUMyRixTQUFTLENBQUMsQ0FBQyxFQUFFTixDQUFDLElBQUksQ0FBQyxFQUFFO1FBQzVDMUYsS0FBSyxDQUFDVCxHQUFHLENBQUMsQ0FBQ0csTUFBTSxHQUFHZ0csQ0FBQyxDQUFDLEdBQUdyRixJQUFJO01BQy9CO0lBQ0Y7SUFDQUEsSUFBSSxDQUFDK0YsWUFBWSxDQUFDN0csR0FBRyxFQUFFRyxNQUFNLENBQUM7SUFDOUIrRixLQUFLLENBQUNFLElBQUksQ0FBQ3RGLElBQUksQ0FBQztJQUNoQixPQUFPLElBQUk7RUFDYixDQUFDO0VBRUQsTUFBTTJCLFVBQVUsR0FBR0EsQ0FBQ3pDLEdBQUcsRUFBRUcsTUFBTSxLQUFLO0lBQ2xDLE1BQU1XLElBQUksR0FBR0wsS0FBSyxDQUFDVCxHQUFHLENBQUMsQ0FBQ0csTUFBTSxDQUFDO0lBQy9CLE1BQU0yRyxRQUFRLEdBQUdoRyxJQUFJLENBQUNpRyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN2QyxNQUFNQyxXQUFXLEdBQUdsRyxJQUFJLENBQUNpRyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUMxQyxJQUFJakcsSUFBSSxDQUFDMEYsYUFBYSxDQUFDLENBQUMsRUFBRTtNQUN4QixLQUFLLElBQUlMLENBQUMsR0FBRyxDQUFDLEVBQUVBLENBQUMsR0FBR3JGLElBQUksQ0FBQzJGLFNBQVMsQ0FBQyxDQUFDLEVBQUVOLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDNUMxRixLQUFLLENBQUNxRyxRQUFRLEdBQUdYLENBQUMsQ0FBQyxDQUFDYSxXQUFXLENBQUMsR0FBRyxJQUFJO01BQ3pDO0lBQ0YsQ0FBQyxNQUFNO01BQ0wsS0FBSyxJQUFJYixDQUFDLEdBQUcsQ0FBQyxFQUFFQSxDQUFDLEdBQUdyRixJQUFJLENBQUMyRixTQUFTLENBQUMsQ0FBQyxFQUFFTixDQUFDLElBQUksQ0FBQyxFQUFFO1FBQzVDMUYsS0FBSyxDQUFDcUcsUUFBUSxDQUFDLENBQUNFLFdBQVcsR0FBR2IsQ0FBQyxDQUFDLEdBQUcsSUFBSTtNQUN6QztJQUNGO0lBQ0FELEtBQUssQ0FBQ2UsTUFBTSxDQUFDZixLQUFLLENBQUNnQixPQUFPLENBQUNwRyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDcEMsT0FBTyxJQUFJO0VBQ2IsQ0FBQztFQUVELE1BQU1nRixnQkFBZ0IsR0FBR0EsQ0FBQSxLQUFNO0lBQzdCLE1BQU1xQixXQUFXLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBRW5DQSxXQUFXLENBQUNsSCxPQUFPLENBQUU4QixNQUFNLElBQUs7TUFDOUIsSUFBSXFGLFlBQVksR0FBRyxLQUFLO01BRXhCLE9BQU8sQ0FBQ0EsWUFBWSxFQUFFO1FBQ3BCLE1BQU1wRixVQUFVLEdBQUdxRixJQUFJLENBQUNDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsR0FBRztRQUN0QyxNQUFNdEgsR0FBRyxHQUFHcUgsSUFBSSxDQUFDRSxLQUFLLENBQUNGLElBQUksQ0FBQ0MsTUFBTSxDQUFDLENBQUMsR0FBR3ZCLElBQUksQ0FBQztRQUM1QyxNQUFNNUYsTUFBTSxHQUFHa0gsSUFBSSxDQUFDRSxLQUFLLENBQUNGLElBQUksQ0FBQ0MsTUFBTSxDQUFDLENBQUMsR0FBR3ZCLElBQUksQ0FBQztRQUMvQyxNQUFNeUIsT0FBTyxHQUFHckksaURBQUksQ0FBQzRDLE1BQU0sRUFBRUMsVUFBVSxDQUFDO1FBRXhDLElBQUk0RSxlQUFlLENBQUM1RyxHQUFHLEVBQUVHLE1BQU0sRUFBRXFILE9BQU8sQ0FBQyxFQUFFO1VBQ3pDN0UsU0FBUyxDQUFDM0MsR0FBRyxFQUFFRyxNQUFNLEVBQUVxSCxPQUFPLENBQUM7VUFDL0JKLFlBQVksR0FBRyxJQUFJO1FBQ3JCO01BQ0Y7SUFDRixDQUFDLENBQUM7RUFDSixDQUFDO0VBRUQsTUFBTUssYUFBYSxHQUFHQSxDQUFDekgsR0FBRyxFQUFFRyxNQUFNLEtBQUs7SUFDckMsSUFBSW1HLHFCQUFxQixDQUFDdEcsR0FBRyxFQUFFRyxNQUFNLENBQUMsRUFBRSxPQUFPLEtBQUs7SUFDcEQsSUFBSU0sS0FBSyxDQUFDVCxHQUFHLENBQUMsQ0FBQ0csTUFBTSxDQUFDLEVBQUU7TUFDdEJNLEtBQUssQ0FBQ1QsR0FBRyxDQUFDLENBQUNHLE1BQU0sQ0FBQyxDQUFDdUgsR0FBRyxDQUFDLENBQUM7TUFDeEIsT0FBTyxJQUFJO0lBQ2I7SUFDQXpELFdBQVcsQ0FBQ2pFLEdBQUcsQ0FBQyxDQUFDRyxNQUFNLENBQUMsR0FBRyxJQUFJO0lBQy9CLE9BQU8sS0FBSztFQUNkLENBQUM7RUFFRCxNQUFNeUYsY0FBYyxHQUFHQSxDQUFBLEtBQU1NLEtBQUssQ0FBQ3lCLEtBQUssQ0FBRTdHLElBQUksSUFBS0EsSUFBSSxDQUFDOEcsTUFBTSxDQUFDLENBQUMsS0FBSyxJQUFJLENBQUM7RUFFMUUsT0FBTztJQUNMcEgsUUFBUTtJQUNSbUMsU0FBUztJQUNURixVQUFVO0lBQ1ZxRCxnQkFBZ0I7SUFDaEIyQixhQUFhO0lBQ2JqQyxjQUFjO0lBQ2RJO0VBQ0YsQ0FBQztBQUNILENBQUM7QUFFRCxpRUFBZWpCLFNBQVM7Ozs7Ozs7Ozs7Ozs7O0FDNUl4QixNQUFNQyxNQUFNLEdBQUlpRCxJQUFJLElBQUs7RUFDdkIsTUFBTUMsU0FBUyxHQUFHLElBQUlDLEdBQUcsQ0FBQyxDQUFDO0VBRTNCLE1BQU1DLFlBQVksR0FBR0EsQ0FBQ2hJLEdBQUcsRUFBRUcsTUFBTSxLQUFLMkgsU0FBUyxDQUFDRyxHQUFHLENBQUUsR0FBRWpJLEdBQUksSUFBR0csTUFBTyxFQUFDLENBQUM7RUFFdkUsTUFBTStILGlCQUFpQixHQUFHQSxDQUFDbEksR0FBRyxFQUFFRyxNQUFNLEVBQUU0RixJQUFJLEtBQzFDL0YsR0FBRyxHQUFHLENBQUMsSUFBSUcsTUFBTSxHQUFHLENBQUMsSUFBSUgsR0FBRyxJQUFJK0YsSUFBSSxJQUFJNUYsTUFBTSxJQUFJNEYsSUFBSTtFQUV4RCxNQUFNb0MsaUJBQWlCLEdBQUk3SCxTQUFTLElBQ2xDK0csSUFBSSxDQUFDRSxLQUFLLENBQUNGLElBQUksQ0FBQ0MsTUFBTSxDQUFDLENBQUMsR0FBR2hILFNBQVMsQ0FBQ0UsUUFBUSxDQUFDLENBQUMsQ0FBQ3VCLE1BQU0sQ0FBQztFQUV6RCxNQUFNb0MsT0FBTyxHQUFHQSxDQUFBLEtBQU0wRCxJQUFJO0VBRTFCLE1BQU10QyxNQUFNLEdBQUdBLENBQUN2RixHQUFHLEVBQUVHLE1BQU0sRUFBRUcsU0FBUyxLQUFLO0lBQ3pDLElBQUkwSCxZQUFZLENBQUNoSSxHQUFHLEVBQUVHLE1BQU0sQ0FBQyxFQUFFLE9BQU8sS0FBSztJQUMzQyxJQUFJLENBQUMrSCxpQkFBaUIsQ0FBQ2xJLEdBQUcsRUFBRUcsTUFBTSxFQUFFRyxTQUFTLENBQUNFLFFBQVEsQ0FBQyxDQUFDLENBQUN1QixNQUFNLENBQUMsRUFBRTtNQUNoRXpCLFNBQVMsQ0FBQ21ILGFBQWEsQ0FBQ3pILEdBQUcsRUFBRUcsTUFBTSxDQUFDO01BQ3BDMkgsU0FBUyxDQUFDbEksR0FBRyxDQUFFLEdBQUVJLEdBQUksSUFBR0csTUFBTyxFQUFDLENBQUM7TUFDakMsT0FBTyxJQUFJO0lBQ2I7SUFDQSxPQUFPLEtBQUs7RUFDZCxDQUFDO0VBRUQsTUFBTXVGLFlBQVksR0FBSXBGLFNBQVMsSUFBSztJQUNsQyxJQUFJd0gsU0FBUyxDQUFDL0IsSUFBSSxLQUFLLEdBQUcsRUFBRSxPQUFPLEtBQUs7SUFDeEMsSUFBSXFDLFNBQVMsR0FBR0QsaUJBQWlCLENBQUM3SCxTQUFTLENBQUM7SUFDNUMsSUFBSStILFNBQVMsR0FBR0YsaUJBQWlCLENBQUM3SCxTQUFTLENBQUM7SUFFNUMsT0FBTzBILFlBQVksQ0FBQ0ksU0FBUyxFQUFFQyxTQUFTLENBQUMsRUFBRTtNQUN6Q0QsU0FBUyxHQUFHRCxpQkFBaUIsQ0FBQzdILFNBQVMsQ0FBQztNQUN4QytILFNBQVMsR0FBR0YsaUJBQWlCLENBQUM3SCxTQUFTLENBQUM7SUFDMUM7SUFDQUEsU0FBUyxDQUFDbUgsYUFBYSxDQUFDVyxTQUFTLEVBQUVDLFNBQVMsQ0FBQztJQUM3Q1AsU0FBUyxDQUFDbEksR0FBRyxDQUFFLEdBQUV3SSxTQUFVLElBQUdDLFNBQVUsRUFBQyxDQUFDO0lBQzFDLE9BQU8sQ0FBQ0QsU0FBUyxFQUFFQyxTQUFTLENBQUM7RUFDL0IsQ0FBQztFQUVELE9BQU87SUFDTGxFLE9BQU87SUFDUG9CLE1BQU07SUFDTkc7RUFDRixDQUFDO0FBQ0gsQ0FBQztBQUVELGlFQUFlZCxNQUFNOzs7Ozs7Ozs7Ozs7OztBQzVDckIsTUFBTXpGLElBQUksR0FBRyxTQUFBQSxDQUFDNEMsTUFBTSxFQUF5QjtFQUFBLElBQXZCQyxVQUFVLEdBQUFnRSxTQUFBLENBQUFqRSxNQUFBLFFBQUFpRSxTQUFBLFFBQUFDLFNBQUEsR0FBQUQsU0FBQSxNQUFHLEtBQUs7RUFDdEMsSUFBSXNDLElBQUksR0FBRyxDQUFDO0VBQ1osSUFBSXhCLFFBQVE7RUFDWixJQUFJRSxXQUFXO0VBRWYsTUFBTVAsU0FBUyxHQUFHQSxDQUFBLEtBQU0xRSxNQUFNO0VBQzlCLE1BQU15RSxhQUFhLEdBQUdBLENBQUEsS0FBTXhFLFVBQVU7RUFDdEMsTUFBTXVHLE9BQU8sR0FBR0EsQ0FBQSxLQUFNRCxJQUFJO0VBQzFCLE1BQU1WLE1BQU0sR0FBR0EsQ0FBQSxLQUFNVSxJQUFJLEtBQUt2RyxNQUFNO0VBQ3BDLE1BQU0yRixHQUFHLEdBQUdBLENBQUEsS0FBTTtJQUNoQixJQUFJWSxJQUFJLEdBQUd2RyxNQUFNLEVBQUV1RyxJQUFJLElBQUksQ0FBQztFQUM5QixDQUFDO0VBQ0QsTUFBTXZCLFlBQVksR0FBR0EsQ0FBQSxLQUFNLENBQUNELFFBQVEsRUFBRUUsV0FBVyxDQUFDO0VBQ2xELE1BQU1ILFlBQVksR0FBR0EsQ0FBQzdHLEdBQUcsRUFBRUcsTUFBTSxLQUFLO0lBQ3BDMkcsUUFBUSxHQUFHOUcsR0FBRztJQUNkZ0gsV0FBVyxHQUFHN0csTUFBTTtFQUN0QixDQUFDO0VBQ0QsTUFBTXFJLE1BQU0sR0FBR0EsQ0FBQSxNQUFPO0lBQ3BCekcsTUFBTSxFQUFFMEUsU0FBUyxDQUFDLENBQUM7SUFDbkJ6RSxVQUFVLEVBQUV3RSxhQUFhLENBQUMsQ0FBQztJQUMzQjhCLElBQUksRUFBRUMsT0FBTyxDQUFDLENBQUM7SUFDZkUsU0FBUyxFQUFFMUIsWUFBWSxDQUFDO0VBQzFCLENBQUMsQ0FBQztFQUVGLE9BQU87SUFDTE4sU0FBUztJQUNURCxhQUFhO0lBQ2IrQixPQUFPO0lBQ1BYLE1BQU07SUFDTkYsR0FBRztJQUNIWCxZQUFZO0lBQ1pGLFlBQVk7SUFDWjJCO0VBQ0YsQ0FBQztBQUNILENBQUM7QUFFRCxpRUFBZXJKLElBQUk7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3BDbkI7QUFDNkc7QUFDakI7QUFDNUYsOEJBQThCLG1GQUEyQixDQUFDLDRGQUFxQztBQUMvRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsT0FBTywwRkFBMEYsVUFBVSxVQUFVLFlBQVksT0FBTyxNQUFNLFVBQVUsVUFBVSxNQUFNLEtBQUssVUFBVSxZQUFZLE9BQU8sS0FBSyxZQUFZLE9BQU8sS0FBSyxVQUFVLFlBQVksT0FBTyxLQUFLLFVBQVUsVUFBVSxZQUFZLGFBQWEsT0FBTyxLQUFLLFlBQVksV0FBVyxNQUFNLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxXQUFXLFVBQVUsVUFBVSxZQUFZLFdBQVcsWUFBWSxhQUFhLFdBQVcsTUFBTSxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssVUFBVSxZQUFZLE9BQU8sTUFBTSxVQUFVLFlBQVksYUFBYSxXQUFXLFVBQVUsVUFBVSxvREFBb0QsY0FBYyxlQUFlLDJCQUEyQixHQUFHLGlCQUFpQixpQkFBaUIsZ0JBQWdCLEdBQUcsYUFBYSxrQkFBa0Isa0NBQWtDLEdBQUcsWUFBWSx1QkFBdUIsR0FBRyxVQUFVLGtCQUFrQix3QkFBd0IsR0FBRyxXQUFXLGdCQUFnQixvQkFBb0IsMkJBQTJCLHVCQUF1QixHQUFHLFdBQVcsNEJBQTRCLGlCQUFpQixHQUFHLGFBQWEsMkJBQTJCLEdBQUcsVUFBVSwwQkFBMEIsR0FBRyxrQkFBa0IsdUJBQXVCLGtCQUFrQixpQkFBaUIsaUJBQWlCLHdCQUF3QixrQkFBa0IsMkJBQTJCLHVCQUF1QixjQUFjLEdBQUcsb0JBQW9CLHNCQUFzQixzQkFBc0IsR0FBRyxzQkFBc0Isa0JBQWtCLDRCQUE0QixHQUFHLDZCQUE2QixvQkFBb0IsMkJBQTJCLHdCQUF3QixpQkFBaUIsa0JBQWtCLG9CQUFvQixHQUFHLG1CQUFtQjtBQUMzc0Q7QUFDQSxpRUFBZSx1QkFBdUIsRUFBQzs7Ozs7Ozs7Ozs7QUNyRjFCOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxREFBcUQ7QUFDckQ7QUFDQTtBQUNBLGdEQUFnRDtBQUNoRDtBQUNBO0FBQ0EscUZBQXFGO0FBQ3JGO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQixpQkFBaUI7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLHFCQUFxQjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVixzRkFBc0YscUJBQXFCO0FBQzNHO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVixpREFBaUQscUJBQXFCO0FBQ3RFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVixzREFBc0QscUJBQXFCO0FBQzNFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUNwRmE7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVEQUF1RCxjQUFjO0FBQ3JFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNkQSxNQUFrRztBQUNsRyxNQUF3RjtBQUN4RixNQUErRjtBQUMvRixNQUFrSDtBQUNsSCxNQUEyRztBQUMzRyxNQUEyRztBQUMzRyxNQUF1RztBQUN2RztBQUNBOztBQUVBOztBQUVBLDRCQUE0QixxR0FBbUI7QUFDL0Msd0JBQXdCLGtIQUFhOztBQUVyQyx1QkFBdUIsdUdBQWE7QUFDcEM7QUFDQSxpQkFBaUIsK0ZBQU07QUFDdkIsNkJBQTZCLHNHQUFrQjs7QUFFL0MsYUFBYSwwR0FBRyxDQUFDLHVGQUFPOzs7O0FBSWlEO0FBQ3pFLE9BQU8saUVBQWUsdUZBQU8sSUFBSSx1RkFBTyxVQUFVLHVGQUFPLG1CQUFtQixFQUFDOzs7Ozs7Ozs7OztBQzFCaEU7O0FBRWI7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLHdCQUF3QjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixpQkFBaUI7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQiw0QkFBNEI7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQiw2QkFBNkI7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUNuRmE7O0FBRWI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDakNhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUNUYTs7QUFFYjtBQUNBO0FBQ0EsY0FBYyxLQUF3QyxHQUFHLHNCQUFpQixHQUFHLENBQUk7QUFDakY7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ1RhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0RBQWtEO0FBQ2xEO0FBQ0E7QUFDQSwwQ0FBMEM7QUFDMUM7QUFDQTtBQUNBO0FBQ0EsaUZBQWlGO0FBQ2pGO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EseURBQXlEO0FBQ3pEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0M7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDNURhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7VUNiQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7V0NOQTs7Ozs7Ozs7Ozs7OztBQ0E2QjtBQUNLO0FBRWxDMEYseURBQUksQ0FBQyxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy8uL3NyYy9tb2R1bGVzL0RPTWNvbnRyb2xsZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcHMvLi9zcmMvbW9kdWxlcy9nYW1lLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXBzLy4vc3JjL21vZHVsZXMvZ2FtZUJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXBzLy4vc3JjL21vZHVsZXMvcGxheWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXBzLy4vc3JjL21vZHVsZXMvc2hpcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy8uL3NyYy9zdHlsZXMvc3R5bGVzLmNzcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcHMvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy8uL3NyYy9zdHlsZXMvc3R5bGVzLmNzcz9lNDViIiwid2VicGFjazovL2JhdHRsZXNoaXBzLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXBzLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXBzLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcHMvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcHMvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcHMvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXBzL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcHMvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy93ZWJwYWNrL3J1bnRpbWUvbm9uY2UiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcHMvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gSW1wb3J0IHRoZSBTaGlwIGNsYXNzIGZyb20gdGhlIHNoaXAgbW9kdWxlXG5pbXBvcnQgU2hpcCBmcm9tIFwiLi9zaGlwXCI7XG5cbmNvbnN0IERPTWNvbnRyb2xsZXIgPSAoKSA9PiB7XG4gIC8vIEZ1bmN0aW9uIHRvIGNyZWF0ZSBhIHNpbmdsZSBjZWxsIGVsZW1lbnRcbiAgY29uc3QgY3JlYXRlQ2VsbCA9IChyb3dJbmRleCwgY29sdW1uSW5kZXgpID0+IHtcbiAgICBjb25zdCBjZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBjZWxsLmNsYXNzTGlzdC5hZGQoXCJjZWxsXCIpO1xuICAgIGNlbGwuc2V0QXR0cmlidXRlKFwicm93XCIsIHJvd0luZGV4KTtcbiAgICBjZWxsLnNldEF0dHJpYnV0ZShcImNvbHVtblwiLCBjb2x1bW5JbmRleCk7XG4gICAgcmV0dXJuIGNlbGw7XG4gIH07XG5cbiAgLy8gRnVuY3Rpb24gdG8gY3JlYXRlIGEgc2luZ2xlIHJvdyBlbGVtZW50XG4gIGNvbnN0IGNyZWF0ZVJvdyA9IChyb3dBcnJheSwgcm93SW5kZXgpID0+IHtcbiAgICBjb25zdCByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIHJvdy5jbGFzc0xpc3QuYWRkKFwicm93XCIpO1xuICAgIHJvd0FycmF5LmZvckVhY2goKF8sIGNvbHVtbikgPT4ge1xuICAgICAgY29uc3QgY2VsbCA9IGNyZWF0ZUNlbGwocm93SW5kZXgsIGNvbHVtbik7XG4gICAgICByb3cuYXBwZW5kQ2hpbGQoY2VsbCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJvdztcbiAgfTtcblxuICAvLyBGdW5jdGlvbiB0byByZW5kZXIgdGhlIGdhbWUgYm9hcmQgb24gdGhlIEhUTUwgcGFnZVxuICBjb25zdCByZW5kZXJHYW1lQm9hcmQgPSAoZ2FtZUJvYXJkKSA9PiB7XG4gICAgY29uc3QgYm9hcmRBcnJheSA9IGdhbWVCb2FyZC5nZXRCb2FyZCgpO1xuICAgIGNvbnN0IGJvYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBib2FyZC5jbGFzc0xpc3QuYWRkKFwiYm9hcmRcIik7XG5cbiAgICBib2FyZEFycmF5LmZvckVhY2goKHJvd0FycmF5LCByb3dJbmRleCkgPT4ge1xuICAgICAgY29uc3Qgcm93ID0gY3JlYXRlUm93KHJvd0FycmF5LCByb3dJbmRleCk7XG4gICAgICBib2FyZC5hcHBlbmRDaGlsZChyb3cpO1xuICAgIH0pO1xuICAgIHJldHVybiBib2FyZDtcbiAgfTtcblxuICAvLyBGdW5jdGlvbiB0byByZW5kZXIgdGhlIHNoaXBzIG9uIHRoZSBnYW1lIGJvYXJkXG4gIGNvbnN0IHJlbmRlclNoaXBzID0gKGdhbWVCb2FyZCkgPT4ge1xuICAgIGNvbnN0IGJvYXJkQXJyYXkgPSBnYW1lQm9hcmQuZ2V0Qm9hcmQoKTtcbiAgICBjb25zdCBib2FyZENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY29tcHV0ZXJCb2FyZENvbnRhaW5lclwiKTtcblxuICAgIC8vIFJlbW92ZSBleGlzdGluZyBcInNoaXBcIiBjbGFzcyBmcm9tIGNlbGxzXG4gICAgYm9hcmRDb250YWluZXIucXVlcnlTZWxlY3RvckFsbChcIi5zaGlwXCIpLmZvckVhY2goKHNoaXApID0+IHtcbiAgICAgIHNoaXAuY2xhc3NMaXN0LnJlbW92ZShcInNoaXBcIik7XG4gICAgfSk7XG5cbiAgICBib2FyZEFycmF5LmZvckVhY2goKHJvd0FycmF5LCByb3dJbmRleCkgPT4ge1xuICAgICAgcm93QXJyYXkuZm9yRWFjaCgoY2VsbFZhbHVlLCBjb2x1bW5JbmRleCkgPT4ge1xuICAgICAgICBjb25zdCBjZWxsID0gYm9hcmRDb250YWluZXIucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICBgLnJvdzpudGgtY2hpbGQoJHtyb3dJbmRleCArIDF9KSAuY2VsbDpudGgtY2hpbGQoJHtjb2x1bW5JbmRleCArIDF9KWAsXG4gICAgICAgICk7XG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgdGhlcmUgaXMgYSBzaGlwIGF0IHRoaXMgY2VsbFxuICAgICAgICBpZiAoY2VsbFZhbHVlKSB7XG4gICAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwic2hpcFwiKTsgLy8gQWRkIGEgY2xhc3MgdG8gaW5kaWNhdGUgYSBzaGlwIGF0IHRoaXMgY2VsbFxuICAgICAgICAgIGNlbGwuc2V0QXR0cmlidXRlKFwiZHJhZ2dhYmxlXCIsIHRydWUpO1xuXG4gICAgICAgICAgLy8gQWRkIGRyYWdzdGFydCBldmVudCBsaXN0ZW5lciBmb3IgZHJhZ2dpbmcgc2hpcCBjZWxsc1xuICAgICAgICAgIGNlbGwuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdzdGFydFwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiU2V0dGluZyBkcmFnIGRhdGE6XCIsIHJvd0luZGV4LCBjb2x1bW5JbmRleCwgY2VsbFZhbHVlKTtcbiAgICAgICAgICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhKFxuICAgICAgICAgICAgICBcInRleHQvcGxhaW5cIixcbiAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgIHJvd0luZGV4LFxuICAgICAgICAgICAgICAgIGNvbHVtbkluZGV4LFxuICAgICAgICAgICAgICAgIGNlbGxWYWx1ZSxcbiAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8vIEFkZCBkcm9wIGV2ZW50IGxpc3RlbmVyIHRvIGhhbmRsZSBkcm9wcGluZyBzaGlwIGNlbGxzXG4gICAgYm9hcmRDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcihcImRyb3BcIiwgKGV2ZW50KSA9PiB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICBjb25zdCBkYXRhID0gSlNPTi5wYXJzZShldmVudC5kYXRhVHJhbnNmZXIuZ2V0RGF0YShcInRleHQvcGxhaW5cIikpO1xuICAgICAgY29uc29sZS5sb2coXCJQYXJzZWQgZHJhZyBkYXRhOlwiLCBkYXRhKTtcblxuICAgICAgY29uc3Qgb2xkUm93SW5kZXggPSBkYXRhLnJvd0luZGV4O1xuICAgICAgY29uc3Qgb2xkQ29sdW1uSW5kZXggPSBkYXRhLmNvbHVtbkluZGV4O1xuICAgICAgY29uc3Qgc2hpcCA9IFNoaXAoZGF0YS5jZWxsVmFsdWUubGVuZ3RoLCBkYXRhLmNlbGxWYWx1ZS5pc1ZlcnRpY2FsKTtcbiAgICAgIGNvbnN0IG5ld0NlbGwgPSBldmVudC50YXJnZXQuY2xvc2VzdChcIi5jZWxsXCIpO1xuXG4gICAgICAvLyBDaGVjayBpZiB0aGUgZHJvcCB0YXJnZXQgaXMgYSB2YWxpZCBjZWxsXG4gICAgICBpZiAobmV3Q2VsbCAmJiAhbmV3Q2VsbC5jbGFzc0xpc3QuY29udGFpbnMoXCJzaGlwXCIpKSB7XG4gICAgICAgIGNvbnN0IG5ld1Jvd0luZGV4ID0gcGFyc2VJbnQobmV3Q2VsbC5nZXRBdHRyaWJ1dGUoXCJyb3dcIiksIDEwKTtcbiAgICAgICAgY29uc3QgbmV3Q29sdW1uSW5kZXggPSBwYXJzZUludChuZXdDZWxsLmdldEF0dHJpYnV0ZShcImNvbHVtblwiKSwgMTApO1xuXG4gICAgICAgIC8vIFJlbW92ZSBzaGlwIGZyb20gb2xkIGNvb3JkaW5hdGVzXG4gICAgICAgIGdhbWVCb2FyZC5yZW1vdmVTaGlwKG9sZFJvd0luZGV4LCBvbGRDb2x1bW5JbmRleCk7XG4gICAgICAgIGNvbnN0IG9sZENlbGwgPSBib2FyZENvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAgIGAucm93Om50aC1jaGlsZCgke29sZFJvd0luZGV4ICsgMX0pIC5jZWxsOm50aC1jaGlsZCgke1xuICAgICAgICAgICAgb2xkQ29sdW1uSW5kZXggKyAxXG4gICAgICAgICAgfSlgLFxuICAgICAgICApO1xuICAgICAgICBvbGRDZWxsLmNsYXNzTGlzdC5yZW1vdmUoXCJzaGlwXCIpO1xuXG4gICAgICAgIC8vIFBsYWNlIHNoaXAgaW4gbmV3IGNvb3JkaW5hdGVzXG4gICAgICAgIGdhbWVCb2FyZC5wbGFjZVNoaXAobmV3Um93SW5kZXgsIG5ld0NvbHVtbkluZGV4LCBzaGlwKTtcblxuICAgICAgICAvLyBVcGRhdGUgdGhlIHZpc3VhbCByZXByZXNlbnRhdGlvbiBvZiB0aGUgc2hpcFxuICAgICAgICByZW5kZXJTaGlwcyhnYW1lQm9hcmQpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gQWRkIGRyYWdvdmVyIGV2ZW50IGxpc3RlbmVyIHRvIGFsbG93IGRyb3BwaW5nXG4gICAgYm9hcmRDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdvdmVyXCIsIChldmVudCkgPT4ge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBGdW5jdGlvbiB0byBpbml0aWFsaXplIHRoZSBcIlJlc3RhcnRcIiBidXR0b25cbiAgY29uc3QgaW5pdGlhbGl6ZVJlc3RhcnRCdG4gPSAoKSA9PiB7XG4gICAgY29uc3QgcmVzdGFydEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucmVzdGFydEJ0blwiKTtcbiAgICByZXN0YXJ0QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gICAgfSk7XG4gIH07XG5cbiAgbGV0IGdhbWVTdGFydGVkID0gZmFsc2U7XG5cbiAgLy8gRnVuY3Rpb24gdG8gc3RhcnQgdGhlIGdhbWVcbiAgY29uc3Qgc3RhcnRHYW1lID0gKCkgPT4ge1xuICAgIGdhbWVTdGFydGVkID0gdHJ1ZTtcbiAgICBjb25zdCBzdGFydEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuc3RhcnRCdG5cIik7XG4gICAgc3RhcnRCdG4udGV4dENvbnRlbnQgPSBcIlJlc3RhcnRcIjtcbiAgICBzdGFydEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICAgIH0pO1xuXG4gICAgLy8gRGlzYWJsZSBkcmFnZ2luZyBmb3Igc2hpcCBjZWxscyBhZnRlciB0aGUgZ2FtZSBoYXMgc3RhcnRlZFxuICAgIGNvbnN0IHNoaXBjZWxscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuc2hpcFwiKTtcbiAgICBzaGlwY2VsbHMuZm9yRWFjaCgoc2hpcGNlbGwpID0+IHNoaXBjZWxsLnNldEF0dHJpYnV0ZShcImRyYWdnYWJsZVwiLCBmYWxzZSkpO1xuICB9O1xuXG4gIC8vIEZ1bmN0aW9uIHRvIGhhbmRsZSBjZWxsIGNsaWNrIGR1cmluZyB0aGUgdXNlcidzIHR1cm5cbiAgY29uc3QgaGFuZGxlQ2VsbENsaWNrID0gKGV2ZW50LCByZXNvbHZlKSA9PiB7XG4gICAgaWYgKCFnYW1lU3RhcnRlZCkge1xuICAgICAgLy8gRG8gbm90aGluZyBpZiB0aGUgZ2FtZSBoYXNuJ3Qgc3RhcnRlZFxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBjZWxsID0gZXZlbnQudGFyZ2V0LmNsb3Nlc3QoXCIuY2VsbFwiKTtcbiAgICBpZiAoY2VsbCkge1xuICAgICAgY29uc3Qgcm93ID0gcGFyc2VJbnQoY2VsbC5nZXRBdHRyaWJ1dGUoXCJyb3dcIiksIDEwKTtcbiAgICAgIGNvbnN0IGNvbHVtbiA9IHBhcnNlSW50KGNlbGwuZ2V0QXR0cmlidXRlKFwiY29sdW1uXCIpLCAxMCk7XG4gICAgICByZXNvbHZlKFtyb3csIGNvbHVtbl0pO1xuICAgIH1cbiAgfTtcblxuICAvLyBGdW5jdGlvbiB0byBnZXQgdGhlIHVzZXIncyBtb3ZlIGFzIGEgUHJvbWlzZVxuICBjb25zdCBnZXRVc2VyTW92ZSA9ICgpID0+XG4gICAgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgIGNvbnN0IHVzZXJCb2FyZENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudXNlckJvYXJkQ29udGFpbmVyXCIpO1xuXG4gICAgICAvLyBBZGQgY2xpY2sgZXZlbnQgbGlzdGVuZXIgdG8gaGFuZGxlIHVzZXIncyBtb3ZlXG4gICAgICBjb25zdCBoYW5kbGVDbGljayA9IChldmVudCkgPT4ge1xuICAgICAgICBoYW5kbGVDZWxsQ2xpY2soZXZlbnQsIHJlc29sdmUpO1xuICAgICAgfTtcblxuICAgICAgdXNlckJvYXJkQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBoYW5kbGVDbGljayk7XG4gICAgfSk7XG5cbiAgLy8gRnVuY3Rpb24gdG8gaW5pdGlhbGl6ZSB0aGUgXCJTdGFydFwiIGJ1dHRvblxuICBjb25zdCBpbml0aWFsaXplU3RhcnRCdG4gPSAoKSA9PiB7XG4gICAgY29uc3Qgc3RhcnRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnN0YXJ0QnRuXCIpO1xuICAgIHN0YXJ0QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBzdGFydEdhbWUsIHsgb25jZTogdHJ1ZSB9KTtcbiAgfTtcblxuICAvLyBGdW5jdGlvbiB0byBoYW5kbGUgY2VsbCBzdGF0ZSBjaGFuZ2UgKGhpdCBvciBtaXNzZWQpXG4gIGNvbnN0IGhhbmRsZUNlbGxVcGRhdGUgPSAoY29vcmRzLCBtaXNzZWRTaG90cywgcGxheWVyKSA9PiB7XG4gICAgY29uc3QgW3JvdywgY29sdW1uXSA9IGNvb3JkcztcbiAgICBsZXQgY2VsbDtcblxuICAgIC8vIERldGVybWluZSB0aGUgdGFyZ2V0IGNlbGwgYmFzZWQgb24gdGhlIHBsYXllciAodXNlciBvciBjb21wdXRlcilcbiAgICBpZiAocGxheWVyLmdldE5hbWUoKSA9PT0gXCJ1c2VyXCIpIHtcbiAgICAgIGNlbGwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBgLnVzZXJCb2FyZENvbnRhaW5lciAucm93Om50aC1jaGlsZCgke3JvdyArIDF9KSAuY2VsbDpudGgtY2hpbGQoJHtcbiAgICAgICAgICBjb2x1bW4gKyAxXG4gICAgICAgIH0pYCxcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNlbGwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBgLmNvbXB1dGVyQm9hcmRDb250YWluZXIgLnJvdzpudGgtY2hpbGQoJHtyb3cgKyAxfSkgLmNlbGw6bnRoLWNoaWxkKCR7XG4gICAgICAgICAgY29sdW1uICsgMVxuICAgICAgICB9KWAsXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IGlzSGl0ID0gIW1pc3NlZFNob3RzW3Jvd11bY29sdW1uXTtcblxuICAgIGNlbGwuY2xhc3NMaXN0LmFkZChpc0hpdCA/IFwiaGl0XCIgOiBcIm1pc3NlZFwiKTtcbiAgfTtcblxuICAvLyBGdW5jdGlvbiB0byBkaXNwbGF5IHRoZSB3aW5uZXIgaW4gYSBtb2RhbFxuICBjb25zdCBzaG93V2lubmVyID0gKHdpbm5lcikgPT4ge1xuICAgIGNvbnN0IHdpbm5lck1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi53aW5uZXJNb2RhbFwiKTtcbiAgICBjb25zdCB3aW5uZXJNZXNzYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBjb25zdCByZXN0YXJ0QnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcblxuICAgIHdpbm5lck1lc3NhZ2UuY2xhc3NMaXN0LmFkZChcIndpbm5lck1lc3NhZ2VcIik7XG4gICAgcmVzdGFydEJ0bi5jbGFzc0xpc3QuYWRkKFwicmVzdGFydEJ0blwiKTtcblxuICAgIHJlc3RhcnRCdG4udGV4dENvbnRlbnQgPSBcIlJlc3RhcnRcIjtcbiAgICB3aW5uZXJNZXNzYWdlLnRleHRDb250ZW50ID0gYCR7d2lubmVyfSB3b25gO1xuXG4gICAgd2lubmVyTW9kYWwuYXBwZW5kKHdpbm5lck1lc3NhZ2UsIHJlc3RhcnRCdG4pO1xuICAgIHdpbm5lck1vZGFsLnNob3dNb2RhbCgpO1xuXG4gICAgaW5pdGlhbGl6ZVJlc3RhcnRCdG4oKTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIHJlbmRlckdhbWVCb2FyZCxcbiAgICByZW5kZXJTaGlwcyxcbiAgICBpbml0aWFsaXplU3RhcnRCdG4sXG4gICAgaW5pdGlhbGl6ZVJlc3RhcnRCdG4sXG4gICAgZ2V0VXNlck1vdmUsXG4gICAgaGFuZGxlQ2VsbFVwZGF0ZSxcbiAgICBzaG93V2lubmVyLFxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgRE9NY29udHJvbGxlcjtcbiIsImltcG9ydCBET01jb250cm9sbGVyIGZyb20gXCIuL0RPTWNvbnRyb2xsZXJcIjtcbmltcG9ydCBHYW1lQm9hcmQgZnJvbSBcIi4vZ2FtZUJvYXJkXCI7XG5pbXBvcnQgUGxheWVyIGZyb20gXCIuL3BsYXllclwiO1xuLy8gaW1wb3J0IFNoaXAgZnJvbSBcIi4vc2hpcFwiO1xuXG5jb25zdCBnYW1lID0gKCkgPT4ge1xuICBjb25zdCB1c2VyID0gUGxheWVyKFwidXNlclwiKTtcbiAgY29uc3QgY29tcHV0ZXIgPSBQbGF5ZXIoXCJjb21wdXRlclwiKTtcbiAgY29uc3QgdXNlckJvYXJkID0gR2FtZUJvYXJkKCk7XG4gIGNvbnN0IGNvbXB1dGVyQm9hcmQgPSBHYW1lQm9hcmQoKTtcbiAgY29uc3QgZG9tQ29udHJvbGxlciA9IERPTWNvbnRyb2xsZXIoKTtcbiAgLy8gY29uc3QgbmV3U2hpcCA9IFNoaXAoMyk7XG4gIC8vIHVzZXJCb2FyZC5wbGFjZVNoaXAoMiwgMiwgbmV3U2hpcCk7XG4gIC8vIGNvbnN0IG5ld1NoaXAyID0gU2hpcCgzLCB0cnVlKTtcbiAgLy8gY29tcHV0ZXJCb2FyZC5wbGFjZVNoaXAoNCwgMiwgbmV3U2hpcDIpO1xuXG4gIGNvbnN0IGNvbXB1dGVyQm9hcmRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgIFwiLmNvbXB1dGVyQm9hcmRDb250YWluZXJcIixcbiAgKTtcbiAgY29uc3QgdXNlckJvYXJkQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi51c2VyQm9hcmRDb250YWluZXJcIik7XG4gIGNvbXB1dGVyQm9hcmRDb250YWluZXIuYXBwZW5kQ2hpbGQoXG4gICAgZG9tQ29udHJvbGxlci5yZW5kZXJHYW1lQm9hcmQoY29tcHV0ZXJCb2FyZCksXG4gICk7XG4gIHVzZXJCb2FyZENvbnRhaW5lci5hcHBlbmRDaGlsZChkb21Db250cm9sbGVyLnJlbmRlckdhbWVCb2FyZCh1c2VyQm9hcmQpKTtcblxuICBjb25zdCBwbGF5VHVybiA9IGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB1c2VyQ2VsbENvb3JkcyA9IGF3YWl0IGRvbUNvbnRyb2xsZXIuZ2V0VXNlck1vdmUoKTtcbiAgICBjb25zdCB1c2VyQXR0YWNrU3VjY2VzcyA9IHVzZXIuYXR0YWNrKFxuICAgICAgdXNlckNlbGxDb29yZHNbMF0sXG4gICAgICB1c2VyQ2VsbENvb3Jkc1sxXSxcbiAgICAgIHVzZXJCb2FyZCxcbiAgICApO1xuXG4gICAgaWYgKHVzZXJBdHRhY2tTdWNjZXNzKSB7XG4gICAgICBkb21Db250cm9sbGVyLmhhbmRsZUNlbGxVcGRhdGUoXG4gICAgICAgIHVzZXJDZWxsQ29vcmRzLFxuICAgICAgICB1c2VyQm9hcmQuZ2V0TWlzc2VkU2hvdHMoKSxcbiAgICAgICAgdXNlcixcbiAgICAgICk7XG5cbiAgICAgIGNvbnN0IGNvbXB1dGVyQ2VsbENvb3JkcyA9IGNvbXB1dGVyLnJhbmRvbUF0dGFjayhjb21wdXRlckJvYXJkKTtcblxuICAgICAgZG9tQ29udHJvbGxlci5oYW5kbGVDZWxsVXBkYXRlKFxuICAgICAgICBjb21wdXRlckNlbGxDb29yZHMsXG4gICAgICAgIGNvbXB1dGVyQm9hcmQuZ2V0TWlzc2VkU2hvdHMoKSxcbiAgICAgICAgY29tcHV0ZXIsXG4gICAgICApO1xuICAgIH1cbiAgfTtcbiAgLy8gRnVuY3Rpb24gdG8gY2hlY2sgZm9yIHdpbm5lclxuICBjb25zdCBjaGVja0Zvcldpbm5lciA9ICgpID0+IHtcbiAgICBpZiAodXNlckJvYXJkLmlzQWxsU2hpcHNTdW5rKCkpIHtcbiAgICAgIGRvbUNvbnRyb2xsZXIuc2hvd1dpbm5lcih1c2VyLmdldE5hbWUoKSk7XG4gICAgfSBlbHNlIGlmIChjb21wdXRlckJvYXJkLmlzQWxsU2hpcHNTdW5rKCkpIHtcbiAgICAgIGRvbUNvbnRyb2xsZXIuc2hvd1dpbm5lcihjb21wdXRlci5nZXROYW1lKCkpO1xuICAgIH1cbiAgfTtcbiAgLy8gR2FtZSBsb29wXG4gIGNvbnN0IGdhbWVMb29wID0gYXN5bmMgKCkgPT4ge1xuICAgIC8vIEV4aXQgY29uZGl0aW9uXG4gICAgd2hpbGUgKCF1c2VyQm9hcmQuaXNBbGxTaGlwc1N1bmsoKSAmJiAhY29tcHV0ZXJCb2FyZC5pc0FsbFNoaXBzU3VuaygpKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tYXdhaXQtaW4tbG9vcFxuICAgICAgYXdhaXQgcGxheVR1cm4oKTtcbiAgICB9XG4gICAgY2hlY2tGb3JXaW5uZXIoKTtcbiAgfTtcblxuICBkb21Db250cm9sbGVyLmluaXRpYWxpemVTdGFydEJ0bigpO1xuICBcbiAgdXNlckJvYXJkLnBsYWNlUmFuZG9tU2hpcHMoKTtcbiAgY29tcHV0ZXJCb2FyZC5wbGFjZVJhbmRvbVNoaXBzKCk7XG4gIGRvbUNvbnRyb2xsZXIucmVuZGVyU2hpcHMoY29tcHV0ZXJCb2FyZCk7XG4gIFxuICAvLyBkb21Db250cm9sbGVyLnJlbmRlclNoaXBzKHVzZXJCb2FyZCwgdXNlcik7XG4gIC8vIFN0YXJ0IHRoZSBnYW1lIGxvb3BcbiAgZ2FtZUxvb3AoKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGdhbWU7XG4iLCJpbXBvcnQgU2hpcCBmcm9tIFwiLi9zaGlwXCI7XG5cbmNvbnN0IEdhbWVCb2FyZCA9IChzaXplID0gMTApID0+IHtcbiAgY29uc3QgYm9hcmQgPSBbXTtcbiAgY29uc3QgbWlzc2VkU2hvdHMgPSBbXTtcbiAgY29uc3Qgc2hpcHMgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpICs9IDEpIHtcbiAgICBib2FyZC5wdXNoKFtdKTtcbiAgICBtaXNzZWRTaG90cy5wdXNoKFtdKTtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IHNpemU7IGogKz0gMSkge1xuICAgICAgYm9hcmRbaV0ucHVzaChudWxsKTtcbiAgICAgIG1pc3NlZFNob3RzW2ldLnB1c2goZmFsc2UpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGdldEJvYXJkID0gKCkgPT4gYm9hcmQ7XG4gIGNvbnN0IGdldE1pc3NlZFNob3RzID0gKCkgPT4gbWlzc2VkU2hvdHM7XG5cbiAgY29uc3QgaXNQb3NpdGlvbk91dE9mQm91bmRzID0gKHJvdywgY29sdW1uKSA9PlxuICAgIHJvdyA8IDAgfHwgY29sdW1uIDwgMCB8fCByb3cgPj0gc2l6ZSB8fCBjb2x1bW4gPj0gc2l6ZTtcblxuICBjb25zdCBpc1NoaXBFbmRPdXRPZkJvdW5kcyA9IChyb3csIGNvbHVtbiwgc2hpcCkgPT4ge1xuICAgIGlmIChzaGlwLmdldElzVmVydGljYWwoKSkgcmV0dXJuIHJvdyArIHNoaXAuZ2V0TGVuZ3RoKCkgPj0gc2l6ZTtcbiAgICByZXR1cm4gY29sdW1uICsgc2hpcC5nZXRMZW5ndGgoKSA+PSBzaXplO1xuICB9O1xuXG4gIGNvbnN0IGlzUG9zaXRpb25UYWtlbiA9IChyb3csIGNvbHVtbiwgc2hpcCkgPT4ge1xuICAgIGlmIChzaGlwLmdldElzVmVydGljYWwoKSkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmdldExlbmd0aCgpOyBpICs9IDEpIHtcbiAgICAgICAgaWYgKGJvYXJkW3JvdyArIGldW2NvbHVtbl0gIT09IG51bGwpIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAuZ2V0TGVuZ3RoKCk7IGkgKz0gMSkge1xuICAgICAgICBpZiAoYm9hcmRbcm93XVtjb2x1bW4gKyBpXSAhPT0gbnVsbCkgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICBjb25zdCBpc05laWdoYm9yVGFrZW4gPSAocm93LCBjb2x1bW4sIHNoaXApID0+IHtcbiAgICBpZiAoc2hpcC5nZXRJc1ZlcnRpY2FsKCkpIHtcbiAgICAgIGZvciAobGV0IGkgPSByb3cgLSAxOyBpIDw9IHJvdyArIHNoaXAuZ2V0TGVuZ3RoKCk7IGkgKz0gMSkge1xuICAgICAgICBmb3IgKGxldCBqID0gY29sdW1uIC0gMTsgaiA8PSBjb2x1bW4gKyAxOyBqICs9IDEpIHtcbiAgICAgICAgICBpZiAoIWlzUG9zaXRpb25PdXRPZkJvdW5kcyhpLCBqKSAmJiBib2FyZFtpXVtqXSkgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChsZXQgaSA9IHJvdyAtIDE7IGkgPD0gcm93ICsgMTsgaSArPSAxKSB7XG4gICAgICAgIGZvciAobGV0IGogPSBjb2x1bW4gLSAxOyBqIDw9IGNvbHVtbiArIHNoaXAuZ2V0TGVuZ3RoKCk7IGogKz0gMSkge1xuICAgICAgICAgIGlmICghaXNQb3NpdGlvbk91dE9mQm91bmRzKGksIGopICYmIGJvYXJkW2ldW2pdKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgY29uc3QgaXNWYWxpZFBvc2l0aW9uID0gKHJvdywgY29sdW1uLCBzaGlwKSA9PiB7XG4gICAgaWYgKGlzUG9zaXRpb25PdXRPZkJvdW5kcyhyb3csIGNvbHVtbikpIHJldHVybiBmYWxzZTtcbiAgICBpZiAoaXNTaGlwRW5kT3V0T2ZCb3VuZHMocm93LCBjb2x1bW4sIHNoaXApKSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKGlzUG9zaXRpb25UYWtlbihyb3csIGNvbHVtbiwgc2hpcCkpIHJldHVybiBmYWxzZTtcbiAgICBpZiAoaXNOZWlnaGJvclRha2VuKHJvdywgY29sdW1uLCBzaGlwKSkgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIGNvbnN0IHBsYWNlU2hpcCA9IChyb3csIGNvbHVtbiwgc2hpcCkgPT4ge1xuICAgIGlmICghaXNWYWxpZFBvc2l0aW9uKHJvdywgY29sdW1uLCBzaGlwKSkgcmV0dXJuIGZhbHNlO1xuICAgIGlmIChzaGlwLmdldElzVmVydGljYWwoKSkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmdldExlbmd0aCgpOyBpICs9IDEpIHtcbiAgICAgICAgYm9hcmRbcm93ICsgaV1bY29sdW1uXSA9IHNoaXA7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5nZXRMZW5ndGgoKTsgaSArPSAxKSB7XG4gICAgICAgIGJvYXJkW3Jvd11bY29sdW1uICsgaV0gPSBzaGlwO1xuICAgICAgfVxuICAgIH1cbiAgICBzaGlwLnNldFN0YXJ0Q2VsbChyb3csIGNvbHVtbik7XG4gICAgc2hpcHMucHVzaChzaGlwKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICBjb25zdCByZW1vdmVTaGlwID0gKHJvdywgY29sdW1uKSA9PiB7XG4gICAgY29uc3Qgc2hpcCA9IGJvYXJkW3Jvd11bY29sdW1uXTtcbiAgICBjb25zdCBzdGFydFJvdyA9IHNoaXAuZ2V0U3RhcnRDZWxsKClbMF07XG4gICAgY29uc3Qgc3RhcnRDb2x1bW4gPSBzaGlwLmdldFN0YXJ0Q2VsbCgpWzFdO1xuICAgIGlmIChzaGlwLmdldElzVmVydGljYWwoKSkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmdldExlbmd0aCgpOyBpICs9IDEpIHtcbiAgICAgICAgYm9hcmRbc3RhcnRSb3cgKyBpXVtzdGFydENvbHVtbl0gPSBudWxsO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAuZ2V0TGVuZ3RoKCk7IGkgKz0gMSkge1xuICAgICAgICBib2FyZFtzdGFydFJvd11bc3RhcnRDb2x1bW4gKyBpXSA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIHNoaXBzLnNwbGljZShzaGlwcy5pbmRleE9mKHNoaXApLCAxKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICBjb25zdCBwbGFjZVJhbmRvbVNoaXBzID0gKCkgPT4ge1xuICAgIGNvbnN0IHNoaXBMZW5ndGhzID0gWzUsIDQsIDMsIDMsIDJdO1xuXG4gICAgc2hpcExlbmd0aHMuZm9yRWFjaCgobGVuZ3RoKSA9PiB7XG4gICAgICBsZXQgaXNTaGlwUGxhY2VkID0gZmFsc2U7XG5cbiAgICAgIHdoaWxlICghaXNTaGlwUGxhY2VkKSB7XG4gICAgICAgIGNvbnN0IGlzVmVydGljYWwgPSBNYXRoLnJhbmRvbSgpIDwgMC41O1xuICAgICAgICBjb25zdCByb3cgPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBzaXplKTtcbiAgICAgICAgY29uc3QgY29sdW1uID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogc2l6ZSk7XG4gICAgICAgIGNvbnN0IG5ld1NoaXAgPSBTaGlwKGxlbmd0aCwgaXNWZXJ0aWNhbCk7XG5cbiAgICAgICAgaWYgKGlzVmFsaWRQb3NpdGlvbihyb3csIGNvbHVtbiwgbmV3U2hpcCkpIHtcbiAgICAgICAgICBwbGFjZVNoaXAocm93LCBjb2x1bW4sIG5ld1NoaXApO1xuICAgICAgICAgIGlzU2hpcFBsYWNlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBjb25zdCByZWNpZXZlQXR0YWNrID0gKHJvdywgY29sdW1uKSA9PiB7XG4gICAgaWYgKGlzUG9zaXRpb25PdXRPZkJvdW5kcyhyb3csIGNvbHVtbikpIHJldHVybiBmYWxzZTtcbiAgICBpZiAoYm9hcmRbcm93XVtjb2x1bW5dKSB7XG4gICAgICBib2FyZFtyb3ddW2NvbHVtbl0uaGl0KCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgbWlzc2VkU2hvdHNbcm93XVtjb2x1bW5dID0gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgY29uc3QgaXNBbGxTaGlwc1N1bmsgPSAoKSA9PiBzaGlwcy5ldmVyeSgoc2hpcCkgPT4gc2hpcC5pc1N1bmsoKSA9PT0gdHJ1ZSk7XG5cbiAgcmV0dXJuIHtcbiAgICBnZXRCb2FyZCxcbiAgICBwbGFjZVNoaXAsXG4gICAgcmVtb3ZlU2hpcCxcbiAgICBwbGFjZVJhbmRvbVNoaXBzLFxuICAgIHJlY2lldmVBdHRhY2ssXG4gICAgZ2V0TWlzc2VkU2hvdHMsXG4gICAgaXNBbGxTaGlwc1N1bmssXG4gIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBHYW1lQm9hcmQ7XG4iLCJjb25zdCBQbGF5ZXIgPSAobmFtZSkgPT4ge1xuICBjb25zdCBoaXRSZWNvcmQgPSBuZXcgU2V0KCk7XG5cbiAgY29uc3QgaGFzQWxyZWF5SGl0ID0gKHJvdywgY29sdW1uKSA9PiBoaXRSZWNvcmQuaGFzKGAke3Jvd30tJHtjb2x1bW59YCk7XG5cbiAgY29uc3QgaXNJbnZhbGlkUG9zaXRpb24gPSAocm93LCBjb2x1bW4sIHNpemUpID0+XG4gICAgcm93IDwgMCB8fCBjb2x1bW4gPCAwIHx8IHJvdyA+PSBzaXplIHx8IGNvbHVtbiA+PSBzaXplO1xuXG4gIGNvbnN0IGdldFJhbmRvbVBvc2l0aW9uID0gKGdhbWVCb2FyZCkgPT5cbiAgICBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBnYW1lQm9hcmQuZ2V0Qm9hcmQoKS5sZW5ndGgpO1xuXG4gIGNvbnN0IGdldE5hbWUgPSAoKSA9PiBuYW1lO1xuXG4gIGNvbnN0IGF0dGFjayA9IChyb3csIGNvbHVtbiwgZ2FtZUJvYXJkKSA9PiB7XG4gICAgaWYgKGhhc0FscmVheUhpdChyb3csIGNvbHVtbikpIHJldHVybiBmYWxzZTtcbiAgICBpZiAoIWlzSW52YWxpZFBvc2l0aW9uKHJvdywgY29sdW1uLCBnYW1lQm9hcmQuZ2V0Qm9hcmQoKS5sZW5ndGgpKSB7XG4gICAgICBnYW1lQm9hcmQucmVjaWV2ZUF0dGFjayhyb3csIGNvbHVtbik7XG4gICAgICBoaXRSZWNvcmQuYWRkKGAke3Jvd30tJHtjb2x1bW59YCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIGNvbnN0IHJhbmRvbUF0dGFjayA9IChnYW1lQm9hcmQpID0+IHtcbiAgICBpZiAoaGl0UmVjb3JkLnNpemUgPT09IDEwMCkgcmV0dXJuIGZhbHNlO1xuICAgIGxldCByYW5kb21Sb3cgPSBnZXRSYW5kb21Qb3NpdGlvbihnYW1lQm9hcmQpO1xuICAgIGxldCByYW5kb21Db2wgPSBnZXRSYW5kb21Qb3NpdGlvbihnYW1lQm9hcmQpO1xuXG4gICAgd2hpbGUgKGhhc0FscmVheUhpdChyYW5kb21Sb3csIHJhbmRvbUNvbCkpIHtcbiAgICAgIHJhbmRvbVJvdyA9IGdldFJhbmRvbVBvc2l0aW9uKGdhbWVCb2FyZCk7XG4gICAgICByYW5kb21Db2wgPSBnZXRSYW5kb21Qb3NpdGlvbihnYW1lQm9hcmQpO1xuICAgIH1cbiAgICBnYW1lQm9hcmQucmVjaWV2ZUF0dGFjayhyYW5kb21Sb3csIHJhbmRvbUNvbCk7XG4gICAgaGl0UmVjb3JkLmFkZChgJHtyYW5kb21Sb3d9LSR7cmFuZG9tQ29sfWApO1xuICAgIHJldHVybiBbcmFuZG9tUm93LCByYW5kb21Db2xdO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgZ2V0TmFtZSxcbiAgICBhdHRhY2ssXG4gICAgcmFuZG9tQXR0YWNrLFxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgUGxheWVyO1xuIiwiY29uc3QgU2hpcCA9IChsZW5ndGgsIGlzVmVydGljYWwgPSBmYWxzZSkgPT4ge1xuICBsZXQgaGl0cyA9IDA7XG4gIGxldCBzdGFydFJvdztcbiAgbGV0IHN0YXJ0Q29sdW1uO1xuXG4gIGNvbnN0IGdldExlbmd0aCA9ICgpID0+IGxlbmd0aDtcbiAgY29uc3QgZ2V0SXNWZXJ0aWNhbCA9ICgpID0+IGlzVmVydGljYWw7XG4gIGNvbnN0IGdldEhpdHMgPSAoKSA9PiBoaXRzO1xuICBjb25zdCBpc1N1bmsgPSAoKSA9PiBoaXRzID09PSBsZW5ndGg7XG4gIGNvbnN0IGhpdCA9ICgpID0+IHtcbiAgICBpZiAoaGl0cyA8IGxlbmd0aCkgaGl0cyArPSAxO1xuICB9O1xuICBjb25zdCBnZXRTdGFydENlbGwgPSAoKSA9PiBbc3RhcnRSb3csIHN0YXJ0Q29sdW1uXTtcbiAgY29uc3Qgc2V0U3RhcnRDZWxsID0gKHJvdywgY29sdW1uKSA9PiB7XG4gICAgc3RhcnRSb3cgPSByb3c7XG4gICAgc3RhcnRDb2x1bW4gPSBjb2x1bW47XG4gIH07XG4gIGNvbnN0IHRvSlNPTiA9ICgpID0+ICh7XG4gICAgbGVuZ3RoOiBnZXRMZW5ndGgoKSxcbiAgICBpc1ZlcnRpY2FsOiBnZXRJc1ZlcnRpY2FsKCksXG4gICAgaGl0czogZ2V0SGl0cygpLFxuICAgIHN0YXJ0Q2VsbDogZ2V0U3RhcnRDZWxsKCksXG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgZ2V0TGVuZ3RoLFxuICAgIGdldElzVmVydGljYWwsXG4gICAgZ2V0SGl0cyxcbiAgICBpc1N1bmssXG4gICAgaGl0LFxuICAgIGdldFN0YXJ0Q2VsbCxcbiAgICBzZXRTdGFydENlbGwsXG4gICAgdG9KU09OLFxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgU2hpcDtcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGAqLFxuKjo6YmVmb3JlLFxuKjo6YWZ0ZXIge1xuICBtYXJnaW46IDA7XG4gIHBhZGRpbmc6IDA7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG59XG5cbmh0bWwsXG5ib2R5IHtcbiAgaGVpZ2h0OiAxMDAlO1xuICB3aWR0aDogMTAwJTtcbn1cblxuLmJvYXJkcyB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xufVxuXG4uYm9hcmQge1xuICB3aWR0aDogbWF4LWNvbnRlbnQ7XG59XG5cbi5yb3cge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogcm93O1xufVxuXG4uY2VsbCB7XG4gIHdpZHRoOiAycmVtO1xuICBhc3BlY3QtcmF0aW86IDE7XG4gIGJvcmRlcjogMXB4IHNvbGlkIGJsdWU7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbn1cblxuLnNoaXAge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiBncmVlbjtcbiAgYm9yZGVyOiBub25lO1xufVxuXG4ubWlzc2VkIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogYXF1YTtcbn1cblxuLmhpdCB7XG4gIGJhY2tncm91bmQtY29sb3I6IHJlZDtcbn1cblxuLndpbm5lck1vZGFsIHtcbiAgcGFkZGluZzogMnJlbSA1cmVtO1xuICBvdXRsaW5lOiBub25lO1xuICBib3JkZXI6IG5vbmU7XG4gIG1hcmdpbjogYXV0bztcbiAgYm9yZGVyLXJhZGl1czogMXJlbTtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBnYXA6IDFyZW07XG59XG5cbi53aW5uZXJNZXNzYWdlIHtcbiAgZm9udC1zaXplOiAxLjVyZW07XG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xufVxuXG4uYnV0dG9uQ29udGFpbmVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG59XG5cbi5zdGFydEJ0bixcbi5yZXN0YXJ0QnRuIHtcbiAgZm9udC1zaXplOiAxcmVtO1xuICBwYWRkaW5nOiAwLjVyZW0gMS41cmVtO1xuICBib3JkZXItcmFkaXVzOiAxcmVtO1xuICBib3JkZXI6IG5vbmU7XG4gIG91dGxpbmU6IG5vbmU7XG4gIGN1cnNvcjogcG9pbnRlcjtcbn1gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9zdHlsZXMvc3R5bGVzLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTs7O0VBR0UsU0FBUztFQUNULFVBQVU7RUFDVixzQkFBc0I7QUFDeEI7O0FBRUE7O0VBRUUsWUFBWTtFQUNaLFdBQVc7QUFDYjs7QUFFQTtFQUNFLGFBQWE7RUFDYiw2QkFBNkI7QUFDL0I7O0FBRUE7RUFDRSxrQkFBa0I7QUFDcEI7O0FBRUE7RUFDRSxhQUFhO0VBQ2IsbUJBQW1CO0FBQ3JCOztBQUVBO0VBQ0UsV0FBVztFQUNYLGVBQWU7RUFDZixzQkFBc0I7RUFDdEIsa0JBQWtCO0FBQ3BCOztBQUVBO0VBQ0UsdUJBQXVCO0VBQ3ZCLFlBQVk7QUFDZDs7QUFFQTtFQUNFLHNCQUFzQjtBQUN4Qjs7QUFFQTtFQUNFLHFCQUFxQjtBQUN2Qjs7QUFFQTtFQUNFLGtCQUFrQjtFQUNsQixhQUFhO0VBQ2IsWUFBWTtFQUNaLFlBQVk7RUFDWixtQkFBbUI7RUFDbkIsYUFBYTtFQUNiLHNCQUFzQjtFQUN0QixrQkFBa0I7RUFDbEIsU0FBUztBQUNYOztBQUVBO0VBQ0UsaUJBQWlCO0VBQ2pCLGlCQUFpQjtBQUNuQjs7QUFFQTtFQUNFLGFBQWE7RUFDYix1QkFBdUI7QUFDekI7O0FBRUE7O0VBRUUsZUFBZTtFQUNmLHNCQUFzQjtFQUN0QixtQkFBbUI7RUFDbkIsWUFBWTtFQUNaLGFBQWE7RUFDYixlQUFlO0FBQ2pCXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIiosXFxuKjo6YmVmb3JlLFxcbio6OmFmdGVyIHtcXG4gIG1hcmdpbjogMDtcXG4gIHBhZGRpbmc6IDA7XFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbn1cXG5cXG5odG1sLFxcbmJvZHkge1xcbiAgaGVpZ2h0OiAxMDAlO1xcbiAgd2lkdGg6IDEwMCU7XFxufVxcblxcbi5ib2FyZHMge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcbn1cXG5cXG4uYm9hcmQge1xcbiAgd2lkdGg6IG1heC1jb250ZW50O1xcbn1cXG5cXG4ucm93IHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogcm93O1xcbn1cXG5cXG4uY2VsbCB7XFxuICB3aWR0aDogMnJlbTtcXG4gIGFzcGVjdC1yYXRpbzogMTtcXG4gIGJvcmRlcjogMXB4IHNvbGlkIGJsdWU7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxufVxcblxcbi5zaGlwIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IGdyZWVuO1xcbiAgYm9yZGVyOiBub25lO1xcbn1cXG5cXG4ubWlzc2VkIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IGFxdWE7XFxufVxcblxcbi5oaXQge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmVkO1xcbn1cXG5cXG4ud2lubmVyTW9kYWwge1xcbiAgcGFkZGluZzogMnJlbSA1cmVtO1xcbiAgb3V0bGluZTogbm9uZTtcXG4gIGJvcmRlcjogbm9uZTtcXG4gIG1hcmdpbjogYXV0bztcXG4gIGJvcmRlci1yYWRpdXM6IDFyZW07XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGdhcDogMXJlbTtcXG59XFxuXFxuLndpbm5lck1lc3NhZ2Uge1xcbiAgZm9udC1zaXplOiAxLjVyZW07XFxuICBmb250LXdlaWdodDogYm9sZDtcXG59XFxuXFxuLmJ1dHRvbkNvbnRhaW5lciB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxufVxcblxcbi5zdGFydEJ0bixcXG4ucmVzdGFydEJ0biB7XFxuICBmb250LXNpemU6IDFyZW07XFxuICBwYWRkaW5nOiAwLjVyZW0gMS41cmVtO1xcbiAgYm9yZGVyLXJhZGl1czogMXJlbTtcXG4gIGJvcmRlcjogbm9uZTtcXG4gIG91dGxpbmU6IG5vbmU7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxufVwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLypcbiAgTUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcpIHtcbiAgdmFyIGxpc3QgPSBbXTtcblxuICAvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcbiAgICAgIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2YgaXRlbVs1XSAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGNvbnRlbnQgKz0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtKTtcbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSkuam9pbihcIlwiKTtcbiAgfTtcblxuICAvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuICBsaXN0LmkgPSBmdW5jdGlvbiBpKG1vZHVsZXMsIG1lZGlhLCBkZWR1cGUsIHN1cHBvcnRzLCBsYXllcikge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgbW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgdW5kZWZpbmVkXV07XG4gICAgfVxuICAgIHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG4gICAgaWYgKGRlZHVwZSkge1xuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0aGlzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIHZhciBpZCA9IHRoaXNba11bMF07XG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIF9rID0gMDsgX2sgPCBtb2R1bGVzLmxlbmd0aDsgX2srKykge1xuICAgICAgdmFyIGl0ZW0gPSBbXS5jb25jYXQobW9kdWxlc1tfa10pO1xuICAgICAgaWYgKGRlZHVwZSAmJiBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBsYXllciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW1bNV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChtZWRpYSkge1xuICAgICAgICBpZiAoIWl0ZW1bMl0pIHtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc3VwcG9ydHMpIHtcbiAgICAgICAgaWYgKCFpdGVtWzRdKSB7XG4gICAgICAgICAgaXRlbVs0XSA9IFwiXCIuY29uY2F0KHN1cHBvcnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNF0gPSBzdXBwb3J0cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIGxpc3Q7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHZhciBjb250ZW50ID0gaXRlbVsxXTtcbiAgdmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuICBpZiAoIWNzc01hcHBpbmcpIHtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuICBpZiAodHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjc3NNYXBwaW5nKSkpKTtcbiAgICB2YXIgZGF0YSA9IFwic291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsXCIuY29uY2F0KGJhc2U2NCk7XG4gICAgdmFyIHNvdXJjZU1hcHBpbmcgPSBcIi8qIyBcIi5jb25jYXQoZGF0YSwgXCIgKi9cIik7XG4gICAgcmV0dXJuIFtjb250ZW50XS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKFwiXFxuXCIpO1xuICB9XG4gIHJldHVybiBbY29udGVudF0uam9pbihcIlxcblwiKTtcbn07IiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlcy5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlcy5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHN0eWxlc0luRE9NID0gW107XG5mdW5jdGlvbiBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKSB7XG4gIHZhciByZXN1bHQgPSAtMTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXNJbkRPTS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdHlsZXNJbkRPTVtpXS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XG4gICAgICByZXN1bHQgPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucykge1xuICB2YXIgaWRDb3VudE1hcCA9IHt9O1xuICB2YXIgaWRlbnRpZmllcnMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldO1xuICAgIHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuICAgIHZhciBjb3VudCA9IGlkQ291bnRNYXBbaWRdIHx8IDA7XG4gICAgdmFyIGlkZW50aWZpZXIgPSBcIlwiLmNvbmNhdChpZCwgXCIgXCIpLmNvbmNhdChjb3VudCk7XG4gICAgaWRDb3VudE1hcFtpZF0gPSBjb3VudCArIDE7XG4gICAgdmFyIGluZGV4QnlJZGVudGlmaWVyID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgIGNzczogaXRlbVsxXSxcbiAgICAgIG1lZGlhOiBpdGVtWzJdLFxuICAgICAgc291cmNlTWFwOiBpdGVtWzNdLFxuICAgICAgc3VwcG9ydHM6IGl0ZW1bNF0sXG4gICAgICBsYXllcjogaXRlbVs1XVxuICAgIH07XG4gICAgaWYgKGluZGV4QnlJZGVudGlmaWVyICE9PSAtMSkge1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnJlZmVyZW5jZXMrKztcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS51cGRhdGVyKG9iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB1cGRhdGVyID0gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucyk7XG4gICAgICBvcHRpb25zLmJ5SW5kZXggPSBpO1xuICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKGksIDAsIHtcbiAgICAgICAgaWRlbnRpZmllcjogaWRlbnRpZmllcixcbiAgICAgICAgdXBkYXRlcjogdXBkYXRlcixcbiAgICAgICAgcmVmZXJlbmNlczogMVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlkZW50aWZpZXJzLnB1c2goaWRlbnRpZmllcik7XG4gIH1cbiAgcmV0dXJuIGlkZW50aWZpZXJzO1xufVxuZnVuY3Rpb24gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucykge1xuICB2YXIgYXBpID0gb3B0aW9ucy5kb21BUEkob3B0aW9ucyk7XG4gIGFwaS51cGRhdGUob2JqKTtcbiAgdmFyIHVwZGF0ZXIgPSBmdW5jdGlvbiB1cGRhdGVyKG5ld09iaikge1xuICAgIGlmIChuZXdPYmopIHtcbiAgICAgIGlmIChuZXdPYmouY3NzID09PSBvYmouY3NzICYmIG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmIG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXAgJiYgbmV3T2JqLnN1cHBvcnRzID09PSBvYmouc3VwcG9ydHMgJiYgbmV3T2JqLmxheWVyID09PSBvYmoubGF5ZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgYXBpLnVwZGF0ZShvYmogPSBuZXdPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcGkucmVtb3ZlKCk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gdXBkYXRlcjtcbn1cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGxpc3QsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGxpc3QgPSBsaXN0IHx8IFtdO1xuICB2YXIgbGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpO1xuICByZXR1cm4gZnVuY3Rpb24gdXBkYXRlKG5ld0xpc3QpIHtcbiAgICBuZXdMaXN0ID0gbmV3TGlzdCB8fCBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGlkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbaV07XG4gICAgICB2YXIgaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4XS5yZWZlcmVuY2VzLS07XG4gICAgfVxuICAgIHZhciBuZXdMYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obmV3TGlzdCwgb3B0aW9ucyk7XG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciBfaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tfaV07XG4gICAgICB2YXIgX2luZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoX2lkZW50aWZpZXIpO1xuICAgICAgaWYgKHN0eWxlc0luRE9NW19pbmRleF0ucmVmZXJlbmNlcyA9PT0gMCkge1xuICAgICAgICBzdHlsZXNJbkRPTVtfaW5kZXhdLnVwZGF0ZXIoKTtcbiAgICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKF9pbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuICAgIGxhc3RJZGVudGlmaWVycyA9IG5ld0xhc3RJZGVudGlmaWVycztcbiAgfTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBtZW1vID0ge307XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZ2V0VGFyZ2V0KHRhcmdldCkge1xuICBpZiAodHlwZW9mIG1lbW9bdGFyZ2V0XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHZhciBzdHlsZVRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTtcblxuICAgIC8vIFNwZWNpYWwgY2FzZSB0byByZXR1cm4gaGVhZCBvZiBpZnJhbWUgaW5zdGVhZCBvZiBpZnJhbWUgaXRzZWxmXG4gICAgaWYgKHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCAmJiBzdHlsZVRhcmdldCBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gVGhpcyB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBhY2Nlc3MgdG8gaWZyYW1lIGlzIGJsb2NrZWRcbiAgICAgICAgLy8gZHVlIHRvIGNyb3NzLW9yaWdpbiByZXN0cmljdGlvbnNcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBzdHlsZVRhcmdldC5jb250ZW50RG9jdW1lbnQuaGVhZDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHRcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICBtZW1vW3RhcmdldF0gPSBzdHlsZVRhcmdldDtcbiAgfVxuICByZXR1cm4gbWVtb1t0YXJnZXRdO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydEJ5U2VsZWN0b3IoaW5zZXJ0LCBzdHlsZSkge1xuICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KGluc2VydCk7XG4gIGlmICghdGFyZ2V0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnQnIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcbiAgfVxuICB0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRCeVNlbGVjdG9yOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKSB7XG4gIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICBvcHRpb25zLnNldEF0dHJpYnV0ZXMoZWxlbWVudCwgb3B0aW9ucy5hdHRyaWJ1dGVzKTtcbiAgb3B0aW9ucy5pbnNlcnQoZWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydFN0eWxlRWxlbWVudDsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMoc3R5bGVFbGVtZW50KSB7XG4gIHZhciBub25jZSA9IHR5cGVvZiBfX3dlYnBhY2tfbm9uY2VfXyAhPT0gXCJ1bmRlZmluZWRcIiA/IF9fd2VicGFja19ub25jZV9fIDogbnVsbDtcbiAgaWYgKG5vbmNlKSB7XG4gICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm5vbmNlXCIsIG5vbmNlKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXM7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopIHtcbiAgdmFyIGNzcyA9IFwiXCI7XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChvYmouc3VwcG9ydHMsIFwiKSB7XCIpO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJAbWVkaWEgXCIuY29uY2F0KG9iai5tZWRpYSwgXCIge1wiKTtcbiAgfVxuICB2YXIgbmVlZExheWVyID0gdHlwZW9mIG9iai5sYXllciAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIkBsYXllclwiLmNvbmNhdChvYmoubGF5ZXIubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChvYmoubGF5ZXIpIDogXCJcIiwgXCIge1wiKTtcbiAgfVxuICBjc3MgKz0gb2JqLmNzcztcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgdmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG4gIGlmIChzb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiLmNvbmNhdChidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpLCBcIiAqL1wiKTtcbiAgfVxuXG4gIC8vIEZvciBvbGQgSUVcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuICBvcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xufVxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xuICAvLyBpc3RhbmJ1bCBpZ25vcmUgaWZcbiAgaWYgKHN0eWxlRWxlbWVudC5wYXJlbnROb2RlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZG9tQVBJKG9wdGlvbnMpIHtcbiAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHJldHVybiB7XG4gICAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZSgpIHt9LFxuICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7fVxuICAgIH07XG4gIH1cbiAgdmFyIHN0eWxlRWxlbWVudCA9IG9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuICByZXR1cm4ge1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKG9iaikge1xuICAgICAgYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcbiAgICB9XG4gIH07XG59XG5tb2R1bGUuZXhwb3J0cyA9IGRvbUFQSTsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCkge1xuICBpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHdoaWxlIChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xuICAgICAgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcbiAgICB9XG4gICAgc3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHN0eWxlVGFnVHJhbnNmb3JtOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0aWQ6IG1vZHVsZUlkLFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5jID0gdW5kZWZpbmVkOyIsImltcG9ydCBcIi4vc3R5bGVzL3N0eWxlcy5jc3NcIjtcbmltcG9ydCBnYW1lIGZyb20gXCIuL21vZHVsZXMvZ2FtZVwiO1xuXG5nYW1lKCk7Il0sIm5hbWVzIjpbIlNoaXAiLCJET01jb250cm9sbGVyIiwiY3JlYXRlQ2VsbCIsInJvd0luZGV4IiwiY29sdW1uSW5kZXgiLCJjZWxsIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NMaXN0IiwiYWRkIiwic2V0QXR0cmlidXRlIiwiY3JlYXRlUm93Iiwicm93QXJyYXkiLCJyb3ciLCJmb3JFYWNoIiwiXyIsImNvbHVtbiIsImFwcGVuZENoaWxkIiwicmVuZGVyR2FtZUJvYXJkIiwiZ2FtZUJvYXJkIiwiYm9hcmRBcnJheSIsImdldEJvYXJkIiwiYm9hcmQiLCJyZW5kZXJTaGlwcyIsImJvYXJkQ29udGFpbmVyIiwicXVlcnlTZWxlY3RvciIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJzaGlwIiwicmVtb3ZlIiwiY2VsbFZhbHVlIiwiYWRkRXZlbnRMaXN0ZW5lciIsImV2ZW50IiwiY29uc29sZSIsImxvZyIsImRhdGFUcmFuc2ZlciIsInNldERhdGEiLCJKU09OIiwic3RyaW5naWZ5IiwicHJldmVudERlZmF1bHQiLCJkYXRhIiwicGFyc2UiLCJnZXREYXRhIiwib2xkUm93SW5kZXgiLCJvbGRDb2x1bW5JbmRleCIsImxlbmd0aCIsImlzVmVydGljYWwiLCJuZXdDZWxsIiwidGFyZ2V0IiwiY2xvc2VzdCIsImNvbnRhaW5zIiwibmV3Um93SW5kZXgiLCJwYXJzZUludCIsImdldEF0dHJpYnV0ZSIsIm5ld0NvbHVtbkluZGV4IiwicmVtb3ZlU2hpcCIsIm9sZENlbGwiLCJwbGFjZVNoaXAiLCJpbml0aWFsaXplUmVzdGFydEJ0biIsInJlc3RhcnRCdG4iLCJ3aW5kb3ciLCJsb2NhdGlvbiIsInJlbG9hZCIsImdhbWVTdGFydGVkIiwic3RhcnRHYW1lIiwic3RhcnRCdG4iLCJ0ZXh0Q29udGVudCIsInNoaXBjZWxscyIsInNoaXBjZWxsIiwiaGFuZGxlQ2VsbENsaWNrIiwicmVzb2x2ZSIsImdldFVzZXJNb3ZlIiwiUHJvbWlzZSIsInVzZXJCb2FyZENvbnRhaW5lciIsImhhbmRsZUNsaWNrIiwiaW5pdGlhbGl6ZVN0YXJ0QnRuIiwib25jZSIsImhhbmRsZUNlbGxVcGRhdGUiLCJjb29yZHMiLCJtaXNzZWRTaG90cyIsInBsYXllciIsImdldE5hbWUiLCJpc0hpdCIsInNob3dXaW5uZXIiLCJ3aW5uZXIiLCJ3aW5uZXJNb2RhbCIsIndpbm5lck1lc3NhZ2UiLCJhcHBlbmQiLCJzaG93TW9kYWwiLCJHYW1lQm9hcmQiLCJQbGF5ZXIiLCJnYW1lIiwidXNlciIsImNvbXB1dGVyIiwidXNlckJvYXJkIiwiY29tcHV0ZXJCb2FyZCIsImRvbUNvbnRyb2xsZXIiLCJjb21wdXRlckJvYXJkQ29udGFpbmVyIiwicGxheVR1cm4iLCJ1c2VyQ2VsbENvb3JkcyIsInVzZXJBdHRhY2tTdWNjZXNzIiwiYXR0YWNrIiwiZ2V0TWlzc2VkU2hvdHMiLCJjb21wdXRlckNlbGxDb29yZHMiLCJyYW5kb21BdHRhY2siLCJjaGVja0Zvcldpbm5lciIsImlzQWxsU2hpcHNTdW5rIiwiZ2FtZUxvb3AiLCJwbGFjZVJhbmRvbVNoaXBzIiwic2l6ZSIsImFyZ3VtZW50cyIsInVuZGVmaW5lZCIsInNoaXBzIiwiaSIsInB1c2giLCJqIiwiaXNQb3NpdGlvbk91dE9mQm91bmRzIiwiaXNTaGlwRW5kT3V0T2ZCb3VuZHMiLCJnZXRJc1ZlcnRpY2FsIiwiZ2V0TGVuZ3RoIiwiaXNQb3NpdGlvblRha2VuIiwiaXNOZWlnaGJvclRha2VuIiwiaXNWYWxpZFBvc2l0aW9uIiwic2V0U3RhcnRDZWxsIiwic3RhcnRSb3ciLCJnZXRTdGFydENlbGwiLCJzdGFydENvbHVtbiIsInNwbGljZSIsImluZGV4T2YiLCJzaGlwTGVuZ3RocyIsImlzU2hpcFBsYWNlZCIsIk1hdGgiLCJyYW5kb20iLCJmbG9vciIsIm5ld1NoaXAiLCJyZWNpZXZlQXR0YWNrIiwiaGl0IiwiZXZlcnkiLCJpc1N1bmsiLCJuYW1lIiwiaGl0UmVjb3JkIiwiU2V0IiwiaGFzQWxyZWF5SGl0IiwiaGFzIiwiaXNJbnZhbGlkUG9zaXRpb24iLCJnZXRSYW5kb21Qb3NpdGlvbiIsInJhbmRvbVJvdyIsInJhbmRvbUNvbCIsImhpdHMiLCJnZXRIaXRzIiwidG9KU09OIiwic3RhcnRDZWxsIl0sInNvdXJjZVJvb3QiOiIifQ==