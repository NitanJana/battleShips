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
  const renderShips = gameBoard => {
    const boardArray = gameBoard.getBoard();
    // const boardContainer =
    //   player.getName() === "user"
    //     ? document.querySelector(".userBoardContainer")
    //     : document.querySelector(".computerBoardContainer");
    const boardContainer = document.querySelector(".computerBoardContainer");
    boardArray.forEach((rowArray, rowIndex) => {
      rowArray.forEach((cellValue, columnIndex) => {
        const cell = boardContainer.querySelector(`.row:nth-child(${rowIndex + 1}) .cell:nth-child(${columnIndex + 1})`);

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
  let gameStarted = false;
  const startGame = () => {
    gameStarted = true;
    const startBtn = document.querySelector(".startBtn");
    startBtn.textContent = "Restart";
    startBtn.addEventListener("click", () => {
      window.location.reload();
    });
  };
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
  const getUserMove = () => new Promise(resolve => {
    const userBoardContainer = document.querySelector(".userBoardContainer");
    const handleClick = event => {
      handleCellClick(event, resolve);
    };
    userBoardContainer.addEventListener("click", handleClick);
  });
  const initializeStartBtn = () => {
    const startBtn = document.querySelector(".startBtn");
    startBtn.addEventListener("click", startGame, {
      once: true
    });
  };

  // Function to handle cell state change
  const handleCellUpdate = (coords, missedShots, player) => {
    const [row, column] = coords;
    let cell;
    if (player.getName() === "user") {
      cell = document.querySelector(`.userBoardContainer .row:nth-child(${row + 1}) .cell:nth-child(${column + 1})`);
    } else {
      cell = document.querySelector(`.computerBoardContainer .row:nth-child(${row + 1}) .cell:nth-child(${column + 1})`);
    }
    const isHit = !missedShots[row][column];
    cell.classList.add(isHit ? "hit" : "missed");
  };
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
  return {
    getLength,
    getIsVertical,
    getHits,
    isSunk,
    hit,
    getStartCell,
    setStartCell
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7V0NOQTs7Ozs7Ozs7Ozs7OztBQ0E2QjtBQUNLO0FBRWxDbEIseURBQUksQ0FBQyxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy8uL3NyYy9tb2R1bGVzL0RPTWNvbnRyb2xsZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcHMvLi9zcmMvbW9kdWxlcy9nYW1lLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXBzLy4vc3JjL21vZHVsZXMvZ2FtZUJvYXJkLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXBzLy4vc3JjL21vZHVsZXMvcGxheWVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXBzLy4vc3JjL21vZHVsZXMvc2hpcC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy8uL3NyYy9zdHlsZXMvc3R5bGVzLmNzcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcHMvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy8uL3NyYy9zdHlsZXMvc3R5bGVzLmNzcz9lNDViIiwid2VicGFjazovL2JhdHRsZXNoaXBzLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXBzLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXBzLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcHMvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcHMvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcHMvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXBzL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcHMvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy93ZWJwYWNrL3J1bnRpbWUvbm9uY2UiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcHMvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgRE9NY29udHJvbGxlciA9ICgpID0+IHtcbiAgLy8gRnVuY3Rpb24gdG8gY3JlYXRlIGEgc2luZ2xlIGNlbGxcbiAgY29uc3QgY3JlYXRlQ2VsbCA9IChyb3dJbmRleCwgY29sdW1uSW5kZXgpID0+IHtcbiAgICBjb25zdCBjZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBjZWxsLmNsYXNzTGlzdC5hZGQoXCJjZWxsXCIpO1xuICAgIGNlbGwuc2V0QXR0cmlidXRlKFwicm93XCIsIHJvd0luZGV4KTtcbiAgICBjZWxsLnNldEF0dHJpYnV0ZShcImNvbHVtblwiLCBjb2x1bW5JbmRleCk7XG4gICAgcmV0dXJuIGNlbGw7XG4gIH07XG5cbiAgLy8gRnVuY3Rpb24gdG8gY3JlYXRlIGEgc2luZ2xlIHJvd1xuICBjb25zdCBjcmVhdGVSb3cgPSAocm93QXJyYXksIHJvd0luZGV4KSA9PiB7XG4gICAgY29uc3Qgcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICByb3cuY2xhc3NMaXN0LmFkZChcInJvd1wiKTtcbiAgICByb3dBcnJheS5mb3JFYWNoKChfLCBjb2x1bW4pID0+IHtcbiAgICAgIGNvbnN0IGNlbGwgPSBjcmVhdGVDZWxsKHJvd0luZGV4LCBjb2x1bW4pO1xuICAgICAgcm93LmFwcGVuZENoaWxkKGNlbGwpO1xuICAgIH0pO1xuICAgIHJldHVybiByb3c7XG4gIH07XG5cbiAgLy8gRnVuY3Rpb24gdG8gcmVuZGVyIHRoZSBnYW1lIGJvYXJkXG4gIGNvbnN0IHJlbmRlckdhbWVCb2FyZCA9IChnYW1lQm9hcmQpID0+IHtcbiAgICBjb25zdCBib2FyZEFycmF5ID0gZ2FtZUJvYXJkLmdldEJvYXJkKCk7XG4gICAgY29uc3QgYm9hcmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGJvYXJkLmNsYXNzTGlzdC5hZGQoXCJib2FyZFwiKTtcblxuICAgIGJvYXJkQXJyYXkuZm9yRWFjaCgocm93QXJyYXksIHJvd0luZGV4KSA9PiB7XG4gICAgICBjb25zdCByb3cgPSBjcmVhdGVSb3cocm93QXJyYXksIHJvd0luZGV4KTtcbiAgICAgIGJvYXJkLmFwcGVuZENoaWxkKHJvdyk7XG4gICAgfSk7XG4gICAgcmV0dXJuIGJvYXJkO1xuICB9O1xuXG4gIGNvbnN0IHJlbmRlclNoaXBzID0gKGdhbWVCb2FyZCkgPT4ge1xuICAgIGNvbnN0IGJvYXJkQXJyYXkgPSBnYW1lQm9hcmQuZ2V0Qm9hcmQoKTtcbiAgICAvLyBjb25zdCBib2FyZENvbnRhaW5lciA9XG4gICAgLy8gICBwbGF5ZXIuZ2V0TmFtZSgpID09PSBcInVzZXJcIlxuICAgIC8vICAgICA/IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudXNlckJvYXJkQ29udGFpbmVyXCIpXG4gICAgLy8gICAgIDogZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jb21wdXRlckJvYXJkQ29udGFpbmVyXCIpO1xuICAgIGNvbnN0IGJvYXJkQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5jb21wdXRlckJvYXJkQ29udGFpbmVyXCIpO1xuICAgIGJvYXJkQXJyYXkuZm9yRWFjaCgocm93QXJyYXksIHJvd0luZGV4KSA9PiB7XG4gICAgICByb3dBcnJheS5mb3JFYWNoKChjZWxsVmFsdWUsIGNvbHVtbkluZGV4KSA9PiB7XG4gICAgICAgIGNvbnN0IGNlbGwgPSBib2FyZENvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAgIGAucm93Om50aC1jaGlsZCgke3Jvd0luZGV4ICsgMX0pIC5jZWxsOm50aC1jaGlsZCgke2NvbHVtbkluZGV4ICsgMX0pYCxcbiAgICAgICAgKTtcblxuICAgICAgICAvLyBDaGVjayBpZiB0aGVyZSBpcyBhIHNoaXAgYXQgdGhpcyBjZWxsXG4gICAgICAgIGlmIChjZWxsVmFsdWUpIHtcbiAgICAgICAgICBjZWxsLmNsYXNzTGlzdC5hZGQoXCJzaGlwXCIpOyAvLyBBZGQgYSBjbGFzcyB0byBpbmRpY2F0ZSBhIHNoaXAgYXQgdGhpcyBjZWxsXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IGluaXRpYWxpemVSZXN0YXJ0QnRuID0gKCkgPT4ge1xuICAgIGNvbnN0IHJlc3RhcnRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnJlc3RhcnRCdG5cIik7XG4gICAgcmVzdGFydEJ0bi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICAgIH0pO1xuICB9O1xuXG4gIGxldCBnYW1lU3RhcnRlZCA9IGZhbHNlO1xuXG4gIGNvbnN0IHN0YXJ0R2FtZSA9ICgpID0+IHtcbiAgICBnYW1lU3RhcnRlZCA9IHRydWU7XG4gICAgY29uc3Qgc3RhcnRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnN0YXJ0QnRuXCIpO1xuICAgIHN0YXJ0QnRuLnRleHRDb250ZW50ID0gXCJSZXN0YXJ0XCI7XG4gICAgc3RhcnRCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgICB9KTtcbiAgfTtcblxuICBjb25zdCBoYW5kbGVDZWxsQ2xpY2sgPSAoZXZlbnQsIHJlc29sdmUpID0+IHtcbiAgICBpZiAoIWdhbWVTdGFydGVkKSB7XG4gICAgICAvLyBEbyBub3RoaW5nIGlmIHRoZSBnYW1lIGhhc24ndCBzdGFydGVkXG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGNlbGwgPSBldmVudC50YXJnZXQuY2xvc2VzdChcIi5jZWxsXCIpO1xuICAgIGlmIChjZWxsKSB7XG4gICAgICBjb25zdCByb3cgPSBwYXJzZUludChjZWxsLmdldEF0dHJpYnV0ZShcInJvd1wiKSwgMTApO1xuICAgICAgY29uc3QgY29sdW1uID0gcGFyc2VJbnQoY2VsbC5nZXRBdHRyaWJ1dGUoXCJjb2x1bW5cIiksIDEwKTtcbiAgICAgIHJlc29sdmUoW3JvdywgY29sdW1uXSk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGdldFVzZXJNb3ZlID0gKCkgPT5cbiAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgY29uc3QgdXNlckJvYXJkQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi51c2VyQm9hcmRDb250YWluZXJcIik7XG5cbiAgICAgIGNvbnN0IGhhbmRsZUNsaWNrID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIGhhbmRsZUNlbGxDbGljayhldmVudCwgcmVzb2x2ZSk7XG4gICAgICB9O1xuXG4gICAgICB1c2VyQm9hcmRDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhhbmRsZUNsaWNrKTtcbiAgICB9KTtcblxuICBjb25zdCBpbml0aWFsaXplU3RhcnRCdG4gPSAoKSA9PiB7XG4gICAgY29uc3Qgc3RhcnRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnN0YXJ0QnRuXCIpO1xuICAgIHN0YXJ0QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBzdGFydEdhbWUsIHsgb25jZTogdHJ1ZSB9KTtcbiAgfTtcblxuICAvLyBGdW5jdGlvbiB0byBoYW5kbGUgY2VsbCBzdGF0ZSBjaGFuZ2VcbiAgY29uc3QgaGFuZGxlQ2VsbFVwZGF0ZSA9IChjb29yZHMsIG1pc3NlZFNob3RzLCBwbGF5ZXIpID0+IHtcbiAgICBjb25zdCBbcm93LCBjb2x1bW5dID0gY29vcmRzO1xuICAgIGxldCBjZWxsO1xuICAgIGlmIChwbGF5ZXIuZ2V0TmFtZSgpID09PSBcInVzZXJcIikge1xuICAgICAgY2VsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIGAudXNlckJvYXJkQ29udGFpbmVyIC5yb3c6bnRoLWNoaWxkKCR7cm93ICsgMX0pIC5jZWxsOm50aC1jaGlsZCgke1xuICAgICAgICAgIGNvbHVtbiArIDFcbiAgICAgICAgfSlgLFxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2VsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIGAuY29tcHV0ZXJCb2FyZENvbnRhaW5lciAucm93Om50aC1jaGlsZCgke3JvdyArIDF9KSAuY2VsbDpudGgtY2hpbGQoJHtcbiAgICAgICAgICBjb2x1bW4gKyAxXG4gICAgICAgIH0pYCxcbiAgICAgICk7XG4gICAgfVxuICAgIGNvbnN0IGlzSGl0ID0gIW1pc3NlZFNob3RzW3Jvd11bY29sdW1uXTtcblxuICAgIGNlbGwuY2xhc3NMaXN0LmFkZChpc0hpdCA/IFwiaGl0XCIgOiBcIm1pc3NlZFwiKTtcbiAgfTtcblxuICBjb25zdCBzaG93V2lubmVyID0gKHdpbm5lcikgPT4ge1xuICAgIGNvbnN0IHdpbm5lck1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi53aW5uZXJNb2RhbFwiKTtcbiAgICBjb25zdCB3aW5uZXJNZXNzYWdlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBjb25zdCByZXN0YXJ0QnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcblxuICAgIHdpbm5lck1lc3NhZ2UuY2xhc3NMaXN0LmFkZChcIndpbm5lck1lc3NhZ2VcIik7XG4gICAgcmVzdGFydEJ0bi5jbGFzc0xpc3QuYWRkKFwicmVzdGFydEJ0blwiKTtcblxuICAgIHJlc3RhcnRCdG4udGV4dENvbnRlbnQgPSBcIlJlc3RhcnRcIjtcbiAgICB3aW5uZXJNZXNzYWdlLnRleHRDb250ZW50ID0gYCR7d2lubmVyfSB3b25gO1xuXG4gICAgd2lubmVyTW9kYWwuYXBwZW5kKHdpbm5lck1lc3NhZ2UsIHJlc3RhcnRCdG4pO1xuICAgIHdpbm5lck1vZGFsLnNob3dNb2RhbCgpO1xuICAgIGluaXRpYWxpemVSZXN0YXJ0QnRuKCk7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICByZW5kZXJHYW1lQm9hcmQsXG4gICAgcmVuZGVyU2hpcHMsXG4gICAgaW5pdGlhbGl6ZVN0YXJ0QnRuLFxuICAgIGluaXRpYWxpemVSZXN0YXJ0QnRuLFxuICAgIGdldFVzZXJNb3ZlLFxuICAgIGhhbmRsZUNlbGxVcGRhdGUsXG4gICAgc2hvd1dpbm5lcixcbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IERPTWNvbnRyb2xsZXI7XG4iLCJpbXBvcnQgRE9NY29udHJvbGxlciBmcm9tIFwiLi9ET01jb250cm9sbGVyXCI7XG5pbXBvcnQgR2FtZUJvYXJkIGZyb20gXCIuL2dhbWVCb2FyZFwiO1xuaW1wb3J0IFBsYXllciBmcm9tIFwiLi9wbGF5ZXJcIjtcbi8vIGltcG9ydCBTaGlwIGZyb20gXCIuL3NoaXBcIjtcblxuY29uc3QgZ2FtZSA9ICgpID0+IHtcbiAgY29uc3QgdXNlciA9IFBsYXllcihcInVzZXJcIik7XG4gIGNvbnN0IGNvbXB1dGVyID0gUGxheWVyKFwiY29tcHV0ZXJcIik7XG4gIGNvbnN0IHVzZXJCb2FyZCA9IEdhbWVCb2FyZCgpO1xuICBjb25zdCBjb21wdXRlckJvYXJkID0gR2FtZUJvYXJkKCk7XG4gIGNvbnN0IGRvbUNvbnRyb2xsZXIgPSBET01jb250cm9sbGVyKCk7XG4gIC8vIGNvbnN0IG5ld1NoaXAgPSBTaGlwKDMpO1xuICAvLyB1c2VyQm9hcmQucGxhY2VTaGlwKDIsIDIsIG5ld1NoaXApO1xuICAvLyBjb25zdCBuZXdTaGlwMiA9IFNoaXAoMywgdHJ1ZSk7XG4gIC8vIGNvbXB1dGVyQm9hcmQucGxhY2VTaGlwKDQsIDIsIG5ld1NoaXAyKTtcblxuICBjb25zdCBjb21wdXRlckJvYXJkQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICBcIi5jb21wdXRlckJvYXJkQ29udGFpbmVyXCIsXG4gICk7XG4gIGNvbnN0IHVzZXJCb2FyZENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudXNlckJvYXJkQ29udGFpbmVyXCIpO1xuICBjb21wdXRlckJvYXJkQ29udGFpbmVyLmFwcGVuZENoaWxkKFxuICAgIGRvbUNvbnRyb2xsZXIucmVuZGVyR2FtZUJvYXJkKGNvbXB1dGVyQm9hcmQpLFxuICApO1xuICB1c2VyQm9hcmRDb250YWluZXIuYXBwZW5kQ2hpbGQoZG9tQ29udHJvbGxlci5yZW5kZXJHYW1lQm9hcmQodXNlckJvYXJkKSk7XG5cbiAgY29uc3QgcGxheVR1cm4gPSBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgdXNlckNlbGxDb29yZHMgPSBhd2FpdCBkb21Db250cm9sbGVyLmdldFVzZXJNb3ZlKCk7XG4gICAgY29uc3QgdXNlckF0dGFja1N1Y2Nlc3MgPSB1c2VyLmF0dGFjayhcbiAgICAgIHVzZXJDZWxsQ29vcmRzWzBdLFxuICAgICAgdXNlckNlbGxDb29yZHNbMV0sXG4gICAgICB1c2VyQm9hcmQsXG4gICAgKTtcblxuICAgIGlmICh1c2VyQXR0YWNrU3VjY2Vzcykge1xuICAgICAgZG9tQ29udHJvbGxlci5oYW5kbGVDZWxsVXBkYXRlKFxuICAgICAgICB1c2VyQ2VsbENvb3JkcyxcbiAgICAgICAgdXNlckJvYXJkLmdldE1pc3NlZFNob3RzKCksXG4gICAgICAgIHVzZXIsXG4gICAgICApO1xuXG4gICAgICBjb25zdCBjb21wdXRlckNlbGxDb29yZHMgPSBjb21wdXRlci5yYW5kb21BdHRhY2soY29tcHV0ZXJCb2FyZCk7XG5cbiAgICAgIGRvbUNvbnRyb2xsZXIuaGFuZGxlQ2VsbFVwZGF0ZShcbiAgICAgICAgY29tcHV0ZXJDZWxsQ29vcmRzLFxuICAgICAgICBjb21wdXRlckJvYXJkLmdldE1pc3NlZFNob3RzKCksXG4gICAgICAgIGNvbXB1dGVyLFxuICAgICAgKTtcbiAgICB9XG4gIH07XG4gIC8vIEZ1bmN0aW9uIHRvIGNoZWNrIGZvciB3aW5uZXJcbiAgY29uc3QgY2hlY2tGb3JXaW5uZXIgPSAoKSA9PiB7XG4gICAgaWYgKHVzZXJCb2FyZC5pc0FsbFNoaXBzU3VuaygpKSB7XG4gICAgICBkb21Db250cm9sbGVyLnNob3dXaW5uZXIodXNlci5nZXROYW1lKCkpO1xuICAgIH0gZWxzZSBpZiAoY29tcHV0ZXJCb2FyZC5pc0FsbFNoaXBzU3VuaygpKSB7XG4gICAgICBkb21Db250cm9sbGVyLnNob3dXaW5uZXIoY29tcHV0ZXIuZ2V0TmFtZSgpKTtcbiAgICB9XG4gIH07XG4gIC8vIEdhbWUgbG9vcFxuICBjb25zdCBnYW1lTG9vcCA9IGFzeW5jICgpID0+IHtcbiAgICAvLyBFeGl0IGNvbmRpdGlvblxuICAgIHdoaWxlICghdXNlckJvYXJkLmlzQWxsU2hpcHNTdW5rKCkgJiYgIWNvbXB1dGVyQm9hcmQuaXNBbGxTaGlwc1N1bmsoKSkge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWF3YWl0LWluLWxvb3BcbiAgICAgIGF3YWl0IHBsYXlUdXJuKCk7XG4gICAgfVxuICAgIGNoZWNrRm9yV2lubmVyKCk7XG4gIH07XG5cbiAgZG9tQ29udHJvbGxlci5pbml0aWFsaXplU3RhcnRCdG4oKTtcbiAgXG4gIHVzZXJCb2FyZC5wbGFjZVJhbmRvbVNoaXBzKCk7XG4gIGNvbXB1dGVyQm9hcmQucGxhY2VSYW5kb21TaGlwcygpO1xuICBkb21Db250cm9sbGVyLnJlbmRlclNoaXBzKGNvbXB1dGVyQm9hcmQpO1xuICBcbiAgLy8gZG9tQ29udHJvbGxlci5yZW5kZXJTaGlwcyh1c2VyQm9hcmQsIHVzZXIpO1xuICAvLyBTdGFydCB0aGUgZ2FtZSBsb29wXG4gIGdhbWVMb29wKCk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBnYW1lO1xuIiwiaW1wb3J0IFNoaXAgZnJvbSBcIi4vc2hpcFwiO1xuXG5jb25zdCBHYW1lQm9hcmQgPSAoc2l6ZSA9IDEwKSA9PiB7XG4gIGNvbnN0IGJvYXJkID0gW107XG4gIGNvbnN0IG1pc3NlZFNob3RzID0gW107XG4gIGNvbnN0IHNoaXBzID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc2l6ZTsgaSArPSAxKSB7XG4gICAgYm9hcmQucHVzaChbXSk7XG4gICAgbWlzc2VkU2hvdHMucHVzaChbXSk7XG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCBzaXplOyBqICs9IDEpIHtcbiAgICAgIGJvYXJkW2ldLnB1c2gobnVsbCk7XG4gICAgICBtaXNzZWRTaG90c1tpXS5wdXNoKGZhbHNlKTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBnZXRCb2FyZCA9ICgpID0+IGJvYXJkO1xuICBjb25zdCBnZXRNaXNzZWRTaG90cyA9ICgpID0+IG1pc3NlZFNob3RzO1xuXG4gIGNvbnN0IGlzUG9zaXRpb25PdXRPZkJvdW5kcyA9IChyb3csIGNvbHVtbikgPT5cbiAgICByb3cgPCAwIHx8IGNvbHVtbiA8IDAgfHwgcm93ID49IHNpemUgfHwgY29sdW1uID49IHNpemU7XG5cbiAgY29uc3QgaXNTaGlwRW5kT3V0T2ZCb3VuZHMgPSAocm93LCBjb2x1bW4sIHNoaXApID0+IHtcbiAgICBpZiAoc2hpcC5nZXRJc1ZlcnRpY2FsKCkpIHJldHVybiByb3cgKyBzaGlwLmdldExlbmd0aCgpID49IHNpemU7XG4gICAgcmV0dXJuIGNvbHVtbiArIHNoaXAuZ2V0TGVuZ3RoKCkgPj0gc2l6ZTtcbiAgfTtcblxuICBjb25zdCBpc1Bvc2l0aW9uVGFrZW4gPSAocm93LCBjb2x1bW4sIHNoaXApID0+IHtcbiAgICBpZiAoc2hpcC5nZXRJc1ZlcnRpY2FsKCkpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5nZXRMZW5ndGgoKTsgaSArPSAxKSB7XG4gICAgICAgIGlmIChib2FyZFtyb3cgKyBpXVtjb2x1bW5dICE9PSBudWxsKSByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmdldExlbmd0aCgpOyBpICs9IDEpIHtcbiAgICAgICAgaWYgKGJvYXJkW3Jvd11bY29sdW1uICsgaV0gIT09IG51bGwpIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgY29uc3QgaXNOZWlnaGJvclRha2VuID0gKHJvdywgY29sdW1uLCBzaGlwKSA9PiB7XG4gICAgaWYgKHNoaXAuZ2V0SXNWZXJ0aWNhbCgpKSB7XG4gICAgICBmb3IgKGxldCBpID0gcm93IC0gMTsgaSA8PSByb3cgKyBzaGlwLmdldExlbmd0aCgpOyBpICs9IDEpIHtcbiAgICAgICAgZm9yIChsZXQgaiA9IGNvbHVtbiAtIDE7IGogPD0gY29sdW1uICsgMTsgaiArPSAxKSB7XG4gICAgICAgICAgaWYgKCFpc1Bvc2l0aW9uT3V0T2ZCb3VuZHMoaSwgaikgJiYgYm9hcmRbaV1bal0pIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAobGV0IGkgPSByb3cgLSAxOyBpIDw9IHJvdyArIDE7IGkgKz0gMSkge1xuICAgICAgICBmb3IgKGxldCBqID0gY29sdW1uIC0gMTsgaiA8PSBjb2x1bW4gKyBzaGlwLmdldExlbmd0aCgpOyBqICs9IDEpIHtcbiAgICAgICAgICBpZiAoIWlzUG9zaXRpb25PdXRPZkJvdW5kcyhpLCBqKSAmJiBib2FyZFtpXVtqXSkgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIGNvbnN0IGlzVmFsaWRQb3NpdGlvbiA9IChyb3csIGNvbHVtbiwgc2hpcCkgPT4ge1xuICAgIGlmIChpc1Bvc2l0aW9uT3V0T2ZCb3VuZHMocm93LCBjb2x1bW4pKSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKGlzU2hpcEVuZE91dE9mQm91bmRzKHJvdywgY29sdW1uLCBzaGlwKSkgcmV0dXJuIGZhbHNlO1xuICAgIGlmIChpc1Bvc2l0aW9uVGFrZW4ocm93LCBjb2x1bW4sIHNoaXApKSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKGlzTmVpZ2hib3JUYWtlbihyb3csIGNvbHVtbiwgc2hpcCkpIHJldHVybiBmYWxzZTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICBjb25zdCBwbGFjZVNoaXAgPSAocm93LCBjb2x1bW4sIHNoaXApID0+IHtcbiAgICBpZiAoIWlzVmFsaWRQb3NpdGlvbihyb3csIGNvbHVtbiwgc2hpcCkpIHJldHVybiBmYWxzZTtcbiAgICBpZiAoc2hpcC5nZXRJc1ZlcnRpY2FsKCkpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5nZXRMZW5ndGgoKTsgaSArPSAxKSB7XG4gICAgICAgIGJvYXJkW3JvdyArIGldW2NvbHVtbl0gPSBzaGlwO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAuZ2V0TGVuZ3RoKCk7IGkgKz0gMSkge1xuICAgICAgICBib2FyZFtyb3ddW2NvbHVtbiArIGldID0gc2hpcDtcbiAgICAgIH1cbiAgICB9XG4gICAgc2hpcC5zZXRTdGFydENlbGwocm93LCBjb2x1bW4pO1xuICAgIHNoaXBzLnB1c2goc2hpcCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgY29uc3QgcmVtb3ZlU2hpcCA9IChyb3csIGNvbHVtbikgPT4ge1xuICAgIGNvbnN0IHNoaXAgPSBib2FyZFtyb3ddW2NvbHVtbl07XG4gICAgY29uc3Qgc3RhcnRSb3cgPSBzaGlwLmdldFN0YXJ0Q2VsbCgpWzBdO1xuICAgIGNvbnN0IHN0YXJ0Q29sdW1uID0gc2hpcC5nZXRTdGFydENlbGwoKVsxXTtcbiAgICBpZiAoc2hpcC5nZXRJc1ZlcnRpY2FsKCkpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5nZXRMZW5ndGgoKTsgaSArPSAxKSB7XG4gICAgICAgIGJvYXJkW3N0YXJ0Um93ICsgaV1bc3RhcnRDb2x1bW5dID0gbnVsbDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmdldExlbmd0aCgpOyBpICs9IDEpIHtcbiAgICAgICAgYm9hcmRbc3RhcnRSb3ddW3N0YXJ0Q29sdW1uICsgaV0gPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICBzaGlwcy5zcGxpY2Uoc2hpcHMuaW5kZXhPZihzaGlwKSwgMSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgY29uc3QgcGxhY2VSYW5kb21TaGlwcyA9ICgpID0+IHtcbiAgICBjb25zdCBzaGlwTGVuZ3RocyA9IFs1LCA0LCAzLCAzLCAyXTtcblxuICAgIHNoaXBMZW5ndGhzLmZvckVhY2goKGxlbmd0aCkgPT4ge1xuICAgICAgbGV0IGlzU2hpcFBsYWNlZCA9IGZhbHNlO1xuXG4gICAgICB3aGlsZSAoIWlzU2hpcFBsYWNlZCkge1xuICAgICAgICBjb25zdCBpc1ZlcnRpY2FsID0gTWF0aC5yYW5kb20oKSA8IDAuNTtcbiAgICAgICAgY29uc3Qgcm93ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogc2l6ZSk7XG4gICAgICAgIGNvbnN0IGNvbHVtbiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHNpemUpO1xuICAgICAgICBjb25zdCBuZXdTaGlwID0gU2hpcChsZW5ndGgsIGlzVmVydGljYWwpO1xuXG4gICAgICAgIGlmIChpc1ZhbGlkUG9zaXRpb24ocm93LCBjb2x1bW4sIG5ld1NoaXApKSB7XG4gICAgICAgICAgcGxhY2VTaGlwKHJvdywgY29sdW1uLCBuZXdTaGlwKTtcbiAgICAgICAgICBpc1NoaXBQbGFjZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgY29uc3QgcmVjaWV2ZUF0dGFjayA9IChyb3csIGNvbHVtbikgPT4ge1xuICAgIGlmIChpc1Bvc2l0aW9uT3V0T2ZCb3VuZHMocm93LCBjb2x1bW4pKSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKGJvYXJkW3Jvd11bY29sdW1uXSkge1xuICAgICAgYm9hcmRbcm93XVtjb2x1bW5dLmhpdCgpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIG1pc3NlZFNob3RzW3Jvd11bY29sdW1uXSA9IHRydWU7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIGNvbnN0IGlzQWxsU2hpcHNTdW5rID0gKCkgPT4gc2hpcHMuZXZlcnkoKHNoaXApID0+IHNoaXAuaXNTdW5rKCkgPT09IHRydWUpO1xuXG4gIHJldHVybiB7XG4gICAgZ2V0Qm9hcmQsXG4gICAgcGxhY2VTaGlwLFxuICAgIHJlbW92ZVNoaXAsXG4gICAgcGxhY2VSYW5kb21TaGlwcyxcbiAgICByZWNpZXZlQXR0YWNrLFxuICAgIGdldE1pc3NlZFNob3RzLFxuICAgIGlzQWxsU2hpcHNTdW5rLFxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgR2FtZUJvYXJkO1xuIiwiY29uc3QgUGxheWVyID0gKG5hbWUpID0+IHtcbiAgY29uc3QgaGl0UmVjb3JkID0gbmV3IFNldCgpO1xuXG4gIGNvbnN0IGhhc0FscmVheUhpdCA9IChyb3csIGNvbHVtbikgPT4gaGl0UmVjb3JkLmhhcyhgJHtyb3d9LSR7Y29sdW1ufWApO1xuXG4gIGNvbnN0IGlzSW52YWxpZFBvc2l0aW9uID0gKHJvdywgY29sdW1uLCBzaXplKSA9PlxuICAgIHJvdyA8IDAgfHwgY29sdW1uIDwgMCB8fCByb3cgPj0gc2l6ZSB8fCBjb2x1bW4gPj0gc2l6ZTtcblxuICBjb25zdCBnZXRSYW5kb21Qb3NpdGlvbiA9IChnYW1lQm9hcmQpID0+XG4gICAgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogZ2FtZUJvYXJkLmdldEJvYXJkKCkubGVuZ3RoKTtcblxuICBjb25zdCBnZXROYW1lID0gKCkgPT4gbmFtZTtcblxuICBjb25zdCBhdHRhY2sgPSAocm93LCBjb2x1bW4sIGdhbWVCb2FyZCkgPT4ge1xuICAgIGlmIChoYXNBbHJlYXlIaXQocm93LCBjb2x1bW4pKSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKCFpc0ludmFsaWRQb3NpdGlvbihyb3csIGNvbHVtbiwgZ2FtZUJvYXJkLmdldEJvYXJkKCkubGVuZ3RoKSkge1xuICAgICAgZ2FtZUJvYXJkLnJlY2lldmVBdHRhY2socm93LCBjb2x1bW4pO1xuICAgICAgaGl0UmVjb3JkLmFkZChgJHtyb3d9LSR7Y29sdW1ufWApO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICBjb25zdCByYW5kb21BdHRhY2sgPSAoZ2FtZUJvYXJkKSA9PiB7XG4gICAgaWYgKGhpdFJlY29yZC5zaXplID09PSAxMDApIHJldHVybiBmYWxzZTtcbiAgICBsZXQgcmFuZG9tUm93ID0gZ2V0UmFuZG9tUG9zaXRpb24oZ2FtZUJvYXJkKTtcbiAgICBsZXQgcmFuZG9tQ29sID0gZ2V0UmFuZG9tUG9zaXRpb24oZ2FtZUJvYXJkKTtcblxuICAgIHdoaWxlIChoYXNBbHJlYXlIaXQocmFuZG9tUm93LCByYW5kb21Db2wpKSB7XG4gICAgICByYW5kb21Sb3cgPSBnZXRSYW5kb21Qb3NpdGlvbihnYW1lQm9hcmQpO1xuICAgICAgcmFuZG9tQ29sID0gZ2V0UmFuZG9tUG9zaXRpb24oZ2FtZUJvYXJkKTtcbiAgICB9XG4gICAgZ2FtZUJvYXJkLnJlY2lldmVBdHRhY2socmFuZG9tUm93LCByYW5kb21Db2wpO1xuICAgIGhpdFJlY29yZC5hZGQoYCR7cmFuZG9tUm93fS0ke3JhbmRvbUNvbH1gKTtcbiAgICByZXR1cm4gW3JhbmRvbVJvdywgcmFuZG9tQ29sXTtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGdldE5hbWUsXG4gICAgYXR0YWNrLFxuICAgIHJhbmRvbUF0dGFjayxcbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFBsYXllcjtcbiIsImNvbnN0IFNoaXAgPSAobGVuZ3RoLCBpc1ZlcnRpY2FsID0gZmFsc2UpID0+IHtcbiAgbGV0IGhpdHMgPSAwO1xuICBsZXQgc3RhcnRSb3c7XG4gIGxldCBzdGFydENvbHVtbjtcblxuICBjb25zdCBnZXRMZW5ndGggPSAoKSA9PiBsZW5ndGg7XG4gIGNvbnN0IGdldElzVmVydGljYWwgPSAoKSA9PiBpc1ZlcnRpY2FsO1xuICBjb25zdCBnZXRIaXRzID0gKCkgPT4gaGl0cztcbiAgY29uc3QgaXNTdW5rID0gKCkgPT4gaGl0cyA9PT0gbGVuZ3RoO1xuICBjb25zdCBoaXQgPSAoKSA9PiB7XG4gICAgaWYgKGhpdHMgPCBsZW5ndGgpIGhpdHMgKz0gMTtcbiAgfTtcbiAgY29uc3QgZ2V0U3RhcnRDZWxsID0gKCkgPT4gW3N0YXJ0Um93LCBzdGFydENvbHVtbl07XG4gIGNvbnN0IHNldFN0YXJ0Q2VsbCA9IChyb3csIGNvbHVtbikgPT4ge1xuICAgIHN0YXJ0Um93ID0gcm93O1xuICAgIHN0YXJ0Q29sdW1uID0gY29sdW1uO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgZ2V0TGVuZ3RoLFxuICAgIGdldElzVmVydGljYWwsXG4gICAgZ2V0SGl0cyxcbiAgICBpc1N1bmssXG4gICAgaGl0LFxuICAgIGdldFN0YXJ0Q2VsbCxcbiAgICBzZXRTdGFydENlbGwsXG4gIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBTaGlwO1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgYCosXG4qOjpiZWZvcmUsXG4qOjphZnRlciB7XG4gIG1hcmdpbjogMDtcbiAgcGFkZGluZzogMDtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbn1cblxuaHRtbCxcbmJvZHkge1xuICBoZWlnaHQ6IDEwMCU7XG4gIHdpZHRoOiAxMDAlO1xufVxuXG4uYm9hcmRzIHtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XG59XG5cbi5ib2FyZCB7XG4gIHdpZHRoOiBtYXgtY29udGVudDtcbn1cblxuLnJvdyB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XG59XG5cbi5jZWxsIHtcbiAgd2lkdGg6IDJyZW07XG4gIGFzcGVjdC1yYXRpbzogMTtcbiAgYm9yZGVyOiAxcHggc29saWQgYmx1ZTtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xufVxuXG4uc2hpcCB7XG4gIGJhY2tncm91bmQtY29sb3I6IGdyZWVuO1xuICBib3JkZXI6IG5vbmU7XG59XG5cbi5taXNzZWQge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiBhcXVhO1xufVxuXG4uaGl0IHtcbiAgYmFja2dyb3VuZC1jb2xvcjogcmVkO1xufVxuXG4ud2lubmVyTW9kYWwge1xuICBwYWRkaW5nOiAycmVtIDVyZW07XG4gIG91dGxpbmU6IG5vbmU7XG4gIGJvcmRlcjogbm9uZTtcbiAgbWFyZ2luOiBhdXRvO1xuICBib3JkZXItcmFkaXVzOiAxcmVtO1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIGdhcDogMXJlbTtcbn1cblxuLndpbm5lck1lc3NhZ2Uge1xuICBmb250LXNpemU6IDEuNXJlbTtcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XG59XG5cbi5idXR0b25Db250YWluZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbn1cblxuLnN0YXJ0QnRuLFxuLnJlc3RhcnRCdG4ge1xuICBmb250LXNpemU6IDFyZW07XG4gIHBhZGRpbmc6IDAuNXJlbSAxLjVyZW07XG4gIGJvcmRlci1yYWRpdXM6IDFyZW07XG4gIGJvcmRlcjogbm9uZTtcbiAgb3V0bGluZTogbm9uZTtcbiAgY3Vyc29yOiBwb2ludGVyO1xufWAsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL3N0eWxlcy9zdHlsZXMuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBOzs7RUFHRSxTQUFTO0VBQ1QsVUFBVTtFQUNWLHNCQUFzQjtBQUN4Qjs7QUFFQTs7RUFFRSxZQUFZO0VBQ1osV0FBVztBQUNiOztBQUVBO0VBQ0UsYUFBYTtFQUNiLDZCQUE2QjtBQUMvQjs7QUFFQTtFQUNFLGtCQUFrQjtBQUNwQjs7QUFFQTtFQUNFLGFBQWE7RUFDYixtQkFBbUI7QUFDckI7O0FBRUE7RUFDRSxXQUFXO0VBQ1gsZUFBZTtFQUNmLHNCQUFzQjtFQUN0QixrQkFBa0I7QUFDcEI7O0FBRUE7RUFDRSx1QkFBdUI7RUFDdkIsWUFBWTtBQUNkOztBQUVBO0VBQ0Usc0JBQXNCO0FBQ3hCOztBQUVBO0VBQ0UscUJBQXFCO0FBQ3ZCOztBQUVBO0VBQ0Usa0JBQWtCO0VBQ2xCLGFBQWE7RUFDYixZQUFZO0VBQ1osWUFBWTtFQUNaLG1CQUFtQjtFQUNuQixhQUFhO0VBQ2Isc0JBQXNCO0VBQ3RCLGtCQUFrQjtFQUNsQixTQUFTO0FBQ1g7O0FBRUE7RUFDRSxpQkFBaUI7RUFDakIsaUJBQWlCO0FBQ25COztBQUVBO0VBQ0UsYUFBYTtFQUNiLHVCQUF1QjtBQUN6Qjs7QUFFQTs7RUFFRSxlQUFlO0VBQ2Ysc0JBQXNCO0VBQ3RCLG1CQUFtQjtFQUNuQixZQUFZO0VBQ1osYUFBYTtFQUNiLGVBQWU7QUFDakJcIixcInNvdXJjZXNDb250ZW50XCI6W1wiKixcXG4qOjpiZWZvcmUsXFxuKjo6YWZ0ZXIge1xcbiAgbWFyZ2luOiAwO1xcbiAgcGFkZGluZzogMDtcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxufVxcblxcbmh0bWwsXFxuYm9keSB7XFxuICBoZWlnaHQ6IDEwMCU7XFxuICB3aWR0aDogMTAwJTtcXG59XFxuXFxuLmJvYXJkcyB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1hcm91bmQ7XFxufVxcblxcbi5ib2FyZCB7XFxuICB3aWR0aDogbWF4LWNvbnRlbnQ7XFxufVxcblxcbi5yb3cge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XFxufVxcblxcbi5jZWxsIHtcXG4gIHdpZHRoOiAycmVtO1xcbiAgYXNwZWN0LXJhdGlvOiAxO1xcbiAgYm9yZGVyOiAxcHggc29saWQgYmx1ZTtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG59XFxuXFxuLnNoaXAge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogZ3JlZW47XFxuICBib3JkZXI6IG5vbmU7XFxufVxcblxcbi5taXNzZWQge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogYXF1YTtcXG59XFxuXFxuLmhpdCB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZWQ7XFxufVxcblxcbi53aW5uZXJNb2RhbCB7XFxuICBwYWRkaW5nOiAycmVtIDVyZW07XFxuICBvdXRsaW5lOiBub25lO1xcbiAgYm9yZGVyOiBub25lO1xcbiAgbWFyZ2luOiBhdXRvO1xcbiAgYm9yZGVyLXJhZGl1czogMXJlbTtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgZ2FwOiAxcmVtO1xcbn1cXG5cXG4ud2lubmVyTWVzc2FnZSB7XFxuICBmb250LXNpemU6IDEuNXJlbTtcXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xcbn1cXG5cXG4uYnV0dG9uQ29udGFpbmVyIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG59XFxuXFxuLnN0YXJ0QnRuLFxcbi5yZXN0YXJ0QnRuIHtcXG4gIGZvbnQtc2l6ZTogMXJlbTtcXG4gIHBhZGRpbmc6IDAuNXJlbSAxLjVyZW07XFxuICBib3JkZXItcmFkaXVzOiAxcmVtO1xcbiAgYm9yZGVyOiBub25lO1xcbiAgb3V0bGluZTogbm9uZTtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG59XCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xuICB2YXIgbGlzdCA9IFtdO1xuXG4gIC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBpdGVtWzVdICE9PSBcInVuZGVmaW5lZFwiO1xuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KS5qb2luKFwiXCIpO1xuICB9O1xuXG4gIC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG4gIGxpc3QuaSA9IGZ1bmN0aW9uIGkobW9kdWxlcywgbWVkaWEsIGRlZHVwZSwgc3VwcG9ydHMsIGxheWVyKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcbiAgICB9XG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRoaXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIGlkID0gdGhpc1trXVswXTtcbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG4gICAgICBpZiAoZGVkdXBlICYmIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGxheWVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVs1XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzdXBwb3J0cykge1xuICAgICAgICBpZiAoIWl0ZW1bNF0pIHtcbiAgICAgICAgICBpdGVtWzRdID0gXCJcIi5jb25jYXQoc3VwcG9ydHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs0XSA9IHN1cHBvcnRzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGNvbnRlbnQgPSBpdGVtWzFdO1xuICB2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG4gIGlmICghY3NzTWFwcGluZykge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG4gIGlmICh0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGNzc01hcHBpbmcpKSkpO1xuICAgIHZhciBkYXRhID0gXCJzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIi5jb25jYXQoYmFzZTY0KTtcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IFwiLyojIFwiLmNvbmNhdChkYXRhLCBcIiAqL1wiKTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oXCJcXG5cIik7XG4gIH1cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xufTsiLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGVzLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGVzLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3R5bGVzSW5ET00gPSBbXTtcbmZ1bmN0aW9uIGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpIHtcbiAgdmFyIHJlc3VsdCA9IC0xO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlc0luRE9NLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN0eWxlc0luRE9NW2ldLmlkZW50aWZpZXIgPT09IGlkZW50aWZpZXIpIHtcbiAgICAgIHJlc3VsdCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKSB7XG4gIHZhciBpZENvdW50TWFwID0ge307XG4gIHZhciBpZGVudGlmaWVycyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV07XG4gICAgdmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG4gICAgdmFyIGNvdW50ID0gaWRDb3VudE1hcFtpZF0gfHwgMDtcbiAgICB2YXIgaWRlbnRpZmllciA9IFwiXCIuY29uY2F0KGlkLCBcIiBcIikuY29uY2F0KGNvdW50KTtcbiAgICBpZENvdW50TWFwW2lkXSA9IGNvdW50ICsgMTtcbiAgICB2YXIgaW5kZXhCeUlkZW50aWZpZXIgPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICB2YXIgb2JqID0ge1xuICAgICAgY3NzOiBpdGVtWzFdLFxuICAgICAgbWVkaWE6IGl0ZW1bMl0sXG4gICAgICBzb3VyY2VNYXA6IGl0ZW1bM10sXG4gICAgICBzdXBwb3J0czogaXRlbVs0XSxcbiAgICAgIGxheWVyOiBpdGVtWzVdXG4gICAgfTtcbiAgICBpZiAoaW5kZXhCeUlkZW50aWZpZXIgIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHVwZGF0ZXIgPSBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKTtcbiAgICAgIG9wdGlvbnMuYnlJbmRleCA9IGk7XG4gICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoaSwgMCwge1xuICAgICAgICBpZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuICAgICAgICB1cGRhdGVyOiB1cGRhdGVyLFxuICAgICAgICByZWZlcmVuY2VzOiAxXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgfVxuICByZXR1cm4gaWRlbnRpZmllcnM7XG59XG5mdW5jdGlvbiBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKSB7XG4gIHZhciBhcGkgPSBvcHRpb25zLmRvbUFQSShvcHRpb25zKTtcbiAgYXBpLnVwZGF0ZShvYmopO1xuICB2YXIgdXBkYXRlciA9IGZ1bmN0aW9uIHVwZGF0ZXIobmV3T2JqKSB7XG4gICAgaWYgKG5ld09iaikge1xuICAgICAgaWYgKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcCAmJiBuZXdPYmouc3VwcG9ydHMgPT09IG9iai5zdXBwb3J0cyAmJiBuZXdPYmoubGF5ZXIgPT09IG9iai5sYXllcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBhcGkudXBkYXRlKG9iaiA9IG5ld09iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwaS5yZW1vdmUoKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiB1cGRhdGVyO1xufVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGlzdCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgbGlzdCA9IGxpc3QgfHwgW107XG4gIHZhciBsYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucyk7XG4gIHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuICAgIG5ld0xpc3QgPSBuZXdMaXN0IHx8IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tpXTtcbiAgICAgIHZhciBpbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhdLnJlZmVyZW5jZXMtLTtcbiAgICB9XG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIF9pZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW19pXTtcbiAgICAgIHZhciBfaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihfaWRlbnRpZmllcik7XG4gICAgICBpZiAoc3R5bGVzSW5ET01bX2luZGV4XS5yZWZlcmVuY2VzID09PSAwKSB7XG4gICAgICAgIHN0eWxlc0luRE9NW19pbmRleF0udXBkYXRlcigpO1xuICAgICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoX2luZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGFzdElkZW50aWZpZXJzID0gbmV3TGFzdElkZW50aWZpZXJzO1xuICB9O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIG1lbW8gPSB7fTtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBnZXRUYXJnZXQodGFyZ2V0KSB7XG4gIGlmICh0eXBlb2YgbWVtb1t0YXJnZXRdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgdmFyIHN0eWxlVGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xuXG4gICAgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcbiAgICBpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuICAgICAgICAvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuICAgICAgICBzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICBzdHlsZVRhcmdldCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIG1lbW9bdGFyZ2V0XSA9IHN0eWxlVGFyZ2V0O1xuICB9XG4gIHJldHVybiBtZW1vW3RhcmdldF07XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0QnlTZWxlY3RvcihpbnNlcnQsIHN0eWxlKSB7XG4gIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQoaW5zZXJ0KTtcbiAgaWYgKCF0YXJnZXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydCcgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuICB9XG4gIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydEJ5U2VsZWN0b3I7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gIG9wdGlvbnMuc2V0QXR0cmlidXRlcyhlbGVtZW50LCBvcHRpb25zLmF0dHJpYnV0ZXMpO1xuICBvcHRpb25zLmluc2VydChlbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xuICByZXR1cm4gZWxlbWVudDtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0U3R5bGVFbGVtZW50OyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcyhzdHlsZUVsZW1lbnQpIHtcbiAgdmFyIG5vbmNlID0gdHlwZW9mIF9fd2VicGFja19ub25jZV9fICE9PSBcInVuZGVmaW5lZFwiID8gX193ZWJwYWNrX25vbmNlX18gOiBudWxsO1xuICBpZiAobm9uY2UpIHtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgbm9uY2UpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlczsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaikge1xuICB2YXIgY3NzID0gXCJcIjtcbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KG9iai5zdXBwb3J0cywgXCIpIHtcIik7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpO1xuICB9XG4gIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2Ygb2JqLmxheWVyICE9PSBcInVuZGVmaW5lZFwiO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwiQGxheWVyXCIuY29uY2F0KG9iai5sYXllci5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KG9iai5sYXllcikgOiBcIlwiLCBcIiB7XCIpO1xuICB9XG4gIGNzcyArPSBvYmouY3NzO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICB2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcbiAgaWYgKHNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIuY29uY2F0KGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSksIFwiICovXCIpO1xuICB9XG5cbiAgLy8gRm9yIG9sZCBJRVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgICovXG4gIG9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG59XG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XG4gIC8vIGlzdGFuYnVsIGlnbm9yZSBpZlxuICBpZiAoc3R5bGVFbGVtZW50LnBhcmVudE5vZGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBkb21BUEkob3B0aW9ucykge1xuICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKCkge30sXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgfTtcbiAgfVxuICB2YXIgc3R5bGVFbGVtZW50ID0gb3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG4gIHJldHVybiB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUob2JqKSB7XG4gICAgICBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaik7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuICAgIH1cbiAgfTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZG9tQVBJOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50KSB7XG4gIGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XG4gICAgICBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgIH1cbiAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc3R5bGVUYWdUcmFuc2Zvcm07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubmMgPSB1bmRlZmluZWQ7IiwiaW1wb3J0IFwiLi9zdHlsZXMvc3R5bGVzLmNzc1wiO1xuaW1wb3J0IGdhbWUgZnJvbSBcIi4vbW9kdWxlcy9nYW1lXCI7XG5cbmdhbWUoKTsiXSwibmFtZXMiOlsiRE9NY29udHJvbGxlciIsImNyZWF0ZUNlbGwiLCJyb3dJbmRleCIsImNvbHVtbkluZGV4IiwiY2VsbCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTGlzdCIsImFkZCIsInNldEF0dHJpYnV0ZSIsImNyZWF0ZVJvdyIsInJvd0FycmF5Iiwicm93IiwiZm9yRWFjaCIsIl8iLCJjb2x1bW4iLCJhcHBlbmRDaGlsZCIsInJlbmRlckdhbWVCb2FyZCIsImdhbWVCb2FyZCIsImJvYXJkQXJyYXkiLCJnZXRCb2FyZCIsImJvYXJkIiwicmVuZGVyU2hpcHMiLCJib2FyZENvbnRhaW5lciIsInF1ZXJ5U2VsZWN0b3IiLCJjZWxsVmFsdWUiLCJpbml0aWFsaXplUmVzdGFydEJ0biIsInJlc3RhcnRCdG4iLCJhZGRFdmVudExpc3RlbmVyIiwid2luZG93IiwibG9jYXRpb24iLCJyZWxvYWQiLCJnYW1lU3RhcnRlZCIsInN0YXJ0R2FtZSIsInN0YXJ0QnRuIiwidGV4dENvbnRlbnQiLCJoYW5kbGVDZWxsQ2xpY2siLCJldmVudCIsInJlc29sdmUiLCJ0YXJnZXQiLCJjbG9zZXN0IiwicGFyc2VJbnQiLCJnZXRBdHRyaWJ1dGUiLCJnZXRVc2VyTW92ZSIsIlByb21pc2UiLCJ1c2VyQm9hcmRDb250YWluZXIiLCJoYW5kbGVDbGljayIsImluaXRpYWxpemVTdGFydEJ0biIsIm9uY2UiLCJoYW5kbGVDZWxsVXBkYXRlIiwiY29vcmRzIiwibWlzc2VkU2hvdHMiLCJwbGF5ZXIiLCJnZXROYW1lIiwiaXNIaXQiLCJzaG93V2lubmVyIiwid2lubmVyIiwid2lubmVyTW9kYWwiLCJ3aW5uZXJNZXNzYWdlIiwiYXBwZW5kIiwic2hvd01vZGFsIiwiR2FtZUJvYXJkIiwiUGxheWVyIiwiZ2FtZSIsInVzZXIiLCJjb21wdXRlciIsInVzZXJCb2FyZCIsImNvbXB1dGVyQm9hcmQiLCJkb21Db250cm9sbGVyIiwiY29tcHV0ZXJCb2FyZENvbnRhaW5lciIsInBsYXlUdXJuIiwidXNlckNlbGxDb29yZHMiLCJ1c2VyQXR0YWNrU3VjY2VzcyIsImF0dGFjayIsImdldE1pc3NlZFNob3RzIiwiY29tcHV0ZXJDZWxsQ29vcmRzIiwicmFuZG9tQXR0YWNrIiwiY2hlY2tGb3JXaW5uZXIiLCJpc0FsbFNoaXBzU3VuayIsImdhbWVMb29wIiwicGxhY2VSYW5kb21TaGlwcyIsIlNoaXAiLCJzaXplIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwidW5kZWZpbmVkIiwic2hpcHMiLCJpIiwicHVzaCIsImoiLCJpc1Bvc2l0aW9uT3V0T2ZCb3VuZHMiLCJpc1NoaXBFbmRPdXRPZkJvdW5kcyIsInNoaXAiLCJnZXRJc1ZlcnRpY2FsIiwiZ2V0TGVuZ3RoIiwiaXNQb3NpdGlvblRha2VuIiwiaXNOZWlnaGJvclRha2VuIiwiaXNWYWxpZFBvc2l0aW9uIiwicGxhY2VTaGlwIiwic2V0U3RhcnRDZWxsIiwicmVtb3ZlU2hpcCIsInN0YXJ0Um93IiwiZ2V0U3RhcnRDZWxsIiwic3RhcnRDb2x1bW4iLCJzcGxpY2UiLCJpbmRleE9mIiwic2hpcExlbmd0aHMiLCJpc1NoaXBQbGFjZWQiLCJpc1ZlcnRpY2FsIiwiTWF0aCIsInJhbmRvbSIsImZsb29yIiwibmV3U2hpcCIsInJlY2lldmVBdHRhY2siLCJoaXQiLCJldmVyeSIsImlzU3VuayIsIm5hbWUiLCJoaXRSZWNvcmQiLCJTZXQiLCJoYXNBbHJlYXlIaXQiLCJoYXMiLCJpc0ludmFsaWRQb3NpdGlvbiIsImdldFJhbmRvbVBvc2l0aW9uIiwicmFuZG9tUm93IiwicmFuZG9tQ29sIiwiaGl0cyIsImdldEhpdHMiXSwic291cmNlUm9vdCI6IiJ9