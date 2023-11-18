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

  // Function to get user move
  const getUserMove = () => new Promise(resolve => {
    const userBoardContainer = document.querySelector(".userBoardContainer");
    const handleClick = event => {
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
      cell = document.querySelector(`.userBoardContainer .row:nth-child(${row + 1}) .cell:nth-child(${column + 1})`);
    } else {
      cell = document.querySelector(`.computerBoardContainer .row:nth-child(${row + 1}) .cell:nth-child(${column + 1})`);
    }
    const isHit = !missedShots[row][column];
    cell.classList.add(isHit ? "hit" : "missed");
  };
  const showWinner = winner => {
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
    }
    const computerCellCoords = computer.randomAttack(computerBoard);
    domController.handleCellUpdate(computerCellCoords, computerBoard.getMissedShots(), computer);
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
  domController.initializeRestartBtn();
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

.winnerModal .restartBtn {
  font-size: 1rem;
  padding: 0.5rem 1.5rem;
  border-radius: 1rem;
  border: none;
  outline: none;
  cursor: pointer;
}`, "",{"version":3,"sources":["webpack://./src/styles/styles.css"],"names":[],"mappings":"AAAA;;;EAGE,SAAS;EACT,UAAU;EACV,sBAAsB;AACxB;;AAEA;;EAEE,YAAY;EACZ,WAAW;AACb;;AAEA;EACE,aAAa;EACb,6BAA6B;AAC/B;;AAEA;EACE,kBAAkB;AACpB;;AAEA;EACE,aAAa;EACb,mBAAmB;AACrB;;AAEA;EACE,WAAW;EACX,eAAe;EACf,sBAAsB;EACtB,kBAAkB;AACpB;;AAEA;EACE,uBAAuB;AACzB;;AAEA;EACE,sBAAsB;AACxB;;AAEA;EACE,qBAAqB;AACvB;;AAEA;EACE,kBAAkB;EAClB,aAAa;EACb,YAAY;EACZ,YAAY;EACZ,mBAAmB;EACnB,aAAa;EACb,sBAAsB;EACtB,kBAAkB;EAClB,SAAS;AACX;;AAEA;EACE,iBAAiB;EACjB,iBAAiB;AACnB;;AAEA;EACE,eAAe;EACf,sBAAsB;EACtB,mBAAmB;EACnB,YAAY;EACZ,aAAa;EACb,eAAe;AACjB","sourcesContent":["*,\n*::before,\n*::after {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\nhtml,\nbody {\n  height: 100%;\n  width: 100%;\n}\n\n.boards {\n  display: flex;\n  justify-content: space-around;\n}\n\n.board {\n  width: max-content;\n}\n\n.row {\n  display: flex;\n  flex-direction: row;\n}\n\n.cell {\n  width: 2rem;\n  aspect-ratio: 1;\n  border: 1px solid blue;\n  text-align: center;\n}\n\n.ship {\n  background-color: green;\n}\n\n.missed {\n  background-color: aqua;\n}\n\n.hit {\n  background-color: red;\n}\n\n.winnerModal {\n  padding: 2rem 5rem;\n  outline: none;\n  border: none;\n  margin: auto;\n  border-radius: 1rem;\n  display: flex;\n  flex-direction: column;\n  text-align: center;\n  gap: 1rem;\n}\n\n.winnerMessage {\n  font-size: 1.5rem;\n  font-weight: bold;\n}\n\n.winnerModal .restartBtn {\n  font-size: 1rem;\n  padding: 0.5rem 1.5rem;\n  border-radius: 1rem;\n  border: none;\n  outline: none;\n  cursor: pointer;\n}"],"sourceRoot":""}]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1dDTkE7Ozs7Ozs7Ozs7Ozs7QUNBNkI7QUFDSztBQUVsQ2xCLHlEQUFJLENBQUMsQ0FBQyxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcHMvLi9zcmMvbW9kdWxlcy9ET01jb250cm9sbGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXBzLy4vc3JjL21vZHVsZXMvZ2FtZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy8uL3NyYy9tb2R1bGVzL2dhbWVCb2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy8uL3NyYy9tb2R1bGVzL3BsYXllci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy8uL3NyYy9tb2R1bGVzL3NoaXAuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcHMvLi9zcmMvc3R5bGVzL3N0eWxlcy5jc3MiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcHMvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXBzLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcHMvLi9zcmMvc3R5bGVzL3N0eWxlcy5jc3M/ZTQ1YiIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcHMvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcHMvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcHMvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXBzL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2JhdHRsZXNoaXBzL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL2JhdHRsZXNoaXBzL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JhdHRsZXNoaXBzL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcHMvd2VicGFjay9ydW50aW1lL25vbmNlIiwid2VicGFjazovL2JhdHRsZXNoaXBzLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnN0IERPTWNvbnRyb2xsZXIgPSAoKSA9PiB7XG4gIC8vIEZ1bmN0aW9uIHRvIGNyZWF0ZSBhIHNpbmdsZSBjZWxsXG4gIGNvbnN0IGNyZWF0ZUNlbGwgPSAocm93SW5kZXgsIGNvbHVtbkluZGV4KSA9PiB7XG4gICAgY29uc3QgY2VsbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwiY2VsbFwiKTtcbiAgICBjZWxsLnNldEF0dHJpYnV0ZShcInJvd1wiLCByb3dJbmRleCk7XG4gICAgY2VsbC5zZXRBdHRyaWJ1dGUoXCJjb2x1bW5cIiwgY29sdW1uSW5kZXgpO1xuICAgIHJldHVybiBjZWxsO1xuICB9O1xuXG4gIC8vIEZ1bmN0aW9uIHRvIGNyZWF0ZSBhIHNpbmdsZSByb3dcbiAgY29uc3QgY3JlYXRlUm93ID0gKHJvd0FycmF5LCByb3dJbmRleCkgPT4ge1xuICAgIGNvbnN0IHJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgcm93LmNsYXNzTGlzdC5hZGQoXCJyb3dcIik7XG4gICAgcm93QXJyYXkuZm9yRWFjaCgoXywgY29sdW1uKSA9PiB7XG4gICAgICBjb25zdCBjZWxsID0gY3JlYXRlQ2VsbChyb3dJbmRleCwgY29sdW1uKTtcbiAgICAgIHJvdy5hcHBlbmRDaGlsZChjZWxsKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcm93O1xuICB9O1xuXG4gIC8vIEZ1bmN0aW9uIHRvIHJlbmRlciB0aGUgZ2FtZSBib2FyZFxuICBjb25zdCByZW5kZXJHYW1lQm9hcmQgPSAoZ2FtZUJvYXJkKSA9PiB7XG4gICAgY29uc3QgYm9hcmRBcnJheSA9IGdhbWVCb2FyZC5nZXRCb2FyZCgpO1xuICAgIGNvbnN0IGJvYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBib2FyZC5jbGFzc0xpc3QuYWRkKFwiYm9hcmRcIik7XG5cbiAgICBib2FyZEFycmF5LmZvckVhY2goKHJvd0FycmF5LCByb3dJbmRleCkgPT4ge1xuICAgICAgY29uc3Qgcm93ID0gY3JlYXRlUm93KHJvd0FycmF5LCByb3dJbmRleCk7XG4gICAgICBib2FyZC5hcHBlbmRDaGlsZChyb3cpO1xuICAgIH0pO1xuICAgIHJldHVybiBib2FyZDtcbiAgfTtcblxuICBjb25zdCByZW5kZXJTaGlwcyA9IChnYW1lQm9hcmQpID0+IHtcbiAgICBjb25zdCBib2FyZEFycmF5ID0gZ2FtZUJvYXJkLmdldEJvYXJkKCk7XG4gICAgLy8gY29uc3QgYm9hcmRDb250YWluZXIgPVxuICAgIC8vICAgcGxheWVyLmdldE5hbWUoKSA9PT0gXCJ1c2VyXCJcbiAgICAvLyAgICAgPyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLnVzZXJCb2FyZENvbnRhaW5lclwiKVxuICAgIC8vICAgICA6IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY29tcHV0ZXJCb2FyZENvbnRhaW5lclwiKTtcbiAgICBjb25zdCBib2FyZENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIuY29tcHV0ZXJCb2FyZENvbnRhaW5lclwiKTtcbiAgICBib2FyZEFycmF5LmZvckVhY2goKHJvd0FycmF5LCByb3dJbmRleCkgPT4ge1xuICAgICAgcm93QXJyYXkuZm9yRWFjaCgoY2VsbFZhbHVlLCBjb2x1bW5JbmRleCkgPT4ge1xuICAgICAgICBjb25zdCBjZWxsID0gYm9hcmRDb250YWluZXIucXVlcnlTZWxlY3RvcihcbiAgICAgICAgICBgLnJvdzpudGgtY2hpbGQoJHtyb3dJbmRleCArIDF9KSAuY2VsbDpudGgtY2hpbGQoJHtjb2x1bW5JbmRleCArIDF9KWAsXG4gICAgICAgICk7XG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgdGhlcmUgaXMgYSBzaGlwIGF0IHRoaXMgY2VsbFxuICAgICAgICBpZiAoY2VsbFZhbHVlKSB7XG4gICAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwic2hpcFwiKTsgLy8gQWRkIGEgY2xhc3MgdG8gaW5kaWNhdGUgYSBzaGlwIGF0IHRoaXMgY2VsbFxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcblxuICBjb25zdCBpbml0aWFsaXplUmVzdGFydEJ0biA9ICgpID0+IHtcbiAgICBjb25zdCByZXN0YXJ0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5yZXN0YXJ0QnRuXCIpO1xuICAgIHJlc3RhcnRCdG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBGdW5jdGlvbiB0byBnZXQgdXNlciBtb3ZlXG4gIGNvbnN0IGdldFVzZXJNb3ZlID0gKCkgPT5cbiAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgY29uc3QgdXNlckJvYXJkQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi51c2VyQm9hcmRDb250YWluZXJcIik7XG5cbiAgICAgIGNvbnN0IGhhbmRsZUNsaWNrID0gKGV2ZW50KSA9PiB7XG4gICAgICAgIGNvbnN0IGNlbGwgPSBldmVudC50YXJnZXQuY2xvc2VzdChcIi5jZWxsXCIpO1xuICAgICAgICBpZiAoY2VsbCkge1xuICAgICAgICAgIGNvbnN0IHJvdyA9IHBhcnNlSW50KGNlbGwuZ2V0QXR0cmlidXRlKFwicm93XCIpLCAxMCk7XG4gICAgICAgICAgY29uc3QgY29sdW1uID0gcGFyc2VJbnQoY2VsbC5nZXRBdHRyaWJ1dGUoXCJjb2x1bW5cIiksIDEwKTtcbiAgICAgICAgICB1c2VyQm9hcmRDb250YWluZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhhbmRsZUNsaWNrKTtcbiAgICAgICAgICByZXNvbHZlKFtyb3csIGNvbHVtbl0pO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICB1c2VyQm9hcmRDb250YWluZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhhbmRsZUNsaWNrKTtcbiAgICB9KTtcblxuICAvLyBGdW5jdGlvbiB0byBoYW5kbGUgY2VsbCBzdGF0ZSBjaGFuZ2VcbiAgY29uc3QgaGFuZGxlQ2VsbFVwZGF0ZSA9IChjb29yZHMsIG1pc3NlZFNob3RzLCBwbGF5ZXIpID0+IHtcbiAgICBjb25zdCBbcm93LCBjb2x1bW5dID0gY29vcmRzO1xuICAgIGxldCBjZWxsO1xuICAgIGlmIChwbGF5ZXIuZ2V0TmFtZSgpID09PSBcInVzZXJcIikge1xuICAgICAgY2VsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIGAudXNlckJvYXJkQ29udGFpbmVyIC5yb3c6bnRoLWNoaWxkKCR7cm93ICsgMX0pIC5jZWxsOm50aC1jaGlsZCgke1xuICAgICAgICAgIGNvbHVtbiArIDFcbiAgICAgICAgfSlgLFxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2VsbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgIGAuY29tcHV0ZXJCb2FyZENvbnRhaW5lciAucm93Om50aC1jaGlsZCgke3JvdyArIDF9KSAuY2VsbDpudGgtY2hpbGQoJHtcbiAgICAgICAgICBjb2x1bW4gKyAxXG4gICAgICAgIH0pYCxcbiAgICAgICk7XG4gICAgfVxuICAgIGNvbnN0IGlzSGl0ID0gIW1pc3NlZFNob3RzW3Jvd11bY29sdW1uXTtcblxuICAgIGNlbGwuY2xhc3NMaXN0LmFkZChpc0hpdCA/IFwiaGl0XCIgOiBcIm1pc3NlZFwiKTtcbiAgfTtcblxuICBjb25zdCBzaG93V2lubmVyID0gKHdpbm5lcikgPT4ge1xuICAgIGNvbnN0IHdpbm5lck1vZGFsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi53aW5uZXJNb2RhbFwiKTtcbiAgICBjb25zdCB3aW5uZXJNZXNzYWdlID0gd2lubmVyTW9kYWwucXVlcnlTZWxlY3RvcihcIi53aW5uZXJNZXNzYWdlXCIpO1xuICAgIHdpbm5lck1lc3NhZ2UudGV4dENvbnRlbnQgPSBgJHt3aW5uZXJ9IHdvbmA7XG4gICAgd2lubmVyTW9kYWwuc2hvd01vZGFsKCk7XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICByZW5kZXJHYW1lQm9hcmQsXG4gICAgcmVuZGVyU2hpcHMsXG4gICAgaW5pdGlhbGl6ZVJlc3RhcnRCdG4sXG4gICAgZ2V0VXNlck1vdmUsXG4gICAgaGFuZGxlQ2VsbFVwZGF0ZSxcbiAgICBzaG93V2lubmVyLFxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgRE9NY29udHJvbGxlcjtcbiIsImltcG9ydCBET01jb250cm9sbGVyIGZyb20gXCIuL0RPTWNvbnRyb2xsZXJcIjtcbmltcG9ydCBHYW1lQm9hcmQgZnJvbSBcIi4vZ2FtZUJvYXJkXCI7XG5pbXBvcnQgUGxheWVyIGZyb20gXCIuL3BsYXllclwiO1xuLy8gaW1wb3J0IFNoaXAgZnJvbSBcIi4vc2hpcFwiO1xuXG5jb25zdCBnYW1lID0gKCkgPT4ge1xuICBjb25zdCB1c2VyID0gUGxheWVyKFwidXNlclwiKTtcbiAgY29uc3QgY29tcHV0ZXIgPSBQbGF5ZXIoXCJjb21wdXRlclwiKTtcbiAgY29uc3QgdXNlckJvYXJkID0gR2FtZUJvYXJkKCk7XG4gIGNvbnN0IGNvbXB1dGVyQm9hcmQgPSBHYW1lQm9hcmQoKTtcbiAgY29uc3QgZG9tQ29udHJvbGxlciA9IERPTWNvbnRyb2xsZXIoKTtcbiAgLy8gY29uc3QgbmV3U2hpcCA9IFNoaXAoMyk7XG4gIC8vIHVzZXJCb2FyZC5wbGFjZVNoaXAoMiwgMiwgbmV3U2hpcCk7XG4gIC8vIGNvbnN0IG5ld1NoaXAyID0gU2hpcCgzLCB0cnVlKTtcbiAgLy8gY29tcHV0ZXJCb2FyZC5wbGFjZVNoaXAoNCwgMiwgbmV3U2hpcDIpO1xuXG4gIGNvbnN0IGNvbXB1dGVyQm9hcmRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgIFwiLmNvbXB1dGVyQm9hcmRDb250YWluZXJcIixcbiAgKTtcbiAgY29uc3QgdXNlckJvYXJkQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi51c2VyQm9hcmRDb250YWluZXJcIik7XG4gIGNvbXB1dGVyQm9hcmRDb250YWluZXIuYXBwZW5kQ2hpbGQoXG4gICAgZG9tQ29udHJvbGxlci5yZW5kZXJHYW1lQm9hcmQoY29tcHV0ZXJCb2FyZCksXG4gICk7XG4gIHVzZXJCb2FyZENvbnRhaW5lci5hcHBlbmRDaGlsZChkb21Db250cm9sbGVyLnJlbmRlckdhbWVCb2FyZCh1c2VyQm9hcmQpKTtcblxuICBjb25zdCBwbGF5VHVybiA9IGFzeW5jICgpID0+IHtcbiAgICBjb25zdCB1c2VyQ2VsbENvb3JkcyA9IGF3YWl0IGRvbUNvbnRyb2xsZXIuZ2V0VXNlck1vdmUoKTtcbiAgICBjb25zdCB1c2VyQXR0YWNrU3VjY2VzcyA9IHVzZXIuYXR0YWNrKFxuICAgICAgdXNlckNlbGxDb29yZHNbMF0sXG4gICAgICB1c2VyQ2VsbENvb3Jkc1sxXSxcbiAgICAgIHVzZXJCb2FyZCxcbiAgICApO1xuXG4gICAgaWYgKHVzZXJBdHRhY2tTdWNjZXNzKSB7XG4gICAgICBkb21Db250cm9sbGVyLmhhbmRsZUNlbGxVcGRhdGUoXG4gICAgICAgIHVzZXJDZWxsQ29vcmRzLFxuICAgICAgICB1c2VyQm9hcmQuZ2V0TWlzc2VkU2hvdHMoKSxcbiAgICAgICAgdXNlcixcbiAgICAgICk7XG4gICAgfVxuXG4gICAgY29uc3QgY29tcHV0ZXJDZWxsQ29vcmRzID0gY29tcHV0ZXIucmFuZG9tQXR0YWNrKGNvbXB1dGVyQm9hcmQpO1xuXG4gICAgZG9tQ29udHJvbGxlci5oYW5kbGVDZWxsVXBkYXRlKFxuICAgICAgY29tcHV0ZXJDZWxsQ29vcmRzLFxuICAgICAgY29tcHV0ZXJCb2FyZC5nZXRNaXNzZWRTaG90cygpLFxuICAgICAgY29tcHV0ZXIsXG4gICAgKTtcbiAgfTtcbiAgLy8gRnVuY3Rpb24gdG8gY2hlY2sgZm9yIHdpbm5lclxuICBjb25zdCBjaGVja0Zvcldpbm5lciA9ICgpID0+IHtcbiAgICBpZiAodXNlckJvYXJkLmlzQWxsU2hpcHNTdW5rKCkpIHtcbiAgICAgIGRvbUNvbnRyb2xsZXIuc2hvd1dpbm5lcih1c2VyLmdldE5hbWUoKSk7XG4gICAgfSBlbHNlIGlmIChjb21wdXRlckJvYXJkLmlzQWxsU2hpcHNTdW5rKCkpIHtcbiAgICAgIGRvbUNvbnRyb2xsZXIuc2hvd1dpbm5lcihjb21wdXRlci5nZXROYW1lKCkpO1xuICAgIH1cbiAgfTtcbiAgLy8gR2FtZSBsb29wXG4gIGNvbnN0IGdhbWVMb29wID0gYXN5bmMgKCkgPT4ge1xuICAgIC8vIEV4aXQgY29uZGl0aW9uXG4gICAgd2hpbGUgKCF1c2VyQm9hcmQuaXNBbGxTaGlwc1N1bmsoKSAmJiAhY29tcHV0ZXJCb2FyZC5pc0FsbFNoaXBzU3VuaygpKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tYXdhaXQtaW4tbG9vcFxuICAgICAgYXdhaXQgcGxheVR1cm4oKTtcbiAgICB9XG4gICAgY2hlY2tGb3JXaW5uZXIoKTtcbiAgfTtcblxuICBkb21Db250cm9sbGVyLmluaXRpYWxpemVSZXN0YXJ0QnRuKCk7XG5cbiAgdXNlckJvYXJkLnBsYWNlUmFuZG9tU2hpcHMoKTtcbiAgY29tcHV0ZXJCb2FyZC5wbGFjZVJhbmRvbVNoaXBzKCk7XG4gIGRvbUNvbnRyb2xsZXIucmVuZGVyU2hpcHMoY29tcHV0ZXJCb2FyZCk7XG4gIC8vIGRvbUNvbnRyb2xsZXIucmVuZGVyU2hpcHModXNlckJvYXJkLCB1c2VyKTtcbiAgLy8gU3RhcnQgdGhlIGdhbWUgbG9vcFxuICBnYW1lTG9vcCgpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2FtZTtcbiIsImltcG9ydCBTaGlwIGZyb20gXCIuL3NoaXBcIjtcblxuY29uc3QgR2FtZUJvYXJkID0gKHNpemUgPSAxMCkgPT4ge1xuICBjb25zdCBib2FyZCA9IFtdO1xuICBjb25zdCBtaXNzZWRTaG90cyA9IFtdO1xuICBjb25zdCBzaGlwcyA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IHNpemU7IGkgKz0gMSkge1xuICAgIGJvYXJkLnB1c2goW10pO1xuICAgIG1pc3NlZFNob3RzLnB1c2goW10pO1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgc2l6ZTsgaiArPSAxKSB7XG4gICAgICBib2FyZFtpXS5wdXNoKG51bGwpO1xuICAgICAgbWlzc2VkU2hvdHNbaV0ucHVzaChmYWxzZSk7XG4gICAgfVxuICB9XG5cbiAgY29uc3QgZ2V0Qm9hcmQgPSAoKSA9PiBib2FyZDtcbiAgY29uc3QgZ2V0TWlzc2VkU2hvdHMgPSAoKSA9PiBtaXNzZWRTaG90cztcblxuICBjb25zdCBpc1Bvc2l0aW9uT3V0T2ZCb3VuZHMgPSAocm93LCBjb2x1bW4pID0+XG4gICAgcm93IDwgMCB8fCBjb2x1bW4gPCAwIHx8IHJvdyA+PSBzaXplIHx8IGNvbHVtbiA+PSBzaXplO1xuXG4gIGNvbnN0IGlzU2hpcEVuZE91dE9mQm91bmRzID0gKHJvdywgY29sdW1uLCBzaGlwKSA9PiB7XG4gICAgaWYgKHNoaXAuZ2V0SXNWZXJ0aWNhbCgpKSByZXR1cm4gcm93ICsgc2hpcC5nZXRMZW5ndGgoKSA+PSBzaXplO1xuICAgIHJldHVybiBjb2x1bW4gKyBzaGlwLmdldExlbmd0aCgpID49IHNpemU7XG4gIH07XG5cbiAgY29uc3QgaXNQb3NpdGlvblRha2VuID0gKHJvdywgY29sdW1uLCBzaGlwKSA9PiB7XG4gICAgaWYgKHNoaXAuZ2V0SXNWZXJ0aWNhbCgpKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAuZ2V0TGVuZ3RoKCk7IGkgKz0gMSkge1xuICAgICAgICBpZiAoYm9hcmRbcm93ICsgaV1bY29sdW1uXSAhPT0gbnVsbCkgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5nZXRMZW5ndGgoKTsgaSArPSAxKSB7XG4gICAgICAgIGlmIChib2FyZFtyb3ddW2NvbHVtbiArIGldICE9PSBudWxsKSByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIGNvbnN0IGlzTmVpZ2hib3JUYWtlbiA9IChyb3csIGNvbHVtbiwgc2hpcCkgPT4ge1xuICAgIGlmIChzaGlwLmdldElzVmVydGljYWwoKSkge1xuICAgICAgZm9yIChsZXQgaSA9IHJvdyAtIDE7IGkgPD0gcm93ICsgc2hpcC5nZXRMZW5ndGgoKTsgaSArPSAxKSB7XG4gICAgICAgIGZvciAobGV0IGogPSBjb2x1bW4gLSAxOyBqIDw9IGNvbHVtbiArIDE7IGogKz0gMSkge1xuICAgICAgICAgIGlmICghaXNQb3NpdGlvbk91dE9mQm91bmRzKGksIGopICYmIGJvYXJkW2ldW2pdKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGxldCBpID0gcm93IC0gMTsgaSA8PSByb3cgKyAxOyBpICs9IDEpIHtcbiAgICAgICAgZm9yIChsZXQgaiA9IGNvbHVtbiAtIDE7IGogPD0gY29sdW1uICsgc2hpcC5nZXRMZW5ndGgoKTsgaiArPSAxKSB7XG4gICAgICAgICAgaWYgKCFpc1Bvc2l0aW9uT3V0T2ZCb3VuZHMoaSwgaikgJiYgYm9hcmRbaV1bal0pIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICBjb25zdCBpc1ZhbGlkUG9zaXRpb24gPSAocm93LCBjb2x1bW4sIHNoaXApID0+IHtcbiAgICBpZiAoaXNQb3NpdGlvbk91dE9mQm91bmRzKHJvdywgY29sdW1uKSkgcmV0dXJuIGZhbHNlO1xuICAgIGlmIChpc1NoaXBFbmRPdXRPZkJvdW5kcyhyb3csIGNvbHVtbiwgc2hpcCkpIHJldHVybiBmYWxzZTtcbiAgICBpZiAoaXNQb3NpdGlvblRha2VuKHJvdywgY29sdW1uLCBzaGlwKSkgcmV0dXJuIGZhbHNlO1xuICAgIGlmIChpc05laWdoYm9yVGFrZW4ocm93LCBjb2x1bW4sIHNoaXApKSByZXR1cm4gZmFsc2U7XG4gICAgcmV0dXJuIHRydWU7XG4gIH07XG5cbiAgY29uc3QgcGxhY2VTaGlwID0gKHJvdywgY29sdW1uLCBzaGlwKSA9PiB7XG4gICAgaWYgKCFpc1ZhbGlkUG9zaXRpb24ocm93LCBjb2x1bW4sIHNoaXApKSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKHNoaXAuZ2V0SXNWZXJ0aWNhbCgpKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAuZ2V0TGVuZ3RoKCk7IGkgKz0gMSkge1xuICAgICAgICBib2FyZFtyb3cgKyBpXVtjb2x1bW5dID0gc2hpcDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmdldExlbmd0aCgpOyBpICs9IDEpIHtcbiAgICAgICAgYm9hcmRbcm93XVtjb2x1bW4gKyBpXSA9IHNoaXA7XG4gICAgICB9XG4gICAgfVxuICAgIHNoaXAuc2V0U3RhcnRDZWxsKHJvdywgY29sdW1uKTtcbiAgICBzaGlwcy5wdXNoKHNoaXApO1xuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIGNvbnN0IHJlbW92ZVNoaXAgPSAocm93LCBjb2x1bW4pID0+IHtcbiAgICBjb25zdCBzaGlwID0gYm9hcmRbcm93XVtjb2x1bW5dO1xuICAgIGNvbnN0IHN0YXJ0Um93ID0gc2hpcC5nZXRTdGFydENlbGwoKVswXTtcbiAgICBjb25zdCBzdGFydENvbHVtbiA9IHNoaXAuZ2V0U3RhcnRDZWxsKClbMV07XG4gICAgaWYgKHNoaXAuZ2V0SXNWZXJ0aWNhbCgpKSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAuZ2V0TGVuZ3RoKCk7IGkgKz0gMSkge1xuICAgICAgICBib2FyZFtzdGFydFJvdyArIGldW3N0YXJ0Q29sdW1uXSA9IG51bGw7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5nZXRMZW5ndGgoKTsgaSArPSAxKSB7XG4gICAgICAgIGJvYXJkW3N0YXJ0Um93XVtzdGFydENvbHVtbiArIGldID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgc2hpcHMuc3BsaWNlKHNoaXBzLmluZGV4T2Yoc2hpcCksIDEpO1xuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIGNvbnN0IHBsYWNlUmFuZG9tU2hpcHMgPSAoKSA9PiB7XG4gICAgY29uc3Qgc2hpcExlbmd0aHMgPSBbNSwgNCwgMywgMywgMl07XG5cbiAgICBzaGlwTGVuZ3Rocy5mb3JFYWNoKChsZW5ndGgpID0+IHtcbiAgICAgIGxldCBpc1NoaXBQbGFjZWQgPSBmYWxzZTtcblxuICAgICAgd2hpbGUgKCFpc1NoaXBQbGFjZWQpIHtcbiAgICAgICAgY29uc3QgaXNWZXJ0aWNhbCA9IE1hdGgucmFuZG9tKCkgPCAwLjU7XG4gICAgICAgIGNvbnN0IHJvdyA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHNpemUpO1xuICAgICAgICBjb25zdCBjb2x1bW4gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBzaXplKTtcbiAgICAgICAgY29uc3QgbmV3U2hpcCA9IFNoaXAobGVuZ3RoLCBpc1ZlcnRpY2FsKTtcblxuICAgICAgICBpZiAoaXNWYWxpZFBvc2l0aW9uKHJvdywgY29sdW1uLCBuZXdTaGlwKSkge1xuICAgICAgICAgIHBsYWNlU2hpcChyb3csIGNvbHVtbiwgbmV3U2hpcCk7XG4gICAgICAgICAgaXNTaGlwUGxhY2VkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IHJlY2lldmVBdHRhY2sgPSAocm93LCBjb2x1bW4pID0+IHtcbiAgICBpZiAoaXNQb3NpdGlvbk91dE9mQm91bmRzKHJvdywgY29sdW1uKSkgcmV0dXJuIGZhbHNlO1xuICAgIGlmIChib2FyZFtyb3ddW2NvbHVtbl0pIHtcbiAgICAgIGJvYXJkW3Jvd11bY29sdW1uXS5oaXQoKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBtaXNzZWRTaG90c1tyb3ddW2NvbHVtbl0gPSB0cnVlO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICBjb25zdCBpc0FsbFNoaXBzU3VuayA9ICgpID0+IHNoaXBzLmV2ZXJ5KChzaGlwKSA9PiBzaGlwLmlzU3VuaygpID09PSB0cnVlKTtcblxuICByZXR1cm4ge1xuICAgIGdldEJvYXJkLFxuICAgIHBsYWNlU2hpcCxcbiAgICByZW1vdmVTaGlwLFxuICAgIHBsYWNlUmFuZG9tU2hpcHMsXG4gICAgcmVjaWV2ZUF0dGFjayxcbiAgICBnZXRNaXNzZWRTaG90cyxcbiAgICBpc0FsbFNoaXBzU3VuayxcbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWVCb2FyZDtcbiIsImNvbnN0IFBsYXllciA9IChuYW1lKSA9PiB7XG4gIGNvbnN0IGhpdFJlY29yZCA9IG5ldyBTZXQoKTtcblxuICBjb25zdCBoYXNBbHJlYXlIaXQgPSAocm93LCBjb2x1bW4pID0+IGhpdFJlY29yZC5oYXMoYCR7cm93fS0ke2NvbHVtbn1gKTtcblxuICBjb25zdCBpc0ludmFsaWRQb3NpdGlvbiA9IChyb3csIGNvbHVtbiwgc2l6ZSkgPT5cbiAgICByb3cgPCAwIHx8IGNvbHVtbiA8IDAgfHwgcm93ID49IHNpemUgfHwgY29sdW1uID49IHNpemU7XG5cbiAgY29uc3QgZ2V0UmFuZG9tUG9zaXRpb24gPSAoZ2FtZUJvYXJkKSA9PlxuICAgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGdhbWVCb2FyZC5nZXRCb2FyZCgpLmxlbmd0aCk7XG5cbiAgY29uc3QgZ2V0TmFtZSA9ICgpID0+IG5hbWU7XG5cbiAgY29uc3QgYXR0YWNrID0gKHJvdywgY29sdW1uLCBnYW1lQm9hcmQpID0+IHtcbiAgICBpZiAoaGFzQWxyZWF5SGl0KHJvdywgY29sdW1uKSkgcmV0dXJuIGZhbHNlO1xuICAgIGlmICghaXNJbnZhbGlkUG9zaXRpb24ocm93LCBjb2x1bW4sIGdhbWVCb2FyZC5nZXRCb2FyZCgpLmxlbmd0aCkpIHtcbiAgICAgIGdhbWVCb2FyZC5yZWNpZXZlQXR0YWNrKHJvdywgY29sdW1uKTtcbiAgICAgIGhpdFJlY29yZC5hZGQoYCR7cm93fS0ke2NvbHVtbn1gKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgY29uc3QgcmFuZG9tQXR0YWNrID0gKGdhbWVCb2FyZCkgPT4ge1xuICAgIGlmIChoaXRSZWNvcmQuc2l6ZSA9PT0gMTAwKSByZXR1cm4gZmFsc2U7XG4gICAgbGV0IHJhbmRvbVJvdyA9IGdldFJhbmRvbVBvc2l0aW9uKGdhbWVCb2FyZCk7XG4gICAgbGV0IHJhbmRvbUNvbCA9IGdldFJhbmRvbVBvc2l0aW9uKGdhbWVCb2FyZCk7XG5cbiAgICB3aGlsZSAoaGFzQWxyZWF5SGl0KHJhbmRvbVJvdywgcmFuZG9tQ29sKSkge1xuICAgICAgcmFuZG9tUm93ID0gZ2V0UmFuZG9tUG9zaXRpb24oZ2FtZUJvYXJkKTtcbiAgICAgIHJhbmRvbUNvbCA9IGdldFJhbmRvbVBvc2l0aW9uKGdhbWVCb2FyZCk7XG4gICAgfVxuICAgIGdhbWVCb2FyZC5yZWNpZXZlQXR0YWNrKHJhbmRvbVJvdywgcmFuZG9tQ29sKTtcbiAgICBoaXRSZWNvcmQuYWRkKGAke3JhbmRvbVJvd30tJHtyYW5kb21Db2x9YCk7XG4gICAgcmV0dXJuIFtyYW5kb21Sb3csIHJhbmRvbUNvbF07XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBnZXROYW1lLFxuICAgIGF0dGFjayxcbiAgICByYW5kb21BdHRhY2ssXG4gIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBQbGF5ZXI7XG4iLCJjb25zdCBTaGlwID0gKGxlbmd0aCwgaXNWZXJ0aWNhbCA9IGZhbHNlKSA9PiB7XG4gIGxldCBoaXRzID0gMDtcbiAgbGV0IHN0YXJ0Um93O1xuICBsZXQgc3RhcnRDb2x1bW47XG5cbiAgY29uc3QgZ2V0TGVuZ3RoID0gKCkgPT4gbGVuZ3RoO1xuICBjb25zdCBnZXRJc1ZlcnRpY2FsID0gKCkgPT4gaXNWZXJ0aWNhbDtcbiAgY29uc3QgZ2V0SGl0cyA9ICgpID0+IGhpdHM7XG4gIGNvbnN0IGlzU3VuayA9ICgpID0+IGhpdHMgPT09IGxlbmd0aDtcbiAgY29uc3QgaGl0ID0gKCkgPT4ge1xuICAgIGlmIChoaXRzIDwgbGVuZ3RoKSBoaXRzICs9IDE7XG4gIH07XG4gIGNvbnN0IGdldFN0YXJ0Q2VsbCA9ICgpID0+IFtzdGFydFJvdywgc3RhcnRDb2x1bW5dO1xuICBjb25zdCBzZXRTdGFydENlbGwgPSAocm93LCBjb2x1bW4pID0+IHtcbiAgICBzdGFydFJvdyA9IHJvdztcbiAgICBzdGFydENvbHVtbiA9IGNvbHVtbjtcbiAgfTtcblxuICByZXR1cm4ge1xuICAgIGdldExlbmd0aCxcbiAgICBnZXRJc1ZlcnRpY2FsLFxuICAgIGdldEhpdHMsXG4gICAgaXNTdW5rLFxuICAgIGhpdCxcbiAgICBnZXRTdGFydENlbGwsXG4gICAgc2V0U3RhcnRDZWxsLFxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgU2hpcDtcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGAqLFxuKjo6YmVmb3JlLFxuKjo6YWZ0ZXIge1xuICBtYXJnaW46IDA7XG4gIHBhZGRpbmc6IDA7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG59XG5cbmh0bWwsXG5ib2R5IHtcbiAgaGVpZ2h0OiAxMDAlO1xuICB3aWR0aDogMTAwJTtcbn1cblxuLmJvYXJkcyB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xufVxuXG4uYm9hcmQge1xuICB3aWR0aDogbWF4LWNvbnRlbnQ7XG59XG5cbi5yb3cge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogcm93O1xufVxuXG4uY2VsbCB7XG4gIHdpZHRoOiAycmVtO1xuICBhc3BlY3QtcmF0aW86IDE7XG4gIGJvcmRlcjogMXB4IHNvbGlkIGJsdWU7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbn1cblxuLnNoaXAge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiBncmVlbjtcbn1cblxuLm1pc3NlZCB7XG4gIGJhY2tncm91bmQtY29sb3I6IGFxdWE7XG59XG5cbi5oaXQge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZWQ7XG59XG5cbi53aW5uZXJNb2RhbCB7XG4gIHBhZGRpbmc6IDJyZW0gNXJlbTtcbiAgb3V0bGluZTogbm9uZTtcbiAgYm9yZGVyOiBub25lO1xuICBtYXJnaW46IGF1dG87XG4gIGJvcmRlci1yYWRpdXM6IDFyZW07XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgZ2FwOiAxcmVtO1xufVxuXG4ud2lubmVyTWVzc2FnZSB7XG4gIGZvbnQtc2l6ZTogMS41cmVtO1xuICBmb250LXdlaWdodDogYm9sZDtcbn1cblxuLndpbm5lck1vZGFsIC5yZXN0YXJ0QnRuIHtcbiAgZm9udC1zaXplOiAxcmVtO1xuICBwYWRkaW5nOiAwLjVyZW0gMS41cmVtO1xuICBib3JkZXItcmFkaXVzOiAxcmVtO1xuICBib3JkZXI6IG5vbmU7XG4gIG91dGxpbmU6IG5vbmU7XG4gIGN1cnNvcjogcG9pbnRlcjtcbn1gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9zdHlsZXMvc3R5bGVzLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTs7O0VBR0UsU0FBUztFQUNULFVBQVU7RUFDVixzQkFBc0I7QUFDeEI7O0FBRUE7O0VBRUUsWUFBWTtFQUNaLFdBQVc7QUFDYjs7QUFFQTtFQUNFLGFBQWE7RUFDYiw2QkFBNkI7QUFDL0I7O0FBRUE7RUFDRSxrQkFBa0I7QUFDcEI7O0FBRUE7RUFDRSxhQUFhO0VBQ2IsbUJBQW1CO0FBQ3JCOztBQUVBO0VBQ0UsV0FBVztFQUNYLGVBQWU7RUFDZixzQkFBc0I7RUFDdEIsa0JBQWtCO0FBQ3BCOztBQUVBO0VBQ0UsdUJBQXVCO0FBQ3pCOztBQUVBO0VBQ0Usc0JBQXNCO0FBQ3hCOztBQUVBO0VBQ0UscUJBQXFCO0FBQ3ZCOztBQUVBO0VBQ0Usa0JBQWtCO0VBQ2xCLGFBQWE7RUFDYixZQUFZO0VBQ1osWUFBWTtFQUNaLG1CQUFtQjtFQUNuQixhQUFhO0VBQ2Isc0JBQXNCO0VBQ3RCLGtCQUFrQjtFQUNsQixTQUFTO0FBQ1g7O0FBRUE7RUFDRSxpQkFBaUI7RUFDakIsaUJBQWlCO0FBQ25COztBQUVBO0VBQ0UsZUFBZTtFQUNmLHNCQUFzQjtFQUN0QixtQkFBbUI7RUFDbkIsWUFBWTtFQUNaLGFBQWE7RUFDYixlQUFlO0FBQ2pCXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIiosXFxuKjo6YmVmb3JlLFxcbio6OmFmdGVyIHtcXG4gIG1hcmdpbjogMDtcXG4gIHBhZGRpbmc6IDA7XFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbn1cXG5cXG5odG1sLFxcbmJvZHkge1xcbiAgaGVpZ2h0OiAxMDAlO1xcbiAgd2lkdGg6IDEwMCU7XFxufVxcblxcbi5ib2FyZHMge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcbn1cXG5cXG4uYm9hcmQge1xcbiAgd2lkdGg6IG1heC1jb250ZW50O1xcbn1cXG5cXG4ucm93IHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogcm93O1xcbn1cXG5cXG4uY2VsbCB7XFxuICB3aWR0aDogMnJlbTtcXG4gIGFzcGVjdC1yYXRpbzogMTtcXG4gIGJvcmRlcjogMXB4IHNvbGlkIGJsdWU7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxufVxcblxcbi5zaGlwIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IGdyZWVuO1xcbn1cXG5cXG4ubWlzc2VkIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IGFxdWE7XFxufVxcblxcbi5oaXQge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmVkO1xcbn1cXG5cXG4ud2lubmVyTW9kYWwge1xcbiAgcGFkZGluZzogMnJlbSA1cmVtO1xcbiAgb3V0bGluZTogbm9uZTtcXG4gIGJvcmRlcjogbm9uZTtcXG4gIG1hcmdpbjogYXV0bztcXG4gIGJvcmRlci1yYWRpdXM6IDFyZW07XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGdhcDogMXJlbTtcXG59XFxuXFxuLndpbm5lck1lc3NhZ2Uge1xcbiAgZm9udC1zaXplOiAxLjVyZW07XFxuICBmb250LXdlaWdodDogYm9sZDtcXG59XFxuXFxuLndpbm5lck1vZGFsIC5yZXN0YXJ0QnRuIHtcXG4gIGZvbnQtc2l6ZTogMXJlbTtcXG4gIHBhZGRpbmc6IDAuNXJlbSAxLjVyZW07XFxuICBib3JkZXItcmFkaXVzOiAxcmVtO1xcbiAgYm9yZGVyOiBub25lO1xcbiAgb3V0bGluZTogbm9uZTtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG59XCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xuICB2YXIgbGlzdCA9IFtdO1xuXG4gIC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBpdGVtWzVdICE9PSBcInVuZGVmaW5lZFwiO1xuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KS5qb2luKFwiXCIpO1xuICB9O1xuXG4gIC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG4gIGxpc3QuaSA9IGZ1bmN0aW9uIGkobW9kdWxlcywgbWVkaWEsIGRlZHVwZSwgc3VwcG9ydHMsIGxheWVyKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcbiAgICB9XG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRoaXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIGlkID0gdGhpc1trXVswXTtcbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG4gICAgICBpZiAoZGVkdXBlICYmIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGxheWVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVs1XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzdXBwb3J0cykge1xuICAgICAgICBpZiAoIWl0ZW1bNF0pIHtcbiAgICAgICAgICBpdGVtWzRdID0gXCJcIi5jb25jYXQoc3VwcG9ydHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs0XSA9IHN1cHBvcnRzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGNvbnRlbnQgPSBpdGVtWzFdO1xuICB2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG4gIGlmICghY3NzTWFwcGluZykge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG4gIGlmICh0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGNzc01hcHBpbmcpKSkpO1xuICAgIHZhciBkYXRhID0gXCJzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIi5jb25jYXQoYmFzZTY0KTtcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IFwiLyojIFwiLmNvbmNhdChkYXRhLCBcIiAqL1wiKTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oXCJcXG5cIik7XG4gIH1cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xufTsiLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGVzLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGVzLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3R5bGVzSW5ET00gPSBbXTtcbmZ1bmN0aW9uIGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpIHtcbiAgdmFyIHJlc3VsdCA9IC0xO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlc0luRE9NLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN0eWxlc0luRE9NW2ldLmlkZW50aWZpZXIgPT09IGlkZW50aWZpZXIpIHtcbiAgICAgIHJlc3VsdCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKSB7XG4gIHZhciBpZENvdW50TWFwID0ge307XG4gIHZhciBpZGVudGlmaWVycyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV07XG4gICAgdmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG4gICAgdmFyIGNvdW50ID0gaWRDb3VudE1hcFtpZF0gfHwgMDtcbiAgICB2YXIgaWRlbnRpZmllciA9IFwiXCIuY29uY2F0KGlkLCBcIiBcIikuY29uY2F0KGNvdW50KTtcbiAgICBpZENvdW50TWFwW2lkXSA9IGNvdW50ICsgMTtcbiAgICB2YXIgaW5kZXhCeUlkZW50aWZpZXIgPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICB2YXIgb2JqID0ge1xuICAgICAgY3NzOiBpdGVtWzFdLFxuICAgICAgbWVkaWE6IGl0ZW1bMl0sXG4gICAgICBzb3VyY2VNYXA6IGl0ZW1bM10sXG4gICAgICBzdXBwb3J0czogaXRlbVs0XSxcbiAgICAgIGxheWVyOiBpdGVtWzVdXG4gICAgfTtcbiAgICBpZiAoaW5kZXhCeUlkZW50aWZpZXIgIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHVwZGF0ZXIgPSBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKTtcbiAgICAgIG9wdGlvbnMuYnlJbmRleCA9IGk7XG4gICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoaSwgMCwge1xuICAgICAgICBpZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuICAgICAgICB1cGRhdGVyOiB1cGRhdGVyLFxuICAgICAgICByZWZlcmVuY2VzOiAxXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgfVxuICByZXR1cm4gaWRlbnRpZmllcnM7XG59XG5mdW5jdGlvbiBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKSB7XG4gIHZhciBhcGkgPSBvcHRpb25zLmRvbUFQSShvcHRpb25zKTtcbiAgYXBpLnVwZGF0ZShvYmopO1xuICB2YXIgdXBkYXRlciA9IGZ1bmN0aW9uIHVwZGF0ZXIobmV3T2JqKSB7XG4gICAgaWYgKG5ld09iaikge1xuICAgICAgaWYgKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcCAmJiBuZXdPYmouc3VwcG9ydHMgPT09IG9iai5zdXBwb3J0cyAmJiBuZXdPYmoubGF5ZXIgPT09IG9iai5sYXllcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBhcGkudXBkYXRlKG9iaiA9IG5ld09iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwaS5yZW1vdmUoKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiB1cGRhdGVyO1xufVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGlzdCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgbGlzdCA9IGxpc3QgfHwgW107XG4gIHZhciBsYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucyk7XG4gIHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuICAgIG5ld0xpc3QgPSBuZXdMaXN0IHx8IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tpXTtcbiAgICAgIHZhciBpbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhdLnJlZmVyZW5jZXMtLTtcbiAgICB9XG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIF9pZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW19pXTtcbiAgICAgIHZhciBfaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihfaWRlbnRpZmllcik7XG4gICAgICBpZiAoc3R5bGVzSW5ET01bX2luZGV4XS5yZWZlcmVuY2VzID09PSAwKSB7XG4gICAgICAgIHN0eWxlc0luRE9NW19pbmRleF0udXBkYXRlcigpO1xuICAgICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoX2luZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGFzdElkZW50aWZpZXJzID0gbmV3TGFzdElkZW50aWZpZXJzO1xuICB9O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIG1lbW8gPSB7fTtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBnZXRUYXJnZXQodGFyZ2V0KSB7XG4gIGlmICh0eXBlb2YgbWVtb1t0YXJnZXRdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgdmFyIHN0eWxlVGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xuXG4gICAgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcbiAgICBpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuICAgICAgICAvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuICAgICAgICBzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICBzdHlsZVRhcmdldCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIG1lbW9bdGFyZ2V0XSA9IHN0eWxlVGFyZ2V0O1xuICB9XG4gIHJldHVybiBtZW1vW3RhcmdldF07XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0QnlTZWxlY3RvcihpbnNlcnQsIHN0eWxlKSB7XG4gIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQoaW5zZXJ0KTtcbiAgaWYgKCF0YXJnZXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydCcgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuICB9XG4gIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydEJ5U2VsZWN0b3I7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gIG9wdGlvbnMuc2V0QXR0cmlidXRlcyhlbGVtZW50LCBvcHRpb25zLmF0dHJpYnV0ZXMpO1xuICBvcHRpb25zLmluc2VydChlbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xuICByZXR1cm4gZWxlbWVudDtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0U3R5bGVFbGVtZW50OyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcyhzdHlsZUVsZW1lbnQpIHtcbiAgdmFyIG5vbmNlID0gdHlwZW9mIF9fd2VicGFja19ub25jZV9fICE9PSBcInVuZGVmaW5lZFwiID8gX193ZWJwYWNrX25vbmNlX18gOiBudWxsO1xuICBpZiAobm9uY2UpIHtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgbm9uY2UpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlczsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaikge1xuICB2YXIgY3NzID0gXCJcIjtcbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KG9iai5zdXBwb3J0cywgXCIpIHtcIik7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpO1xuICB9XG4gIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2Ygb2JqLmxheWVyICE9PSBcInVuZGVmaW5lZFwiO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwiQGxheWVyXCIuY29uY2F0KG9iai5sYXllci5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KG9iai5sYXllcikgOiBcIlwiLCBcIiB7XCIpO1xuICB9XG4gIGNzcyArPSBvYmouY3NzO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICB2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcbiAgaWYgKHNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIuY29uY2F0KGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSksIFwiICovXCIpO1xuICB9XG5cbiAgLy8gRm9yIG9sZCBJRVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgICovXG4gIG9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG59XG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XG4gIC8vIGlzdGFuYnVsIGlnbm9yZSBpZlxuICBpZiAoc3R5bGVFbGVtZW50LnBhcmVudE5vZGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBkb21BUEkob3B0aW9ucykge1xuICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKCkge30sXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgfTtcbiAgfVxuICB2YXIgc3R5bGVFbGVtZW50ID0gb3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG4gIHJldHVybiB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUob2JqKSB7XG4gICAgICBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaik7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuICAgIH1cbiAgfTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZG9tQVBJOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50KSB7XG4gIGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XG4gICAgICBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgIH1cbiAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc3R5bGVUYWdUcmFuc2Zvcm07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubmMgPSB1bmRlZmluZWQ7IiwiaW1wb3J0IFwiLi9zdHlsZXMvc3R5bGVzLmNzc1wiO1xuaW1wb3J0IGdhbWUgZnJvbSBcIi4vbW9kdWxlcy9nYW1lXCI7XG5cbmdhbWUoKTsiXSwibmFtZXMiOlsiRE9NY29udHJvbGxlciIsImNyZWF0ZUNlbGwiLCJyb3dJbmRleCIsImNvbHVtbkluZGV4IiwiY2VsbCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTGlzdCIsImFkZCIsInNldEF0dHJpYnV0ZSIsImNyZWF0ZVJvdyIsInJvd0FycmF5Iiwicm93IiwiZm9yRWFjaCIsIl8iLCJjb2x1bW4iLCJhcHBlbmRDaGlsZCIsInJlbmRlckdhbWVCb2FyZCIsImdhbWVCb2FyZCIsImJvYXJkQXJyYXkiLCJnZXRCb2FyZCIsImJvYXJkIiwicmVuZGVyU2hpcHMiLCJib2FyZENvbnRhaW5lciIsInF1ZXJ5U2VsZWN0b3IiLCJjZWxsVmFsdWUiLCJpbml0aWFsaXplUmVzdGFydEJ0biIsInJlc3RhcnRCdG4iLCJhZGRFdmVudExpc3RlbmVyIiwid2luZG93IiwibG9jYXRpb24iLCJyZWxvYWQiLCJnZXRVc2VyTW92ZSIsIlByb21pc2UiLCJyZXNvbHZlIiwidXNlckJvYXJkQ29udGFpbmVyIiwiaGFuZGxlQ2xpY2siLCJldmVudCIsInRhcmdldCIsImNsb3Nlc3QiLCJwYXJzZUludCIsImdldEF0dHJpYnV0ZSIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJoYW5kbGVDZWxsVXBkYXRlIiwiY29vcmRzIiwibWlzc2VkU2hvdHMiLCJwbGF5ZXIiLCJnZXROYW1lIiwiaXNIaXQiLCJzaG93V2lubmVyIiwid2lubmVyIiwid2lubmVyTW9kYWwiLCJ3aW5uZXJNZXNzYWdlIiwidGV4dENvbnRlbnQiLCJzaG93TW9kYWwiLCJHYW1lQm9hcmQiLCJQbGF5ZXIiLCJnYW1lIiwidXNlciIsImNvbXB1dGVyIiwidXNlckJvYXJkIiwiY29tcHV0ZXJCb2FyZCIsImRvbUNvbnRyb2xsZXIiLCJjb21wdXRlckJvYXJkQ29udGFpbmVyIiwicGxheVR1cm4iLCJ1c2VyQ2VsbENvb3JkcyIsInVzZXJBdHRhY2tTdWNjZXNzIiwiYXR0YWNrIiwiZ2V0TWlzc2VkU2hvdHMiLCJjb21wdXRlckNlbGxDb29yZHMiLCJyYW5kb21BdHRhY2siLCJjaGVja0Zvcldpbm5lciIsImlzQWxsU2hpcHNTdW5rIiwiZ2FtZUxvb3AiLCJwbGFjZVJhbmRvbVNoaXBzIiwiU2hpcCIsInNpemUiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJ1bmRlZmluZWQiLCJzaGlwcyIsImkiLCJwdXNoIiwiaiIsImlzUG9zaXRpb25PdXRPZkJvdW5kcyIsImlzU2hpcEVuZE91dE9mQm91bmRzIiwic2hpcCIsImdldElzVmVydGljYWwiLCJnZXRMZW5ndGgiLCJpc1Bvc2l0aW9uVGFrZW4iLCJpc05laWdoYm9yVGFrZW4iLCJpc1ZhbGlkUG9zaXRpb24iLCJwbGFjZVNoaXAiLCJzZXRTdGFydENlbGwiLCJyZW1vdmVTaGlwIiwic3RhcnRSb3ciLCJnZXRTdGFydENlbGwiLCJzdGFydENvbHVtbiIsInNwbGljZSIsImluZGV4T2YiLCJzaGlwTGVuZ3RocyIsImlzU2hpcFBsYWNlZCIsImlzVmVydGljYWwiLCJNYXRoIiwicmFuZG9tIiwiZmxvb3IiLCJuZXdTaGlwIiwicmVjaWV2ZUF0dGFjayIsImhpdCIsImV2ZXJ5IiwiaXNTdW5rIiwibmFtZSIsImhpdFJlY29yZCIsIlNldCIsImhhc0FscmVheUhpdCIsImhhcyIsImlzSW52YWxpZFBvc2l0aW9uIiwiZ2V0UmFuZG9tUG9zaXRpb24iLCJyYW5kb21Sb3ciLCJyYW5kb21Db2wiLCJoaXRzIiwiZ2V0SGl0cyJdLCJzb3VyY2VSb290IjoiIn0=