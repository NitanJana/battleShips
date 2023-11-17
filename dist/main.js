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
    ships.push(ship);
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
  const getLength = () => length;
  const getIsVertical = () => isVertical;
  const getHits = () => hits;
  const isSunk = () => hits === length;
  const hit = () => {
    if (hits < length) hits += 1;
  };
  return {
    getLength,
    getIsVertical,
    getHits,
    isSunk,
    hit
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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UEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztXQ05BOzs7Ozs7Ozs7Ozs7O0FDQTZCO0FBQ0s7QUFFbENsQix5REFBSSxDQUFDLENBQUMsQyIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXBzLy4vc3JjL21vZHVsZXMvRE9NY29udHJvbGxlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy8uL3NyYy9tb2R1bGVzL2dhbWUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcHMvLi9zcmMvbW9kdWxlcy9nYW1lQm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcHMvLi9zcmMvbW9kdWxlcy9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcHMvLi9zcmMvbW9kdWxlcy9zaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXBzLy4vc3JjL3N0eWxlcy9zdHlsZXMuY3NzIiwid2VicGFjazovL2JhdHRsZXNoaXBzLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXBzLy4vc3JjL3N0eWxlcy9zdHlsZXMuY3NzP2U0NWIiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcHMvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcHMvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXBzLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXBzLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXBzLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcHMvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcHMvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXBzL3dlYnBhY2svcnVudGltZS9ub25jZSIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBET01jb250cm9sbGVyID0gKCkgPT4ge1xuICAvLyBGdW5jdGlvbiB0byBjcmVhdGUgYSBzaW5nbGUgY2VsbFxuICBjb25zdCBjcmVhdGVDZWxsID0gKHJvd0luZGV4LCBjb2x1bW5JbmRleCkgPT4ge1xuICAgIGNvbnN0IGNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGNlbGwuY2xhc3NMaXN0LmFkZChcImNlbGxcIik7XG4gICAgY2VsbC5zZXRBdHRyaWJ1dGUoXCJyb3dcIiwgcm93SW5kZXgpO1xuICAgIGNlbGwuc2V0QXR0cmlidXRlKFwiY29sdW1uXCIsIGNvbHVtbkluZGV4KTtcbiAgICByZXR1cm4gY2VsbDtcbiAgfTtcblxuICAvLyBGdW5jdGlvbiB0byBjcmVhdGUgYSBzaW5nbGUgcm93XG4gIGNvbnN0IGNyZWF0ZVJvdyA9IChyb3dBcnJheSwgcm93SW5kZXgpID0+IHtcbiAgICBjb25zdCByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIHJvdy5jbGFzc0xpc3QuYWRkKFwicm93XCIpO1xuICAgIHJvd0FycmF5LmZvckVhY2goKF8sIGNvbHVtbikgPT4ge1xuICAgICAgY29uc3QgY2VsbCA9IGNyZWF0ZUNlbGwocm93SW5kZXgsIGNvbHVtbik7XG4gICAgICByb3cuYXBwZW5kQ2hpbGQoY2VsbCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJvdztcbiAgfTtcblxuICAvLyBGdW5jdGlvbiB0byByZW5kZXIgdGhlIGdhbWUgYm9hcmRcbiAgY29uc3QgcmVuZGVyR2FtZUJvYXJkID0gKGdhbWVCb2FyZCkgPT4ge1xuICAgIGNvbnN0IGJvYXJkQXJyYXkgPSBnYW1lQm9hcmQuZ2V0Qm9hcmQoKTtcbiAgICBjb25zdCBib2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgYm9hcmQuY2xhc3NMaXN0LmFkZChcImJvYXJkXCIpO1xuXG4gICAgYm9hcmRBcnJheS5mb3JFYWNoKChyb3dBcnJheSwgcm93SW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IHJvdyA9IGNyZWF0ZVJvdyhyb3dBcnJheSwgcm93SW5kZXgpO1xuICAgICAgYm9hcmQuYXBwZW5kQ2hpbGQocm93KTtcbiAgICB9KTtcbiAgICByZXR1cm4gYm9hcmQ7XG4gIH07XG5cbiAgY29uc3QgcmVuZGVyU2hpcHMgPSAoZ2FtZUJvYXJkKSA9PiB7XG4gICAgY29uc3QgYm9hcmRBcnJheSA9IGdhbWVCb2FyZC5nZXRCb2FyZCgpO1xuICAgIC8vIGNvbnN0IGJvYXJkQ29udGFpbmVyID1cbiAgICAvLyAgIHBsYXllci5nZXROYW1lKCkgPT09IFwidXNlclwiXG4gICAgLy8gICAgID8gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi51c2VyQm9hcmRDb250YWluZXJcIilcbiAgICAvLyAgICAgOiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvbXB1dGVyQm9hcmRDb250YWluZXJcIik7XG4gICAgY29uc3QgYm9hcmRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiLmNvbXB1dGVyQm9hcmRDb250YWluZXJcIik7XG4gICAgYm9hcmRBcnJheS5mb3JFYWNoKChyb3dBcnJheSwgcm93SW5kZXgpID0+IHtcbiAgICAgIHJvd0FycmF5LmZvckVhY2goKGNlbGxWYWx1ZSwgY29sdW1uSW5kZXgpID0+IHtcbiAgICAgICAgY29uc3QgY2VsbCA9IGJvYXJkQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoXG4gICAgICAgICAgYC5yb3c6bnRoLWNoaWxkKCR7cm93SW5kZXggKyAxfSkgLmNlbGw6bnRoLWNoaWxkKCR7Y29sdW1uSW5kZXggKyAxfSlgLFxuICAgICAgICApO1xuXG4gICAgICAgIC8vIENoZWNrIGlmIHRoZXJlIGlzIGEgc2hpcCBhdCB0aGlzIGNlbGxcbiAgICAgICAgaWYgKGNlbGxWYWx1ZSkge1xuICAgICAgICAgIGNlbGwuY2xhc3NMaXN0LmFkZChcInNoaXBcIik7IC8vIEFkZCBhIGNsYXNzIHRvIGluZGljYXRlIGEgc2hpcCBhdCB0aGlzIGNlbGxcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG5cbiAgY29uc3QgaW5pdGlhbGl6ZVJlc3RhcnRCdG4gPSAoKSA9PiB7XG4gICAgY29uc3QgcmVzdGFydEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIucmVzdGFydEJ0blwiKTtcbiAgICByZXN0YXJ0QnRuLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gRnVuY3Rpb24gdG8gZ2V0IHVzZXIgbW92ZVxuICBjb25zdCBnZXRVc2VyTW92ZSA9ICgpID0+XG4gICAgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgIGNvbnN0IHVzZXJCb2FyZENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudXNlckJvYXJkQ29udGFpbmVyXCIpO1xuXG4gICAgICBjb25zdCBoYW5kbGVDbGljayA9IChldmVudCkgPT4ge1xuICAgICAgICBjb25zdCBjZWxsID0gZXZlbnQudGFyZ2V0LmNsb3Nlc3QoXCIuY2VsbFwiKTtcbiAgICAgICAgaWYgKGNlbGwpIHtcbiAgICAgICAgICBjb25zdCByb3cgPSBwYXJzZUludChjZWxsLmdldEF0dHJpYnV0ZShcInJvd1wiKSwgMTApO1xuICAgICAgICAgIGNvbnN0IGNvbHVtbiA9IHBhcnNlSW50KGNlbGwuZ2V0QXR0cmlidXRlKFwiY29sdW1uXCIpLCAxMCk7XG4gICAgICAgICAgdXNlckJvYXJkQ29udGFpbmVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBoYW5kbGVDbGljayk7XG4gICAgICAgICAgcmVzb2x2ZShbcm93LCBjb2x1bW5dKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgdXNlckJvYXJkQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBoYW5kbGVDbGljayk7XG4gICAgfSk7XG5cbiAgLy8gRnVuY3Rpb24gdG8gaGFuZGxlIGNlbGwgc3RhdGUgY2hhbmdlXG4gIGNvbnN0IGhhbmRsZUNlbGxVcGRhdGUgPSAoY29vcmRzLCBtaXNzZWRTaG90cywgcGxheWVyKSA9PiB7XG4gICAgY29uc3QgW3JvdywgY29sdW1uXSA9IGNvb3JkcztcbiAgICBsZXQgY2VsbDtcbiAgICBpZiAocGxheWVyLmdldE5hbWUoKSA9PT0gXCJ1c2VyXCIpIHtcbiAgICAgIGNlbGwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBgLnVzZXJCb2FyZENvbnRhaW5lciAucm93Om50aC1jaGlsZCgke3JvdyArIDF9KSAuY2VsbDpudGgtY2hpbGQoJHtcbiAgICAgICAgICBjb2x1bW4gKyAxXG4gICAgICAgIH0pYCxcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNlbGwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBgLmNvbXB1dGVyQm9hcmRDb250YWluZXIgLnJvdzpudGgtY2hpbGQoJHtyb3cgKyAxfSkgLmNlbGw6bnRoLWNoaWxkKCR7XG4gICAgICAgICAgY29sdW1uICsgMVxuICAgICAgICB9KWAsXG4gICAgICApO1xuICAgIH1cbiAgICBjb25zdCBpc0hpdCA9ICFtaXNzZWRTaG90c1tyb3ddW2NvbHVtbl07XG5cbiAgICBjZWxsLmNsYXNzTGlzdC5hZGQoaXNIaXQgPyBcImhpdFwiIDogXCJtaXNzZWRcIik7XG4gIH07XG5cbiAgY29uc3Qgc2hvd1dpbm5lciA9ICh3aW5uZXIpID0+IHtcbiAgICBjb25zdCB3aW5uZXJNb2RhbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIud2lubmVyTW9kYWxcIik7XG4gICAgY29uc3Qgd2lubmVyTWVzc2FnZSA9IHdpbm5lck1vZGFsLnF1ZXJ5U2VsZWN0b3IoXCIud2lubmVyTWVzc2FnZVwiKTtcbiAgICB3aW5uZXJNZXNzYWdlLnRleHRDb250ZW50ID0gYCR7d2lubmVyfSB3b25gO1xuICAgIHdpbm5lck1vZGFsLnNob3dNb2RhbCgpO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgcmVuZGVyR2FtZUJvYXJkLFxuICAgIHJlbmRlclNoaXBzLFxuICAgIGluaXRpYWxpemVSZXN0YXJ0QnRuLFxuICAgIGdldFVzZXJNb3ZlLFxuICAgIGhhbmRsZUNlbGxVcGRhdGUsXG4gICAgc2hvd1dpbm5lcixcbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IERPTWNvbnRyb2xsZXI7XG4iLCJpbXBvcnQgRE9NY29udHJvbGxlciBmcm9tIFwiLi9ET01jb250cm9sbGVyXCI7XG5pbXBvcnQgR2FtZUJvYXJkIGZyb20gXCIuL2dhbWVCb2FyZFwiO1xuaW1wb3J0IFBsYXllciBmcm9tIFwiLi9wbGF5ZXJcIjtcbi8vIGltcG9ydCBTaGlwIGZyb20gXCIuL3NoaXBcIjtcblxuY29uc3QgZ2FtZSA9ICgpID0+IHtcbiAgY29uc3QgdXNlciA9IFBsYXllcihcInVzZXJcIik7XG4gIGNvbnN0IGNvbXB1dGVyID0gUGxheWVyKFwiY29tcHV0ZXJcIik7XG4gIGNvbnN0IHVzZXJCb2FyZCA9IEdhbWVCb2FyZCgpO1xuICBjb25zdCBjb21wdXRlckJvYXJkID0gR2FtZUJvYXJkKCk7XG4gIGNvbnN0IGRvbUNvbnRyb2xsZXIgPSBET01jb250cm9sbGVyKCk7XG4gIC8vIGNvbnN0IG5ld1NoaXAgPSBTaGlwKDMpO1xuICAvLyB1c2VyQm9hcmQucGxhY2VTaGlwKDIsIDIsIG5ld1NoaXApO1xuICAvLyBjb25zdCBuZXdTaGlwMiA9IFNoaXAoMywgdHJ1ZSk7XG4gIC8vIGNvbXB1dGVyQm9hcmQucGxhY2VTaGlwKDQsIDIsIG5ld1NoaXAyKTtcblxuICBjb25zdCBjb21wdXRlckJvYXJkQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICBcIi5jb21wdXRlckJvYXJkQ29udGFpbmVyXCIsXG4gICk7XG4gIGNvbnN0IHVzZXJCb2FyZENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudXNlckJvYXJkQ29udGFpbmVyXCIpO1xuICBjb21wdXRlckJvYXJkQ29udGFpbmVyLmFwcGVuZENoaWxkKFxuICAgIGRvbUNvbnRyb2xsZXIucmVuZGVyR2FtZUJvYXJkKGNvbXB1dGVyQm9hcmQpLFxuICApO1xuICB1c2VyQm9hcmRDb250YWluZXIuYXBwZW5kQ2hpbGQoZG9tQ29udHJvbGxlci5yZW5kZXJHYW1lQm9hcmQodXNlckJvYXJkKSk7XG5cbiAgY29uc3QgcGxheVR1cm4gPSBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgdXNlckNlbGxDb29yZHMgPSBhd2FpdCBkb21Db250cm9sbGVyLmdldFVzZXJNb3ZlKCk7XG4gICAgY29uc3QgdXNlckF0dGFja1N1Y2Nlc3MgPSB1c2VyLmF0dGFjayhcbiAgICAgIHVzZXJDZWxsQ29vcmRzWzBdLFxuICAgICAgdXNlckNlbGxDb29yZHNbMV0sXG4gICAgICB1c2VyQm9hcmQsXG4gICAgKTtcblxuICAgIGlmICh1c2VyQXR0YWNrU3VjY2Vzcykge1xuICAgICAgZG9tQ29udHJvbGxlci5oYW5kbGVDZWxsVXBkYXRlKFxuICAgICAgICB1c2VyQ2VsbENvb3JkcyxcbiAgICAgICAgdXNlckJvYXJkLmdldE1pc3NlZFNob3RzKCksXG4gICAgICAgIHVzZXIsXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IGNvbXB1dGVyQ2VsbENvb3JkcyA9IGNvbXB1dGVyLnJhbmRvbUF0dGFjayhjb21wdXRlckJvYXJkKTtcblxuICAgIGRvbUNvbnRyb2xsZXIuaGFuZGxlQ2VsbFVwZGF0ZShcbiAgICAgIGNvbXB1dGVyQ2VsbENvb3JkcyxcbiAgICAgIGNvbXB1dGVyQm9hcmQuZ2V0TWlzc2VkU2hvdHMoKSxcbiAgICAgIGNvbXB1dGVyLFxuICAgICk7XG4gIH07XG4gIC8vIEZ1bmN0aW9uIHRvIGNoZWNrIGZvciB3aW5uZXJcbiAgY29uc3QgY2hlY2tGb3JXaW5uZXIgPSAoKSA9PiB7XG4gICAgaWYgKHVzZXJCb2FyZC5pc0FsbFNoaXBzU3VuaygpKSB7XG4gICAgICBkb21Db250cm9sbGVyLnNob3dXaW5uZXIodXNlci5nZXROYW1lKCkpO1xuICAgIH0gZWxzZSBpZiAoY29tcHV0ZXJCb2FyZC5pc0FsbFNoaXBzU3VuaygpKSB7XG4gICAgICBkb21Db250cm9sbGVyLnNob3dXaW5uZXIoY29tcHV0ZXIuZ2V0TmFtZSgpKTtcbiAgICB9XG4gIH07XG4gIC8vIEdhbWUgbG9vcFxuICBjb25zdCBnYW1lTG9vcCA9IGFzeW5jICgpID0+IHtcbiAgICAvLyBFeGl0IGNvbmRpdGlvblxuICAgIHdoaWxlICghdXNlckJvYXJkLmlzQWxsU2hpcHNTdW5rKCkgJiYgIWNvbXB1dGVyQm9hcmQuaXNBbGxTaGlwc1N1bmsoKSkge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWF3YWl0LWluLWxvb3BcbiAgICAgIGF3YWl0IHBsYXlUdXJuKCk7XG4gICAgfVxuICAgIGNoZWNrRm9yV2lubmVyKCk7XG4gIH07XG5cbiAgZG9tQ29udHJvbGxlci5pbml0aWFsaXplUmVzdGFydEJ0bigpO1xuXG4gIHVzZXJCb2FyZC5wbGFjZVJhbmRvbVNoaXBzKCk7XG4gIGNvbXB1dGVyQm9hcmQucGxhY2VSYW5kb21TaGlwcygpO1xuICBkb21Db250cm9sbGVyLnJlbmRlclNoaXBzKGNvbXB1dGVyQm9hcmQpO1xuICAvLyBkb21Db250cm9sbGVyLnJlbmRlclNoaXBzKHVzZXJCb2FyZCwgdXNlcik7XG4gIC8vIFN0YXJ0IHRoZSBnYW1lIGxvb3BcbiAgZ2FtZUxvb3AoKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGdhbWU7XG4iLCJpbXBvcnQgU2hpcCBmcm9tIFwiLi9zaGlwXCI7XG5cbmNvbnN0IEdhbWVCb2FyZCA9IChzaXplID0gMTApID0+IHtcbiAgY29uc3QgYm9hcmQgPSBbXTtcbiAgY29uc3QgbWlzc2VkU2hvdHMgPSBbXTtcbiAgY29uc3Qgc2hpcHMgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpICs9IDEpIHtcbiAgICBib2FyZC5wdXNoKFtdKTtcbiAgICBtaXNzZWRTaG90cy5wdXNoKFtdKTtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IHNpemU7IGogKz0gMSkge1xuICAgICAgYm9hcmRbaV0ucHVzaChudWxsKTtcbiAgICAgIG1pc3NlZFNob3RzW2ldLnB1c2goZmFsc2UpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGdldEJvYXJkID0gKCkgPT4gYm9hcmQ7XG4gIGNvbnN0IGdldE1pc3NlZFNob3RzID0gKCkgPT4gbWlzc2VkU2hvdHM7XG5cbiAgY29uc3QgaXNQb3NpdGlvbk91dE9mQm91bmRzID0gKHJvdywgY29sdW1uKSA9PlxuICAgIHJvdyA8IDAgfHwgY29sdW1uIDwgMCB8fCByb3cgPj0gc2l6ZSB8fCBjb2x1bW4gPj0gc2l6ZTtcblxuICBjb25zdCBpc1NoaXBFbmRPdXRPZkJvdW5kcyA9IChyb3csIGNvbHVtbiwgc2hpcCkgPT4ge1xuICAgIGlmIChzaGlwLmdldElzVmVydGljYWwoKSkgcmV0dXJuIHJvdyArIHNoaXAuZ2V0TGVuZ3RoKCkgPj0gc2l6ZTtcbiAgICByZXR1cm4gY29sdW1uICsgc2hpcC5nZXRMZW5ndGgoKSA+PSBzaXplO1xuICB9O1xuXG4gIGNvbnN0IGlzUG9zaXRpb25UYWtlbiA9IChyb3csIGNvbHVtbiwgc2hpcCkgPT4ge1xuICAgIGlmIChzaGlwLmdldElzVmVydGljYWwoKSkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmdldExlbmd0aCgpOyBpICs9IDEpIHtcbiAgICAgICAgaWYgKGJvYXJkW3JvdyArIGldW2NvbHVtbl0gIT09IG51bGwpIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAuZ2V0TGVuZ3RoKCk7IGkgKz0gMSkge1xuICAgICAgICBpZiAoYm9hcmRbcm93XVtjb2x1bW4gKyBpXSAhPT0gbnVsbCkgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICBjb25zdCBpc05laWdoYm9yVGFrZW4gPSAocm93LCBjb2x1bW4sIHNoaXApID0+IHtcbiAgICBpZiAoc2hpcC5nZXRJc1ZlcnRpY2FsKCkpIHtcbiAgICAgIGZvciAobGV0IGkgPSByb3cgLSAxOyBpIDw9IHJvdyArIHNoaXAuZ2V0TGVuZ3RoKCk7IGkgKz0gMSkge1xuICAgICAgICBmb3IgKGxldCBqID0gY29sdW1uIC0gMTsgaiA8PSBjb2x1bW4gKyAxOyBqICs9IDEpIHtcbiAgICAgICAgICBpZiAoIWlzUG9zaXRpb25PdXRPZkJvdW5kcyhpLCBqKSAmJiBib2FyZFtpXVtqXSkgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChsZXQgaSA9IHJvdyAtIDE7IGkgPD0gcm93ICsgMTsgaSArPSAxKSB7XG4gICAgICAgIGZvciAobGV0IGogPSBjb2x1bW4gLSAxOyBqIDw9IGNvbHVtbiArIHNoaXAuZ2V0TGVuZ3RoKCk7IGogKz0gMSkge1xuICAgICAgICAgIGlmICghaXNQb3NpdGlvbk91dE9mQm91bmRzKGksIGopICYmIGJvYXJkW2ldW2pdKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgY29uc3QgaXNWYWxpZFBvc2l0aW9uID0gKHJvdywgY29sdW1uLCBzaGlwKSA9PiB7XG4gICAgaWYgKGlzUG9zaXRpb25PdXRPZkJvdW5kcyhyb3csIGNvbHVtbikpIHJldHVybiBmYWxzZTtcbiAgICBpZiAoaXNTaGlwRW5kT3V0T2ZCb3VuZHMocm93LCBjb2x1bW4sIHNoaXApKSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKGlzUG9zaXRpb25UYWtlbihyb3csIGNvbHVtbiwgc2hpcCkpIHJldHVybiBmYWxzZTtcbiAgICBpZiAoaXNOZWlnaGJvclRha2VuKHJvdywgY29sdW1uLCBzaGlwKSkgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIGNvbnN0IHBsYWNlU2hpcCA9IChyb3csIGNvbHVtbiwgc2hpcCkgPT4ge1xuICAgIGlmICghaXNWYWxpZFBvc2l0aW9uKHJvdywgY29sdW1uLCBzaGlwKSkgcmV0dXJuIGZhbHNlO1xuICAgIGlmIChzaGlwLmdldElzVmVydGljYWwoKSkge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmdldExlbmd0aCgpOyBpICs9IDEpIHtcbiAgICAgICAgYm9hcmRbcm93ICsgaV1bY29sdW1uXSA9IHNoaXA7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5nZXRMZW5ndGgoKTsgaSArPSAxKSB7XG4gICAgICAgIGJvYXJkW3Jvd11bY29sdW1uICsgaV0gPSBzaGlwO1xuICAgICAgfVxuICAgIH1cbiAgICBzaGlwcy5wdXNoKHNoaXApO1xuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIGNvbnN0IHBsYWNlUmFuZG9tU2hpcHMgPSAoKSA9PiB7XG4gICAgY29uc3Qgc2hpcExlbmd0aHMgPSBbNSwgNCwgMywgMywgMl07XG5cbiAgICBzaGlwTGVuZ3Rocy5mb3JFYWNoKChsZW5ndGgpID0+IHtcbiAgICAgIGxldCBpc1NoaXBQbGFjZWQgPSBmYWxzZTtcblxuICAgICAgd2hpbGUgKCFpc1NoaXBQbGFjZWQpIHtcbiAgICAgICAgY29uc3QgaXNWZXJ0aWNhbCA9IE1hdGgucmFuZG9tKCkgPCAwLjU7XG4gICAgICAgIGNvbnN0IHJvdyA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHNpemUpO1xuICAgICAgICBjb25zdCBjb2x1bW4gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBzaXplKTtcbiAgICAgICAgY29uc3QgbmV3U2hpcCA9IFNoaXAobGVuZ3RoLCBpc1ZlcnRpY2FsKTtcblxuICAgICAgICBpZiAoaXNWYWxpZFBvc2l0aW9uKHJvdywgY29sdW1uLCBuZXdTaGlwKSkge1xuICAgICAgICAgIHBsYWNlU2hpcChyb3csIGNvbHVtbiwgbmV3U2hpcCk7XG4gICAgICAgICAgaXNTaGlwUGxhY2VkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IHJlY2lldmVBdHRhY2sgPSAocm93LCBjb2x1bW4pID0+IHtcbiAgICBpZiAoaXNQb3NpdGlvbk91dE9mQm91bmRzKHJvdywgY29sdW1uKSkgcmV0dXJuIGZhbHNlO1xuICAgIGlmIChib2FyZFtyb3ddW2NvbHVtbl0pIHtcbiAgICAgIGJvYXJkW3Jvd11bY29sdW1uXS5oaXQoKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBtaXNzZWRTaG90c1tyb3ddW2NvbHVtbl0gPSB0cnVlO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfTtcblxuICBjb25zdCBpc0FsbFNoaXBzU3VuayA9ICgpID0+IHNoaXBzLmV2ZXJ5KChzaGlwKSA9PiBzaGlwLmlzU3VuaygpID09PSB0cnVlKTtcblxuICByZXR1cm4ge1xuICAgIGdldEJvYXJkLFxuICAgIHBsYWNlU2hpcCxcbiAgICBwbGFjZVJhbmRvbVNoaXBzLFxuICAgIHJlY2lldmVBdHRhY2ssXG4gICAgZ2V0TWlzc2VkU2hvdHMsXG4gICAgaXNBbGxTaGlwc1N1bmssXG4gIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBHYW1lQm9hcmQ7XG4iLCJjb25zdCBQbGF5ZXIgPSAobmFtZSkgPT4ge1xuICBjb25zdCBoaXRSZWNvcmQgPSBuZXcgU2V0KCk7XG5cbiAgY29uc3QgaGFzQWxyZWF5SGl0ID0gKHJvdywgY29sdW1uKSA9PiBoaXRSZWNvcmQuaGFzKGAke3Jvd30tJHtjb2x1bW59YCk7XG5cbiAgY29uc3QgaXNJbnZhbGlkUG9zaXRpb24gPSAocm93LCBjb2x1bW4sIHNpemUpID0+XG4gICAgcm93IDwgMCB8fCBjb2x1bW4gPCAwIHx8IHJvdyA+PSBzaXplIHx8IGNvbHVtbiA+PSBzaXplO1xuXG4gIGNvbnN0IGdldFJhbmRvbVBvc2l0aW9uID0gKGdhbWVCb2FyZCkgPT5cbiAgICBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBnYW1lQm9hcmQuZ2V0Qm9hcmQoKS5sZW5ndGgpO1xuXG4gIGNvbnN0IGdldE5hbWUgPSAoKSA9PiBuYW1lO1xuXG4gIGNvbnN0IGF0dGFjayA9IChyb3csIGNvbHVtbiwgZ2FtZUJvYXJkKSA9PiB7XG4gICAgaWYgKGhhc0FscmVheUhpdChyb3csIGNvbHVtbikpIHJldHVybiBmYWxzZTtcbiAgICBpZiAoIWlzSW52YWxpZFBvc2l0aW9uKHJvdywgY29sdW1uLCBnYW1lQm9hcmQuZ2V0Qm9hcmQoKS5sZW5ndGgpKSB7XG4gICAgICBnYW1lQm9hcmQucmVjaWV2ZUF0dGFjayhyb3csIGNvbHVtbik7XG4gICAgICBoaXRSZWNvcmQuYWRkKGAke3Jvd30tJHtjb2x1bW59YCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIGNvbnN0IHJhbmRvbUF0dGFjayA9IChnYW1lQm9hcmQpID0+IHtcbiAgICBpZiAoaGl0UmVjb3JkLnNpemUgPT09IDEwMCkgcmV0dXJuIGZhbHNlO1xuICAgIGxldCByYW5kb21Sb3cgPSBnZXRSYW5kb21Qb3NpdGlvbihnYW1lQm9hcmQpO1xuICAgIGxldCByYW5kb21Db2wgPSBnZXRSYW5kb21Qb3NpdGlvbihnYW1lQm9hcmQpO1xuXG4gICAgd2hpbGUgKGhhc0FscmVheUhpdChyYW5kb21Sb3csIHJhbmRvbUNvbCkpIHtcbiAgICAgIHJhbmRvbVJvdyA9IGdldFJhbmRvbVBvc2l0aW9uKGdhbWVCb2FyZCk7XG4gICAgICByYW5kb21Db2wgPSBnZXRSYW5kb21Qb3NpdGlvbihnYW1lQm9hcmQpO1xuICAgIH1cbiAgICBnYW1lQm9hcmQucmVjaWV2ZUF0dGFjayhyYW5kb21Sb3csIHJhbmRvbUNvbCk7XG4gICAgaGl0UmVjb3JkLmFkZChgJHtyYW5kb21Sb3d9LSR7cmFuZG9tQ29sfWApO1xuICAgIHJldHVybiBbcmFuZG9tUm93LCByYW5kb21Db2xdO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgZ2V0TmFtZSxcbiAgICBhdHRhY2ssXG4gICAgcmFuZG9tQXR0YWNrLFxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgUGxheWVyO1xuIiwiY29uc3QgU2hpcCA9IChsZW5ndGgsIGlzVmVydGljYWwgPSBmYWxzZSkgPT4ge1xuICBsZXQgaGl0cyA9IDA7XG5cbiAgY29uc3QgZ2V0TGVuZ3RoID0gKCkgPT4gbGVuZ3RoO1xuICBjb25zdCBnZXRJc1ZlcnRpY2FsID0gKCkgPT4gaXNWZXJ0aWNhbDtcbiAgY29uc3QgZ2V0SGl0cyA9ICgpID0+IGhpdHM7XG4gIGNvbnN0IGlzU3VuayA9ICgpID0+IGhpdHMgPT09IGxlbmd0aDtcbiAgY29uc3QgaGl0ID0gKCkgPT4ge1xuICAgIGlmIChoaXRzIDwgbGVuZ3RoKSBoaXRzICs9IDE7XG4gIH07XG4gIHJldHVybiB7XG4gICAgZ2V0TGVuZ3RoLFxuICAgIGdldElzVmVydGljYWwsXG4gICAgZ2V0SGl0cyxcbiAgICBpc1N1bmssXG4gICAgaGl0LFxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgU2hpcDtcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGAqLFxuKjo6YmVmb3JlLFxuKjo6YWZ0ZXIge1xuICBtYXJnaW46IDA7XG4gIHBhZGRpbmc6IDA7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG59XG5cbmh0bWwsXG5ib2R5IHtcbiAgaGVpZ2h0OiAxMDAlO1xuICB3aWR0aDogMTAwJTtcbn1cblxuLmJvYXJkcyB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xufVxuXG4uYm9hcmQge1xuICB3aWR0aDogbWF4LWNvbnRlbnQ7XG59XG5cbi5yb3cge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogcm93O1xufVxuXG4uY2VsbCB7XG4gIHdpZHRoOiAycmVtO1xuICBhc3BlY3QtcmF0aW86IDE7XG4gIGJvcmRlcjogMXB4IHNvbGlkIGJsdWU7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbn1cblxuLnNoaXAge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiBncmVlbjtcbn1cblxuLm1pc3NlZCB7XG4gIGJhY2tncm91bmQtY29sb3I6IGFxdWE7XG59XG5cbi5oaXQge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZWQ7XG59XG5cbi53aW5uZXJNb2RhbCB7XG4gIHBhZGRpbmc6IDJyZW0gNXJlbTtcbiAgb3V0bGluZTogbm9uZTtcbiAgYm9yZGVyOiBub25lO1xuICBtYXJnaW46IGF1dG87XG4gIGJvcmRlci1yYWRpdXM6IDFyZW07XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgZ2FwOiAxcmVtO1xufVxuXG4ud2lubmVyTWVzc2FnZSB7XG4gIGZvbnQtc2l6ZTogMS41cmVtO1xuICBmb250LXdlaWdodDogYm9sZDtcbn1cblxuLndpbm5lck1vZGFsIC5yZXN0YXJ0QnRuIHtcbiAgZm9udC1zaXplOiAxcmVtO1xuICBwYWRkaW5nOiAwLjVyZW0gMS41cmVtO1xuICBib3JkZXItcmFkaXVzOiAxcmVtO1xuICBib3JkZXI6IG5vbmU7XG4gIG91dGxpbmU6IG5vbmU7XG4gIGN1cnNvcjogcG9pbnRlcjtcbn1gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9zdHlsZXMvc3R5bGVzLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTs7O0VBR0UsU0FBUztFQUNULFVBQVU7RUFDVixzQkFBc0I7QUFDeEI7O0FBRUE7O0VBRUUsWUFBWTtFQUNaLFdBQVc7QUFDYjs7QUFFQTtFQUNFLGFBQWE7RUFDYiw2QkFBNkI7QUFDL0I7O0FBRUE7RUFDRSxrQkFBa0I7QUFDcEI7O0FBRUE7RUFDRSxhQUFhO0VBQ2IsbUJBQW1CO0FBQ3JCOztBQUVBO0VBQ0UsV0FBVztFQUNYLGVBQWU7RUFDZixzQkFBc0I7RUFDdEIsa0JBQWtCO0FBQ3BCOztBQUVBO0VBQ0UsdUJBQXVCO0FBQ3pCOztBQUVBO0VBQ0Usc0JBQXNCO0FBQ3hCOztBQUVBO0VBQ0UscUJBQXFCO0FBQ3ZCOztBQUVBO0VBQ0Usa0JBQWtCO0VBQ2xCLGFBQWE7RUFDYixZQUFZO0VBQ1osWUFBWTtFQUNaLG1CQUFtQjtFQUNuQixhQUFhO0VBQ2Isc0JBQXNCO0VBQ3RCLGtCQUFrQjtFQUNsQixTQUFTO0FBQ1g7O0FBRUE7RUFDRSxpQkFBaUI7RUFDakIsaUJBQWlCO0FBQ25COztBQUVBO0VBQ0UsZUFBZTtFQUNmLHNCQUFzQjtFQUN0QixtQkFBbUI7RUFDbkIsWUFBWTtFQUNaLGFBQWE7RUFDYixlQUFlO0FBQ2pCXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIiosXFxuKjo6YmVmb3JlLFxcbio6OmFmdGVyIHtcXG4gIG1hcmdpbjogMDtcXG4gIHBhZGRpbmc6IDA7XFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbn1cXG5cXG5odG1sLFxcbmJvZHkge1xcbiAgaGVpZ2h0OiAxMDAlO1xcbiAgd2lkdGg6IDEwMCU7XFxufVxcblxcbi5ib2FyZHMge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcbn1cXG5cXG4uYm9hcmQge1xcbiAgd2lkdGg6IG1heC1jb250ZW50O1xcbn1cXG5cXG4ucm93IHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogcm93O1xcbn1cXG5cXG4uY2VsbCB7XFxuICB3aWR0aDogMnJlbTtcXG4gIGFzcGVjdC1yYXRpbzogMTtcXG4gIGJvcmRlcjogMXB4IHNvbGlkIGJsdWU7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxufVxcblxcbi5zaGlwIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IGdyZWVuO1xcbn1cXG5cXG4ubWlzc2VkIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IGFxdWE7XFxufVxcblxcbi5oaXQge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmVkO1xcbn1cXG5cXG4ud2lubmVyTW9kYWwge1xcbiAgcGFkZGluZzogMnJlbSA1cmVtO1xcbiAgb3V0bGluZTogbm9uZTtcXG4gIGJvcmRlcjogbm9uZTtcXG4gIG1hcmdpbjogYXV0bztcXG4gIGJvcmRlci1yYWRpdXM6IDFyZW07XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGdhcDogMXJlbTtcXG59XFxuXFxuLndpbm5lck1lc3NhZ2Uge1xcbiAgZm9udC1zaXplOiAxLjVyZW07XFxuICBmb250LXdlaWdodDogYm9sZDtcXG59XFxuXFxuLndpbm5lck1vZGFsIC5yZXN0YXJ0QnRuIHtcXG4gIGZvbnQtc2l6ZTogMXJlbTtcXG4gIHBhZGRpbmc6IDAuNXJlbSAxLjVyZW07XFxuICBib3JkZXItcmFkaXVzOiAxcmVtO1xcbiAgYm9yZGVyOiBub25lO1xcbiAgb3V0bGluZTogbm9uZTtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG59XCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xuICB2YXIgbGlzdCA9IFtdO1xuXG4gIC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBpdGVtWzVdICE9PSBcInVuZGVmaW5lZFwiO1xuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KS5qb2luKFwiXCIpO1xuICB9O1xuXG4gIC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG4gIGxpc3QuaSA9IGZ1bmN0aW9uIGkobW9kdWxlcywgbWVkaWEsIGRlZHVwZSwgc3VwcG9ydHMsIGxheWVyKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcbiAgICB9XG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRoaXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIGlkID0gdGhpc1trXVswXTtcbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG4gICAgICBpZiAoZGVkdXBlICYmIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGxheWVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVs1XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzdXBwb3J0cykge1xuICAgICAgICBpZiAoIWl0ZW1bNF0pIHtcbiAgICAgICAgICBpdGVtWzRdID0gXCJcIi5jb25jYXQoc3VwcG9ydHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs0XSA9IHN1cHBvcnRzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGNvbnRlbnQgPSBpdGVtWzFdO1xuICB2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG4gIGlmICghY3NzTWFwcGluZykge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG4gIGlmICh0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGNzc01hcHBpbmcpKSkpO1xuICAgIHZhciBkYXRhID0gXCJzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIi5jb25jYXQoYmFzZTY0KTtcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IFwiLyojIFwiLmNvbmNhdChkYXRhLCBcIiAqL1wiKTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oXCJcXG5cIik7XG4gIH1cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xufTsiLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGVzLmNzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGVzLmNzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3R5bGVzSW5ET00gPSBbXTtcbmZ1bmN0aW9uIGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpIHtcbiAgdmFyIHJlc3VsdCA9IC0xO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlc0luRE9NLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN0eWxlc0luRE9NW2ldLmlkZW50aWZpZXIgPT09IGlkZW50aWZpZXIpIHtcbiAgICAgIHJlc3VsdCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbmZ1bmN0aW9uIG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKSB7XG4gIHZhciBpZENvdW50TWFwID0ge307XG4gIHZhciBpZGVudGlmaWVycyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV07XG4gICAgdmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG4gICAgdmFyIGNvdW50ID0gaWRDb3VudE1hcFtpZF0gfHwgMDtcbiAgICB2YXIgaWRlbnRpZmllciA9IFwiXCIuY29uY2F0KGlkLCBcIiBcIikuY29uY2F0KGNvdW50KTtcbiAgICBpZENvdW50TWFwW2lkXSA9IGNvdW50ICsgMTtcbiAgICB2YXIgaW5kZXhCeUlkZW50aWZpZXIgPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICB2YXIgb2JqID0ge1xuICAgICAgY3NzOiBpdGVtWzFdLFxuICAgICAgbWVkaWE6IGl0ZW1bMl0sXG4gICAgICBzb3VyY2VNYXA6IGl0ZW1bM10sXG4gICAgICBzdXBwb3J0czogaXRlbVs0XSxcbiAgICAgIGxheWVyOiBpdGVtWzVdXG4gICAgfTtcbiAgICBpZiAoaW5kZXhCeUlkZW50aWZpZXIgIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHVwZGF0ZXIgPSBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKTtcbiAgICAgIG9wdGlvbnMuYnlJbmRleCA9IGk7XG4gICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoaSwgMCwge1xuICAgICAgICBpZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuICAgICAgICB1cGRhdGVyOiB1cGRhdGVyLFxuICAgICAgICByZWZlcmVuY2VzOiAxXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgfVxuICByZXR1cm4gaWRlbnRpZmllcnM7XG59XG5mdW5jdGlvbiBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKSB7XG4gIHZhciBhcGkgPSBvcHRpb25zLmRvbUFQSShvcHRpb25zKTtcbiAgYXBpLnVwZGF0ZShvYmopO1xuICB2YXIgdXBkYXRlciA9IGZ1bmN0aW9uIHVwZGF0ZXIobmV3T2JqKSB7XG4gICAgaWYgKG5ld09iaikge1xuICAgICAgaWYgKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcCAmJiBuZXdPYmouc3VwcG9ydHMgPT09IG9iai5zdXBwb3J0cyAmJiBuZXdPYmoubGF5ZXIgPT09IG9iai5sYXllcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBhcGkudXBkYXRlKG9iaiA9IG5ld09iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwaS5yZW1vdmUoKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiB1cGRhdGVyO1xufVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGlzdCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgbGlzdCA9IGxpc3QgfHwgW107XG4gIHZhciBsYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucyk7XG4gIHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuICAgIG5ld0xpc3QgPSBuZXdMaXN0IHx8IFtdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tpXTtcbiAgICAgIHZhciBpbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhdLnJlZmVyZW5jZXMtLTtcbiAgICB9XG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIF9pZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW19pXTtcbiAgICAgIHZhciBfaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihfaWRlbnRpZmllcik7XG4gICAgICBpZiAoc3R5bGVzSW5ET01bX2luZGV4XS5yZWZlcmVuY2VzID09PSAwKSB7XG4gICAgICAgIHN0eWxlc0luRE9NW19pbmRleF0udXBkYXRlcigpO1xuICAgICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoX2luZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgbGFzdElkZW50aWZpZXJzID0gbmV3TGFzdElkZW50aWZpZXJzO1xuICB9O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIG1lbW8gPSB7fTtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBnZXRUYXJnZXQodGFyZ2V0KSB7XG4gIGlmICh0eXBlb2YgbWVtb1t0YXJnZXRdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgdmFyIHN0eWxlVGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpO1xuXG4gICAgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcbiAgICBpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuICAgICAgICAvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuICAgICAgICBzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICBzdHlsZVRhcmdldCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuICAgIG1lbW9bdGFyZ2V0XSA9IHN0eWxlVGFyZ2V0O1xuICB9XG4gIHJldHVybiBtZW1vW3RhcmdldF07XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0QnlTZWxlY3RvcihpbnNlcnQsIHN0eWxlKSB7XG4gIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQoaW5zZXJ0KTtcbiAgaWYgKCF0YXJnZXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydCcgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuICB9XG4gIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydEJ5U2VsZWN0b3I7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gIG9wdGlvbnMuc2V0QXR0cmlidXRlcyhlbGVtZW50LCBvcHRpb25zLmF0dHJpYnV0ZXMpO1xuICBvcHRpb25zLmluc2VydChlbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xuICByZXR1cm4gZWxlbWVudDtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0U3R5bGVFbGVtZW50OyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcyhzdHlsZUVsZW1lbnQpIHtcbiAgdmFyIG5vbmNlID0gdHlwZW9mIF9fd2VicGFja19ub25jZV9fICE9PSBcInVuZGVmaW5lZFwiID8gX193ZWJwYWNrX25vbmNlX18gOiBudWxsO1xuICBpZiAobm9uY2UpIHtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgbm9uY2UpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlczsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaikge1xuICB2YXIgY3NzID0gXCJcIjtcbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KG9iai5zdXBwb3J0cywgXCIpIHtcIik7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpO1xuICB9XG4gIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2Ygb2JqLmxheWVyICE9PSBcInVuZGVmaW5lZFwiO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwiQGxheWVyXCIuY29uY2F0KG9iai5sYXllci5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KG9iai5sYXllcikgOiBcIlwiLCBcIiB7XCIpO1xuICB9XG4gIGNzcyArPSBvYmouY3NzO1xuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICB2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcbiAgaWYgKHNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIuY29uY2F0KGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSksIFwiICovXCIpO1xuICB9XG5cbiAgLy8gRm9yIG9sZCBJRVxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgICovXG4gIG9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG59XG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XG4gIC8vIGlzdGFuYnVsIGlnbm9yZSBpZlxuICBpZiAoc3R5bGVFbGVtZW50LnBhcmVudE5vZGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBkb21BUEkob3B0aW9ucykge1xuICBpZiAodHlwZW9mIGRvY3VtZW50ID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKCkge30sXG4gICAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHt9XG4gICAgfTtcbiAgfVxuICB2YXIgc3R5bGVFbGVtZW50ID0gb3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG4gIHJldHVybiB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUob2JqKSB7XG4gICAgICBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaik7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuICAgIH1cbiAgfTtcbn1cbm1vZHVsZS5leHBvcnRzID0gZG9tQVBJOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50KSB7XG4gIGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XG4gICAgICBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgIH1cbiAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc3R5bGVUYWdUcmFuc2Zvcm07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubmMgPSB1bmRlZmluZWQ7IiwiaW1wb3J0IFwiLi9zdHlsZXMvc3R5bGVzLmNzc1wiO1xuaW1wb3J0IGdhbWUgZnJvbSBcIi4vbW9kdWxlcy9nYW1lXCI7XG5cbmdhbWUoKTsiXSwibmFtZXMiOlsiRE9NY29udHJvbGxlciIsImNyZWF0ZUNlbGwiLCJyb3dJbmRleCIsImNvbHVtbkluZGV4IiwiY2VsbCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTGlzdCIsImFkZCIsInNldEF0dHJpYnV0ZSIsImNyZWF0ZVJvdyIsInJvd0FycmF5Iiwicm93IiwiZm9yRWFjaCIsIl8iLCJjb2x1bW4iLCJhcHBlbmRDaGlsZCIsInJlbmRlckdhbWVCb2FyZCIsImdhbWVCb2FyZCIsImJvYXJkQXJyYXkiLCJnZXRCb2FyZCIsImJvYXJkIiwicmVuZGVyU2hpcHMiLCJib2FyZENvbnRhaW5lciIsInF1ZXJ5U2VsZWN0b3IiLCJjZWxsVmFsdWUiLCJpbml0aWFsaXplUmVzdGFydEJ0biIsInJlc3RhcnRCdG4iLCJhZGRFdmVudExpc3RlbmVyIiwid2luZG93IiwibG9jYXRpb24iLCJyZWxvYWQiLCJnZXRVc2VyTW92ZSIsIlByb21pc2UiLCJyZXNvbHZlIiwidXNlckJvYXJkQ29udGFpbmVyIiwiaGFuZGxlQ2xpY2siLCJldmVudCIsInRhcmdldCIsImNsb3Nlc3QiLCJwYXJzZUludCIsImdldEF0dHJpYnV0ZSIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJoYW5kbGVDZWxsVXBkYXRlIiwiY29vcmRzIiwibWlzc2VkU2hvdHMiLCJwbGF5ZXIiLCJnZXROYW1lIiwiaXNIaXQiLCJzaG93V2lubmVyIiwid2lubmVyIiwid2lubmVyTW9kYWwiLCJ3aW5uZXJNZXNzYWdlIiwidGV4dENvbnRlbnQiLCJzaG93TW9kYWwiLCJHYW1lQm9hcmQiLCJQbGF5ZXIiLCJnYW1lIiwidXNlciIsImNvbXB1dGVyIiwidXNlckJvYXJkIiwiY29tcHV0ZXJCb2FyZCIsImRvbUNvbnRyb2xsZXIiLCJjb21wdXRlckJvYXJkQ29udGFpbmVyIiwicGxheVR1cm4iLCJ1c2VyQ2VsbENvb3JkcyIsInVzZXJBdHRhY2tTdWNjZXNzIiwiYXR0YWNrIiwiZ2V0TWlzc2VkU2hvdHMiLCJjb21wdXRlckNlbGxDb29yZHMiLCJyYW5kb21BdHRhY2siLCJjaGVja0Zvcldpbm5lciIsImlzQWxsU2hpcHNTdW5rIiwiZ2FtZUxvb3AiLCJwbGFjZVJhbmRvbVNoaXBzIiwiU2hpcCIsInNpemUiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJ1bmRlZmluZWQiLCJzaGlwcyIsImkiLCJwdXNoIiwiaiIsImlzUG9zaXRpb25PdXRPZkJvdW5kcyIsImlzU2hpcEVuZE91dE9mQm91bmRzIiwic2hpcCIsImdldElzVmVydGljYWwiLCJnZXRMZW5ndGgiLCJpc1Bvc2l0aW9uVGFrZW4iLCJpc05laWdoYm9yVGFrZW4iLCJpc1ZhbGlkUG9zaXRpb24iLCJwbGFjZVNoaXAiLCJzaGlwTGVuZ3RocyIsImlzU2hpcFBsYWNlZCIsImlzVmVydGljYWwiLCJNYXRoIiwicmFuZG9tIiwiZmxvb3IiLCJuZXdTaGlwIiwicmVjaWV2ZUF0dGFjayIsImhpdCIsImV2ZXJ5IiwiaXNTdW5rIiwibmFtZSIsImhpdFJlY29yZCIsIlNldCIsImhhc0FscmVheUhpdCIsImhhcyIsImlzSW52YWxpZFBvc2l0aW9uIiwiZ2V0UmFuZG9tUG9zaXRpb24iLCJyYW5kb21Sb3ciLCJyYW5kb21Db2wiLCJoaXRzIiwiZ2V0SGl0cyJdLCJzb3VyY2VSb290IjoiIn0=