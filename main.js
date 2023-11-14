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

  // Function to check for winner
  const checkForWinner = (userBoard, computerBoard) => {
    if (userBoard.isAllShipsSunk()) {
      console.log("User wins! All computer ships are sunk.");
    } else if (computerBoard.isAllShipsSunk()) {
      console.log("Computer wins! All user ships are sunk.");
    }
  };
  return {
    renderGameBoard,
    getUserMove,
    handleCellUpdate,
    checkForWinner
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
/* harmony import */ var _ship__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ship */ "./src/modules/ship.js");




const game = () => {
  const user = (0,_player__WEBPACK_IMPORTED_MODULE_2__["default"])("user");
  const computer = (0,_player__WEBPACK_IMPORTED_MODULE_2__["default"])("computer");
  const userBoard = (0,_gameBoard__WEBPACK_IMPORTED_MODULE_1__["default"])();
  const computerBoard = (0,_gameBoard__WEBPACK_IMPORTED_MODULE_1__["default"])();
  const domController = (0,_DOMcontroller__WEBPACK_IMPORTED_MODULE_0__["default"])();
  const newShip = (0,_ship__WEBPACK_IMPORTED_MODULE_3__["default"])(3);
  userBoard.placeShip(2, 2, newShip);
  const newShip2 = (0,_ship__WEBPACK_IMPORTED_MODULE_3__["default"])(3);
  computerBoard.placeShip(4, 2, newShip2);
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
    domController.checkForWinner(userBoard, computerBoard);
  };

  // Game loop
  const gameLoop = async () => {
    // Exit condition
    while (!userBoard.isAllShipsSunk() && !computerBoard.isAllShipsSunk()) {
      // eslint-disable-next-line no-await-in-loop
      await playTurn();
    }
  };

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
  const isShipEndOutOfBounds = (row, column, ship, isVertical) => {
    if (isVertical) return row + ship.getLength() >= size;
    return column + ship.getLength() >= size;
  };
  const isPositionTaken = (row, column, ship, isVertical) => {
    if (isVertical) {
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
  const isNeighborTaken = (row, column, ship, isVertical) => {
    if (isVertical) {
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
  const isValidPosition = (row, column, ship, isVertical) => {
    if (isPositionOutOfBounds(row, column)) return false;
    if (isShipEndOutOfBounds(row, column, ship, isVertical)) return false;
    if (isPositionTaken(row, column, ship, isVertical)) return false;
    if (isNeighborTaken(row, column, ship, isVertical)) return false;
    return true;
  };
  const placeShip = function (row, column, ship) {
    let isVertical = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
    if (!isValidPosition(row, column, ship, isVertical)) return false;
    if (isVertical) {
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
const Ship = length => {
  let hits = 0;
  const getLength = () => length;
  const getHits = () => hits;
  const isSunk = () => hits === length;
  const hit = () => {
    if (hits < length) hits += 1;
  };
  return {
    getLength,
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

.missed {
  background-color: aqua;
}

.hit {
  background-color: red;
}`, "",{"version":3,"sources":["webpack://./src/styles/styles.css"],"names":[],"mappings":"AAAA;;;EAGE,SAAS;EACT,UAAU;EACV,sBAAsB;AACxB;;AAEA;;EAEE,YAAY;EACZ,WAAW;AACb;;AAEA;EACE,aAAa;EACb,6BAA6B;AAC/B;;AAEA;EACE,kBAAkB;AACpB;;AAEA;EACE,aAAa;EACb,mBAAmB;AACrB;;AAEA;EACE,WAAW;EACX,eAAe;EACf,sBAAsB;EACtB,kBAAkB;AACpB;;AAEA;EACE,sBAAsB;AACxB;;AAEA;EACE,qBAAqB;AACvB","sourcesContent":["*,\n*::before,\n*::after {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\nhtml,\nbody {\n  height: 100%;\n  width: 100%;\n}\n\n.boards {\n  display: flex;\n  justify-content: space-around;\n}\n\n.board {\n  width: max-content;\n}\n\n.row {\n  display: flex;\n  flex-direction: row;\n}\n\n.cell {\n  width: 2rem;\n  aspect-ratio: 1;\n  border: 1px solid blue;\n  text-align: center;\n}\n\n.missed {\n  background-color: aqua;\n}\n\n.hit {\n  background-color: red;\n}"],"sourceRoot":""}]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QWlGO0FBQ2pGO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EseURBQXlEO0FBQ3pEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0M7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDNURhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7VUNiQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7V0NOQTs7Ozs7Ozs7Ozs7OztBQ0E2QjtBQUNLO0FBRWxDQyx5REFBSSxDQUFDLENBQUMsQyIsInNvdXJjZXMiOlsid2VicGFjazovL2JhdHRsZXNoaXBzLy4vc3JjL21vZHVsZXMvRE9NY29udHJvbGxlci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy8uL3NyYy9tb2R1bGVzL2dhbWUuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcHMvLi9zcmMvbW9kdWxlcy9nYW1lQm9hcmQuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcHMvLi9zcmMvbW9kdWxlcy9wbGF5ZXIuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcHMvLi9zcmMvbW9kdWxlcy9zaGlwLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXBzLy4vc3JjL3N0eWxlcy9zdHlsZXMuY3NzIiwid2VicGFjazovL2JhdHRsZXNoaXBzLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXBzLy4vc3JjL3N0eWxlcy9zdHlsZXMuY3NzP2U0NWIiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcHMvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcHMvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXBzLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzIiwid2VicGFjazovL2JhdHRsZXNoaXBzLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXBzLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcHMvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcHMvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2JhdHRsZXNoaXBzL3dlYnBhY2svcnVudGltZS9ub25jZSIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBET01jb250cm9sbGVyID0gKCkgPT4ge1xuICAvLyBGdW5jdGlvbiB0byBjcmVhdGUgYSBzaW5nbGUgY2VsbFxuICBjb25zdCBjcmVhdGVDZWxsID0gKHJvd0luZGV4LCBjb2x1bW5JbmRleCkgPT4ge1xuICAgIGNvbnN0IGNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIGNlbGwuY2xhc3NMaXN0LmFkZChcImNlbGxcIik7XG4gICAgY2VsbC5zZXRBdHRyaWJ1dGUoXCJyb3dcIiwgcm93SW5kZXgpO1xuICAgIGNlbGwuc2V0QXR0cmlidXRlKFwiY29sdW1uXCIsIGNvbHVtbkluZGV4KTtcbiAgICByZXR1cm4gY2VsbDtcbiAgfTtcblxuICAvLyBGdW5jdGlvbiB0byBjcmVhdGUgYSBzaW5nbGUgcm93XG4gIGNvbnN0IGNyZWF0ZVJvdyA9IChyb3dBcnJheSwgcm93SW5kZXgpID0+IHtcbiAgICBjb25zdCByb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgIHJvdy5jbGFzc0xpc3QuYWRkKFwicm93XCIpO1xuICAgIHJvd0FycmF5LmZvckVhY2goKF8sIGNvbHVtbikgPT4ge1xuICAgICAgY29uc3QgY2VsbCA9IGNyZWF0ZUNlbGwocm93SW5kZXgsIGNvbHVtbik7XG4gICAgICByb3cuYXBwZW5kQ2hpbGQoY2VsbCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJvdztcbiAgfTtcblxuICAvLyBGdW5jdGlvbiB0byByZW5kZXIgdGhlIGdhbWUgYm9hcmRcbiAgY29uc3QgcmVuZGVyR2FtZUJvYXJkID0gKGdhbWVCb2FyZCkgPT4ge1xuICAgIGNvbnN0IGJvYXJkQXJyYXkgPSBnYW1lQm9hcmQuZ2V0Qm9hcmQoKTtcbiAgICBjb25zdCBib2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgYm9hcmQuY2xhc3NMaXN0LmFkZChcImJvYXJkXCIpO1xuXG4gICAgYm9hcmRBcnJheS5mb3JFYWNoKChyb3dBcnJheSwgcm93SW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IHJvdyA9IGNyZWF0ZVJvdyhyb3dBcnJheSwgcm93SW5kZXgpO1xuICAgICAgYm9hcmQuYXBwZW5kQ2hpbGQocm93KTtcbiAgICB9KTtcbiAgICByZXR1cm4gYm9hcmQ7XG4gIH07XG5cbiAgLy8gRnVuY3Rpb24gdG8gZ2V0IHVzZXIgbW92ZVxuICBjb25zdCBnZXRVc2VyTW92ZSA9ICgpID0+XG4gICAgbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICAgIGNvbnN0IHVzZXJCb2FyZENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudXNlckJvYXJkQ29udGFpbmVyXCIpO1xuXG4gICAgICBjb25zdCBoYW5kbGVDbGljayA9IChldmVudCkgPT4ge1xuICAgICAgICBjb25zdCBjZWxsID0gZXZlbnQudGFyZ2V0LmNsb3Nlc3QoXCIuY2VsbFwiKTtcbiAgICAgICAgaWYgKGNlbGwpIHtcbiAgICAgICAgICBjb25zdCByb3cgPSBwYXJzZUludChjZWxsLmdldEF0dHJpYnV0ZShcInJvd1wiKSwgMTApO1xuICAgICAgICAgIGNvbnN0IGNvbHVtbiA9IHBhcnNlSW50KGNlbGwuZ2V0QXR0cmlidXRlKFwiY29sdW1uXCIpLCAxMCk7XG4gICAgICAgICAgdXNlckJvYXJkQ29udGFpbmVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBoYW5kbGVDbGljayk7XG4gICAgICAgICAgcmVzb2x2ZShbcm93LCBjb2x1bW5dKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgdXNlckJvYXJkQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBoYW5kbGVDbGljayk7XG4gICAgfSk7XG5cbiAgLy8gRnVuY3Rpb24gdG8gaGFuZGxlIGNlbGwgc3RhdGUgY2hhbmdlXG4gIGNvbnN0IGhhbmRsZUNlbGxVcGRhdGUgPSAoY29vcmRzLCBtaXNzZWRTaG90cywgcGxheWVyKSA9PiB7XG4gICAgY29uc3QgW3JvdywgY29sdW1uXSA9IGNvb3JkcztcbiAgICBsZXQgY2VsbDtcbiAgICBpZiAocGxheWVyLmdldE5hbWUoKSA9PT0gXCJ1c2VyXCIpIHtcbiAgICAgIGNlbGwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBgLnVzZXJCb2FyZENvbnRhaW5lciAucm93Om50aC1jaGlsZCgke3JvdyArIDF9KSAuY2VsbDpudGgtY2hpbGQoJHtcbiAgICAgICAgICBjb2x1bW4gKyAxXG4gICAgICAgIH0pYCxcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNlbGwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICBgLmNvbXB1dGVyQm9hcmRDb250YWluZXIgLnJvdzpudGgtY2hpbGQoJHtyb3cgKyAxfSkgLmNlbGw6bnRoLWNoaWxkKCR7XG4gICAgICAgICAgY29sdW1uICsgMVxuICAgICAgICB9KWAsXG4gICAgICApO1xuICAgIH1cbiAgICBjb25zdCBpc0hpdCA9ICFtaXNzZWRTaG90c1tyb3ddW2NvbHVtbl07XG5cbiAgICBjZWxsLmNsYXNzTGlzdC5hZGQoaXNIaXQgPyBcImhpdFwiIDogXCJtaXNzZWRcIik7XG4gIH07XG5cbiAgLy8gRnVuY3Rpb24gdG8gY2hlY2sgZm9yIHdpbm5lclxuICBjb25zdCBjaGVja0Zvcldpbm5lciA9ICh1c2VyQm9hcmQsIGNvbXB1dGVyQm9hcmQpID0+IHtcbiAgICBpZiAodXNlckJvYXJkLmlzQWxsU2hpcHNTdW5rKCkpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiVXNlciB3aW5zISBBbGwgY29tcHV0ZXIgc2hpcHMgYXJlIHN1bmsuXCIpO1xuICAgIH0gZWxzZSBpZiAoY29tcHV0ZXJCb2FyZC5pc0FsbFNoaXBzU3VuaygpKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIkNvbXB1dGVyIHdpbnMhIEFsbCB1c2VyIHNoaXBzIGFyZSBzdW5rLlwiKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICByZW5kZXJHYW1lQm9hcmQsXG4gICAgZ2V0VXNlck1vdmUsXG4gICAgaGFuZGxlQ2VsbFVwZGF0ZSxcbiAgICBjaGVja0Zvcldpbm5lcixcbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IERPTWNvbnRyb2xsZXI7XG4iLCJpbXBvcnQgRE9NY29udHJvbGxlciBmcm9tIFwiLi9ET01jb250cm9sbGVyXCI7XG5pbXBvcnQgR2FtZUJvYXJkIGZyb20gXCIuL2dhbWVCb2FyZFwiO1xuaW1wb3J0IFBsYXllciBmcm9tIFwiLi9wbGF5ZXJcIjtcbmltcG9ydCBTaGlwIGZyb20gXCIuL3NoaXBcIjtcblxuY29uc3QgZ2FtZSA9ICgpID0+IHtcbiAgY29uc3QgdXNlciA9IFBsYXllcihcInVzZXJcIik7XG4gIGNvbnN0IGNvbXB1dGVyID0gUGxheWVyKFwiY29tcHV0ZXJcIik7XG4gIGNvbnN0IHVzZXJCb2FyZCA9IEdhbWVCb2FyZCgpO1xuICBjb25zdCBjb21wdXRlckJvYXJkID0gR2FtZUJvYXJkKCk7XG4gIGNvbnN0IGRvbUNvbnRyb2xsZXIgPSBET01jb250cm9sbGVyKCk7XG4gIGNvbnN0IG5ld1NoaXAgPSBTaGlwKDMpO1xuICB1c2VyQm9hcmQucGxhY2VTaGlwKDIsIDIsIG5ld1NoaXApO1xuICBjb25zdCBuZXdTaGlwMiA9IFNoaXAoMyk7XG4gIGNvbXB1dGVyQm9hcmQucGxhY2VTaGlwKDQsIDIsIG5ld1NoaXAyKTtcblxuICBjb25zdCBjb21wdXRlckJvYXJkQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcbiAgICBcIi5jb21wdXRlckJvYXJkQ29udGFpbmVyXCIsXG4gICk7XG4gIGNvbnN0IHVzZXJCb2FyZENvbnRhaW5lciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIudXNlckJvYXJkQ29udGFpbmVyXCIpO1xuICBjb21wdXRlckJvYXJkQ29udGFpbmVyLmFwcGVuZENoaWxkKFxuICAgIGRvbUNvbnRyb2xsZXIucmVuZGVyR2FtZUJvYXJkKGNvbXB1dGVyQm9hcmQpLFxuICApO1xuICB1c2VyQm9hcmRDb250YWluZXIuYXBwZW5kQ2hpbGQoZG9tQ29udHJvbGxlci5yZW5kZXJHYW1lQm9hcmQodXNlckJvYXJkKSk7XG5cbiAgY29uc3QgcGxheVR1cm4gPSBhc3luYyAoKSA9PiB7XG4gICAgY29uc3QgdXNlckNlbGxDb29yZHMgPSBhd2FpdCBkb21Db250cm9sbGVyLmdldFVzZXJNb3ZlKCk7XG4gICAgY29uc3QgdXNlckF0dGFja1N1Y2Nlc3MgPSB1c2VyLmF0dGFjayhcbiAgICAgIHVzZXJDZWxsQ29vcmRzWzBdLFxuICAgICAgdXNlckNlbGxDb29yZHNbMV0sXG4gICAgICB1c2VyQm9hcmQsXG4gICAgKTtcblxuICAgIGlmICh1c2VyQXR0YWNrU3VjY2Vzcykge1xuICAgICAgZG9tQ29udHJvbGxlci5oYW5kbGVDZWxsVXBkYXRlKFxuICAgICAgICB1c2VyQ2VsbENvb3JkcyxcbiAgICAgICAgdXNlckJvYXJkLmdldE1pc3NlZFNob3RzKCksXG4gICAgICAgIHVzZXIsXG4gICAgICApO1xuICAgIH1cblxuICAgIGNvbnN0IGNvbXB1dGVyQ2VsbENvb3JkcyA9IGNvbXB1dGVyLnJhbmRvbUF0dGFjayhjb21wdXRlckJvYXJkKTtcblxuICAgIGRvbUNvbnRyb2xsZXIuaGFuZGxlQ2VsbFVwZGF0ZShcbiAgICAgIGNvbXB1dGVyQ2VsbENvb3JkcyxcbiAgICAgIGNvbXB1dGVyQm9hcmQuZ2V0TWlzc2VkU2hvdHMoKSxcbiAgICAgIGNvbXB1dGVyLFxuICAgICk7XG5cbiAgICBkb21Db250cm9sbGVyLmNoZWNrRm9yV2lubmVyKHVzZXJCb2FyZCwgY29tcHV0ZXJCb2FyZCk7XG4gIH07XG5cbiAgLy8gR2FtZSBsb29wXG4gIGNvbnN0IGdhbWVMb29wID0gYXN5bmMgKCkgPT4ge1xuICAgIC8vIEV4aXQgY29uZGl0aW9uXG4gICAgd2hpbGUgKCF1c2VyQm9hcmQuaXNBbGxTaGlwc1N1bmsoKSAmJiAhY29tcHV0ZXJCb2FyZC5pc0FsbFNoaXBzU3VuaygpKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tYXdhaXQtaW4tbG9vcFxuICAgICAgYXdhaXQgcGxheVR1cm4oKTtcbiAgICB9XG4gIH07XG5cbiAgLy8gU3RhcnQgdGhlIGdhbWUgbG9vcFxuICBnYW1lTG9vcCgpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2FtZTtcbiIsImNvbnN0IEdhbWVCb2FyZCA9IChzaXplID0gMTApID0+IHtcbiAgY29uc3QgYm9hcmQgPSBbXTtcbiAgY29uc3QgbWlzc2VkU2hvdHMgPSBbXTtcbiAgY29uc3Qgc2hpcHMgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpICs9IDEpIHtcbiAgICBib2FyZC5wdXNoKFtdKTtcbiAgICBtaXNzZWRTaG90cy5wdXNoKFtdKTtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IHNpemU7IGogKz0gMSkge1xuICAgICAgYm9hcmRbaV0ucHVzaChudWxsKTtcbiAgICAgIG1pc3NlZFNob3RzW2ldLnB1c2goZmFsc2UpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGdldEJvYXJkID0gKCkgPT4gYm9hcmQ7XG4gIGNvbnN0IGdldE1pc3NlZFNob3RzID0gKCkgPT4gbWlzc2VkU2hvdHM7XG5cbiAgY29uc3QgaXNQb3NpdGlvbk91dE9mQm91bmRzID0gKHJvdywgY29sdW1uKSA9PlxuICAgIHJvdyA8IDAgfHwgY29sdW1uIDwgMCB8fCByb3cgPj0gc2l6ZSB8fCBjb2x1bW4gPj0gc2l6ZTtcblxuICBjb25zdCBpc1NoaXBFbmRPdXRPZkJvdW5kcyA9IChyb3csIGNvbHVtbiwgc2hpcCwgaXNWZXJ0aWNhbCkgPT4ge1xuICAgIGlmIChpc1ZlcnRpY2FsKSByZXR1cm4gcm93ICsgc2hpcC5nZXRMZW5ndGgoKSA+PSBzaXplO1xuICAgIHJldHVybiBjb2x1bW4gKyBzaGlwLmdldExlbmd0aCgpID49IHNpemU7XG4gIH07XG5cbiAgY29uc3QgaXNQb3NpdGlvblRha2VuID0gKHJvdywgY29sdW1uLCBzaGlwLCBpc1ZlcnRpY2FsKSA9PiB7XG4gICAgaWYgKGlzVmVydGljYWwpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5nZXRMZW5ndGgoKTsgaSArPSAxKSB7XG4gICAgICAgIGlmIChib2FyZFtyb3cgKyBpXVtjb2x1bW5dICE9PSBudWxsKSByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmdldExlbmd0aCgpOyBpICs9IDEpIHtcbiAgICAgICAgaWYgKGJvYXJkW3Jvd11bY29sdW1uICsgaV0gIT09IG51bGwpIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgY29uc3QgaXNOZWlnaGJvclRha2VuID0gKHJvdywgY29sdW1uLCBzaGlwLCBpc1ZlcnRpY2FsKSA9PiB7XG4gICAgaWYgKGlzVmVydGljYWwpIHtcbiAgICAgIGZvciAobGV0IGkgPSByb3cgLSAxOyBpIDw9IHJvdyArIHNoaXAuZ2V0TGVuZ3RoKCk7IGkgKz0gMSkge1xuICAgICAgICBmb3IgKGxldCBqID0gY29sdW1uIC0gMTsgaiA8PSBjb2x1bW4gKyAxOyBqICs9IDEpIHtcbiAgICAgICAgICBpZiAoIWlzUG9zaXRpb25PdXRPZkJvdW5kcyhpLCBqKSAmJiBib2FyZFtpXVtqXSkgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChsZXQgaSA9IHJvdyAtIDE7IGkgPD0gcm93ICsgMTsgaSArPSAxKSB7XG4gICAgICAgIGZvciAobGV0IGogPSBjb2x1bW4gLSAxOyBqIDw9IGNvbHVtbiArIHNoaXAuZ2V0TGVuZ3RoKCk7IGogKz0gMSkge1xuICAgICAgICAgIGlmICghaXNQb3NpdGlvbk91dE9mQm91bmRzKGksIGopICYmIGJvYXJkW2ldW2pdKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgY29uc3QgaXNWYWxpZFBvc2l0aW9uID0gKHJvdywgY29sdW1uLCBzaGlwLCBpc1ZlcnRpY2FsKSA9PiB7XG4gICAgaWYgKGlzUG9zaXRpb25PdXRPZkJvdW5kcyhyb3csIGNvbHVtbikpIHJldHVybiBmYWxzZTtcbiAgICBpZiAoaXNTaGlwRW5kT3V0T2ZCb3VuZHMocm93LCBjb2x1bW4sIHNoaXAsIGlzVmVydGljYWwpKSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKGlzUG9zaXRpb25UYWtlbihyb3csIGNvbHVtbiwgc2hpcCwgaXNWZXJ0aWNhbCkpIHJldHVybiBmYWxzZTtcbiAgICBpZiAoaXNOZWlnaGJvclRha2VuKHJvdywgY29sdW1uLCBzaGlwLCBpc1ZlcnRpY2FsKSkgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIGNvbnN0IHBsYWNlU2hpcCA9IChyb3csIGNvbHVtbiwgc2hpcCwgaXNWZXJ0aWNhbCA9IGZhbHNlKSA9PiB7XG4gICAgaWYgKCFpc1ZhbGlkUG9zaXRpb24ocm93LCBjb2x1bW4sIHNoaXAsIGlzVmVydGljYWwpKSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKGlzVmVydGljYWwpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5nZXRMZW5ndGgoKTsgaSArPSAxKSB7XG4gICAgICAgIGJvYXJkW3JvdyArIGldW2NvbHVtbl0gPSBzaGlwO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAuZ2V0TGVuZ3RoKCk7IGkgKz0gMSkge1xuICAgICAgICBib2FyZFtyb3ddW2NvbHVtbiArIGldID0gc2hpcDtcbiAgICAgIH1cbiAgICB9XG4gICAgc2hpcHMucHVzaChzaGlwKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICBjb25zdCByZWNpZXZlQXR0YWNrID0gKHJvdywgY29sdW1uKSA9PiB7XG4gICAgaWYgKGlzUG9zaXRpb25PdXRPZkJvdW5kcyhyb3csIGNvbHVtbikpIHJldHVybiBmYWxzZTtcbiAgICBpZiAoYm9hcmRbcm93XVtjb2x1bW5dKSB7XG4gICAgICBib2FyZFtyb3ddW2NvbHVtbl0uaGl0KCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgbWlzc2VkU2hvdHNbcm93XVtjb2x1bW5dID0gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgY29uc3QgaXNBbGxTaGlwc1N1bmsgPSAoKSA9PiBzaGlwcy5ldmVyeSgoc2hpcCkgPT4gc2hpcC5pc1N1bmsoKSA9PT0gdHJ1ZSk7XG5cbiAgcmV0dXJuIHtcbiAgICBnZXRCb2FyZCxcbiAgICBwbGFjZVNoaXAsXG4gICAgcmVjaWV2ZUF0dGFjayxcbiAgICBnZXRNaXNzZWRTaG90cyxcbiAgICBpc0FsbFNoaXBzU3VuayxcbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWVCb2FyZDtcbiIsImNvbnN0IFBsYXllciA9IChuYW1lKSA9PiB7XG4gIGNvbnN0IGhpdFJlY29yZCA9IG5ldyBTZXQoKTtcblxuICBjb25zdCBoYXNBbHJlYXlIaXQgPSAocm93LCBjb2x1bW4pID0+IGhpdFJlY29yZC5oYXMoYCR7cm93fS0ke2NvbHVtbn1gKTtcblxuICBjb25zdCBpc0ludmFsaWRQb3NpdGlvbiA9IChyb3csIGNvbHVtbiwgc2l6ZSkgPT5cbiAgICByb3cgPCAwIHx8IGNvbHVtbiA8IDAgfHwgcm93ID49IHNpemUgfHwgY29sdW1uID49IHNpemU7XG5cbiAgY29uc3QgZ2V0UmFuZG9tUG9zaXRpb24gPSAoZ2FtZUJvYXJkKSA9PlxuICAgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGdhbWVCb2FyZC5nZXRCb2FyZCgpLmxlbmd0aCk7XG5cbiAgY29uc3QgZ2V0TmFtZSA9ICgpID0+IG5hbWU7XG5cbiAgY29uc3QgYXR0YWNrID0gKHJvdywgY29sdW1uLCBnYW1lQm9hcmQpID0+IHtcbiAgICBpZiAoaGFzQWxyZWF5SGl0KHJvdywgY29sdW1uKSkgcmV0dXJuIGZhbHNlO1xuICAgIGlmICghaXNJbnZhbGlkUG9zaXRpb24ocm93LCBjb2x1bW4sIGdhbWVCb2FyZC5nZXRCb2FyZCgpLmxlbmd0aCkpIHtcbiAgICAgIGdhbWVCb2FyZC5yZWNpZXZlQXR0YWNrKHJvdywgY29sdW1uKTtcbiAgICAgIGhpdFJlY29yZC5hZGQoYCR7cm93fS0ke2NvbHVtbn1gKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgY29uc3QgcmFuZG9tQXR0YWNrID0gKGdhbWVCb2FyZCkgPT4ge1xuICAgIGlmIChoaXRSZWNvcmQuc2l6ZSA9PT0gMTAwKSByZXR1cm4gZmFsc2U7XG4gICAgbGV0IHJhbmRvbVJvdyA9IGdldFJhbmRvbVBvc2l0aW9uKGdhbWVCb2FyZCk7XG4gICAgbGV0IHJhbmRvbUNvbCA9IGdldFJhbmRvbVBvc2l0aW9uKGdhbWVCb2FyZCk7XG5cbiAgICB3aGlsZSAoaGFzQWxyZWF5SGl0KHJhbmRvbVJvdywgcmFuZG9tQ29sKSkge1xuICAgICAgcmFuZG9tUm93ID0gZ2V0UmFuZG9tUG9zaXRpb24oZ2FtZUJvYXJkKTtcbiAgICAgIHJhbmRvbUNvbCA9IGdldFJhbmRvbVBvc2l0aW9uKGdhbWVCb2FyZCk7XG4gICAgfVxuICAgIGdhbWVCb2FyZC5yZWNpZXZlQXR0YWNrKHJhbmRvbVJvdywgcmFuZG9tQ29sKTtcbiAgICBoaXRSZWNvcmQuYWRkKGAke3JhbmRvbVJvd30tJHtyYW5kb21Db2x9YCk7XG4gICAgcmV0dXJuIFtyYW5kb21Sb3csIHJhbmRvbUNvbF07XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBnZXROYW1lLFxuICAgIGF0dGFjayxcbiAgICByYW5kb21BdHRhY2ssXG4gIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBQbGF5ZXI7XG4iLCJjb25zdCBTaGlwID0gKGxlbmd0aCkgPT4ge1xuICBsZXQgaGl0cyA9IDA7XG5cbiAgY29uc3QgZ2V0TGVuZ3RoID0gKCkgPT4gbGVuZ3RoO1xuICBjb25zdCBnZXRIaXRzID0gKCkgPT4gaGl0cztcbiAgY29uc3QgaXNTdW5rID0gKCkgPT4gaGl0cyA9PT0gbGVuZ3RoO1xuICBjb25zdCBoaXQgPSAoKSA9PiB7XG4gICAgaWYgKGhpdHMgPCBsZW5ndGgpIGhpdHMgKz0gMTtcbiAgfTtcbiAgcmV0dXJuIHtcbiAgICBnZXRMZW5ndGgsXG4gICAgZ2V0SGl0cyxcbiAgICBpc1N1bmssXG4gICAgaGl0LFxuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgU2hpcDtcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIGAqLFxuKjo6YmVmb3JlLFxuKjo6YWZ0ZXIge1xuICBtYXJnaW46IDA7XG4gIHBhZGRpbmc6IDA7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG59XG5cbmh0bWwsXG5ib2R5IHtcbiAgaGVpZ2h0OiAxMDAlO1xuICB3aWR0aDogMTAwJTtcbn1cblxuLmJvYXJkcyB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xufVxuXG4uYm9hcmQge1xuICB3aWR0aDogbWF4LWNvbnRlbnQ7XG59XG5cbi5yb3cge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogcm93O1xufVxuXG4uY2VsbCB7XG4gIHdpZHRoOiAycmVtO1xuICBhc3BlY3QtcmF0aW86IDE7XG4gIGJvcmRlcjogMXB4IHNvbGlkIGJsdWU7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbn1cblxuLm1pc3NlZCB7XG4gIGJhY2tncm91bmQtY29sb3I6IGFxdWE7XG59XG5cbi5oaXQge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZWQ7XG59YCwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvc3R5bGVzL3N0eWxlcy5jc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7OztFQUdFLFNBQVM7RUFDVCxVQUFVO0VBQ1Ysc0JBQXNCO0FBQ3hCOztBQUVBOztFQUVFLFlBQVk7RUFDWixXQUFXO0FBQ2I7O0FBRUE7RUFDRSxhQUFhO0VBQ2IsNkJBQTZCO0FBQy9COztBQUVBO0VBQ0Usa0JBQWtCO0FBQ3BCOztBQUVBO0VBQ0UsYUFBYTtFQUNiLG1CQUFtQjtBQUNyQjs7QUFFQTtFQUNFLFdBQVc7RUFDWCxlQUFlO0VBQ2Ysc0JBQXNCO0VBQ3RCLGtCQUFrQjtBQUNwQjs7QUFFQTtFQUNFLHNCQUFzQjtBQUN4Qjs7QUFFQTtFQUNFLHFCQUFxQjtBQUN2QlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCIqLFxcbio6OmJlZm9yZSxcXG4qOjphZnRlciB7XFxuICBtYXJnaW46IDA7XFxuICBwYWRkaW5nOiAwO1xcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG59XFxuXFxuaHRtbCxcXG5ib2R5IHtcXG4gIGhlaWdodDogMTAwJTtcXG4gIHdpZHRoOiAxMDAlO1xcbn1cXG5cXG4uYm9hcmRzIHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcXG59XFxuXFxuLmJvYXJkIHtcXG4gIHdpZHRoOiBtYXgtY29udGVudDtcXG59XFxuXFxuLnJvdyB7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcXG59XFxuXFxuLmNlbGwge1xcbiAgd2lkdGg6IDJyZW07XFxuICBhc3BlY3QtcmF0aW86IDE7XFxuICBib3JkZXI6IDFweCBzb2xpZCBibHVlO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbn1cXG5cXG4ubWlzc2VkIHtcXG4gIGJhY2tncm91bmQtY29sb3I6IGFxdWE7XFxufVxcblxcbi5oaXQge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmVkO1xcbn1cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qXG4gIE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gIEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKSB7XG4gIHZhciBsaXN0ID0gW107XG5cbiAgLy8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuICBsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICB2YXIgY29udGVudCA9IFwiXCI7XG4gICAgICB2YXIgbmVlZExheWVyID0gdHlwZW9mIGl0ZW1bNV0gIT09IFwidW5kZWZpbmVkXCI7XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBjb250ZW50ICs9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSk7XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH0pLmpvaW4oXCJcIik7XG4gIH07XG5cbiAgLy8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3RcbiAgbGlzdC5pID0gZnVuY3Rpb24gaShtb2R1bGVzLCBtZWRpYSwgZGVkdXBlLCBzdXBwb3J0cywgbGF5ZXIpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIHVuZGVmaW5lZF1dO1xuICAgIH1cbiAgICB2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuICAgIGlmIChkZWR1cGUpIHtcbiAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgdGhpcy5sZW5ndGg7IGsrKykge1xuICAgICAgICB2YXIgaWQgPSB0aGlzW2tdWzBdO1xuICAgICAgICBpZiAoaWQgIT0gbnVsbCkge1xuICAgICAgICAgIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKHZhciBfayA9IDA7IF9rIDwgbW9kdWxlcy5sZW5ndGg7IF9rKyspIHtcbiAgICAgIHZhciBpdGVtID0gW10uY29uY2F0KG1vZHVsZXNbX2tdKTtcbiAgICAgIGlmIChkZWR1cGUgJiYgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgbGF5ZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtWzVdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAobWVkaWEpIHtcbiAgICAgICAgaWYgKCFpdGVtWzJdKSB7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHN1cHBvcnRzKSB7XG4gICAgICAgIGlmICghaXRlbVs0XSkge1xuICAgICAgICAgIGl0ZW1bNF0gPSBcIlwiLmNvbmNhdChzdXBwb3J0cyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzRdID0gc3VwcG9ydHM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxpc3QucHVzaChpdGVtKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiBsaXN0O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlbSkge1xuICB2YXIgY29udGVudCA9IGl0ZW1bMV07XG4gIHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcbiAgaWYgKCFjc3NNYXBwaW5nKSB7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cbiAgaWYgKHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICB2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoY3NzTWFwcGluZykpKSk7XG4gICAgdmFyIGRhdGEgPSBcInNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LFwiLmNvbmNhdChiYXNlNjQpO1xuICAgIHZhciBzb3VyY2VNYXBwaW5nID0gXCIvKiMgXCIuY29uY2F0KGRhdGEsIFwiICovXCIpO1xuICAgIHJldHVybiBbY29udGVudF0uY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbihcIlxcblwiKTtcbiAgfVxuICByZXR1cm4gW2NvbnRlbnRdLmpvaW4oXCJcXG5cIik7XG59OyIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zdHlsZXMuY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zdHlsZXMuY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBzdHlsZXNJbkRPTSA9IFtdO1xuZnVuY3Rpb24gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICB2YXIgcmVzdWx0ID0gLTE7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzSW5ET00ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3R5bGVzSW5ET01baV0uaWRlbnRpZmllciA9PT0gaWRlbnRpZmllcikge1xuICAgICAgcmVzdWx0ID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXTtcbiAgICB2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcbiAgICB2YXIgY291bnQgPSBpZENvdW50TWFwW2lkXSB8fCAwO1xuICAgIHZhciBpZGVudGlmaWVyID0gXCJcIi5jb25jYXQoaWQsIFwiIFwiKS5jb25jYXQoY291bnQpO1xuICAgIGlkQ291bnRNYXBbaWRdID0gY291bnQgKyAxO1xuICAgIHZhciBpbmRleEJ5SWRlbnRpZmllciA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgIHZhciBvYmogPSB7XG4gICAgICBjc3M6IGl0ZW1bMV0sXG4gICAgICBtZWRpYTogaXRlbVsyXSxcbiAgICAgIHNvdXJjZU1hcDogaXRlbVszXSxcbiAgICAgIHN1cHBvcnRzOiBpdGVtWzRdLFxuICAgICAgbGF5ZXI6IGl0ZW1bNV1cbiAgICB9O1xuICAgIGlmIChpbmRleEJ5SWRlbnRpZmllciAhPT0gLTEpIHtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS5yZWZlcmVuY2VzKys7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0udXBkYXRlcihvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdXBkYXRlciA9IGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpO1xuICAgICAgb3B0aW9ucy5ieUluZGV4ID0gaTtcbiAgICAgIHN0eWxlc0luRE9NLnNwbGljZShpLCAwLCB7XG4gICAgICAgIGlkZW50aWZpZXI6IGlkZW50aWZpZXIsXG4gICAgICAgIHVwZGF0ZXI6IHVwZGF0ZXIsXG4gICAgICAgIHJlZmVyZW5jZXM6IDFcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZGVudGlmaWVycy5wdXNoKGlkZW50aWZpZXIpO1xuICB9XG4gIHJldHVybiBpZGVudGlmaWVycztcbn1cbmZ1bmN0aW9uIGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpIHtcbiAgdmFyIGFwaSA9IG9wdGlvbnMuZG9tQVBJKG9wdGlvbnMpO1xuICBhcGkudXBkYXRlKG9iaik7XG4gIHZhciB1cGRhdGVyID0gZnVuY3Rpb24gdXBkYXRlcihuZXdPYmopIHtcbiAgICBpZiAobmV3T2JqKSB7XG4gICAgICBpZiAobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwICYmIG5ld09iai5zdXBwb3J0cyA9PT0gb2JqLnN1cHBvcnRzICYmIG5ld09iai5sYXllciA9PT0gb2JqLmxheWVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGFwaS51cGRhdGUob2JqID0gbmV3T2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXBpLnJlbW92ZSgpO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIHVwZGF0ZXI7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBsaXN0ID0gbGlzdCB8fCBbXTtcbiAgdmFyIGxhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG4gICAgbmV3TGlzdCA9IG5ld0xpc3QgfHwgW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW2ldO1xuICAgICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleF0ucmVmZXJlbmNlcy0tO1xuICAgIH1cbiAgICB2YXIgbmV3TGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKG5ld0xpc3QsIG9wdGlvbnMpO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX2lkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbX2ldO1xuICAgICAgdmFyIF9pbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKF9pZGVudGlmaWVyKTtcbiAgICAgIGlmIChzdHlsZXNJbkRPTVtfaW5kZXhdLnJlZmVyZW5jZXMgPT09IDApIHtcbiAgICAgICAgc3R5bGVzSW5ET01bX2luZGV4XS51cGRhdGVyKCk7XG4gICAgICAgIHN0eWxlc0luRE9NLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cbiAgICBsYXN0SWRlbnRpZmllcnMgPSBuZXdMYXN0SWRlbnRpZmllcnM7XG4gIH07XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgbWVtbyA9IHt9O1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGdldFRhcmdldCh0YXJnZXQpIHtcbiAgaWYgKHR5cGVvZiBtZW1vW3RhcmdldF0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB2YXIgc3R5bGVUYXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7XG5cbiAgICAvLyBTcGVjaWFsIGNhc2UgdG8gcmV0dXJuIGhlYWQgb2YgaWZyYW1lIGluc3RlYWQgb2YgaWZyYW1lIGl0c2VsZlxuICAgIGlmICh3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQgJiYgc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG4gICAgICAgIC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG4gICAgbWVtb1t0YXJnZXRdID0gc3R5bGVUYXJnZXQ7XG4gIH1cbiAgcmV0dXJuIG1lbW9bdGFyZ2V0XTtcbn1cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRCeVNlbGVjdG9yKGluc2VydCwgc3R5bGUpIHtcbiAgdmFyIHRhcmdldCA9IGdldFRhcmdldChpbnNlcnQpO1xuICBpZiAoIXRhcmdldCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0JyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG4gIH1cbiAgdGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0QnlTZWxlY3RvcjsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgb3B0aW9ucy5zZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIG9wdGlvbnMuYXR0cmlidXRlcyk7XG4gIG9wdGlvbnMuaW5zZXJ0KGVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG4gIHJldHVybiBlbGVtZW50O1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzKHN0eWxlRWxlbWVudCkge1xuICB2YXIgbm9uY2UgPSB0eXBlb2YgX193ZWJwYWNrX25vbmNlX18gIT09IFwidW5kZWZpbmVkXCIgPyBfX3dlYnBhY2tfbm9uY2VfXyA6IG51bGw7XG4gIGlmIChub25jZSkge1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJub25jZVwiLCBub25jZSk7XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XG4gIHZhciBjc3MgPSBcIlwiO1xuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQob2JqLnN1cHBvcnRzLCBcIikge1wiKTtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwiQG1lZGlhIFwiLmNvbmNhdChvYmoubWVkaWEsIFwiIHtcIik7XG4gIH1cbiAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBvYmoubGF5ZXIgIT09IFwidW5kZWZpbmVkXCI7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJAbGF5ZXJcIi5jb25jYXQob2JqLmxheWVyLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQob2JqLmxheWVyKSA6IFwiXCIsIFwiIHtcIik7XG4gIH1cbiAgY3NzICs9IG9iai5jc3M7XG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuICBpZiAoc291cmNlTWFwICYmIHR5cGVvZiBidG9hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgY3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIi5jb25jYXQoYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSwgXCIgKi9cIik7XG4gIH1cblxuICAvLyBGb3Igb2xkIElFXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cbiAgb3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbn1cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcbiAgLy8gaXN0YW5idWwgaWdub3JlIGlmXG4gIGlmIChzdHlsZUVsZW1lbnQucGFyZW50Tm9kZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGRvbUFQSShvcHRpb25zKSB7XG4gIGlmICh0eXBlb2YgZG9jdW1lbnQgPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoKSB7fSxcbiAgICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge31cbiAgICB9O1xuICB9XG4gIHZhciBzdHlsZUVsZW1lbnQgPSBvcHRpb25zLmluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKTtcbiAgcmV0dXJuIHtcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShvYmopIHtcbiAgICAgIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG4gICAgfVxuICB9O1xufVxubW9kdWxlLmV4cG9ydHMgPSBkb21BUEk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQpIHtcbiAgaWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgfVxuICAgIHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzdHlsZVRhZ1RyYW5zZm9ybTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5uYyA9IHVuZGVmaW5lZDsiLCJpbXBvcnQgXCIuL3N0eWxlcy9zdHlsZXMuY3NzXCI7XG5pbXBvcnQgZ2FtZSBmcm9tIFwiLi9tb2R1bGVzL2dhbWVcIjtcblxuZ2FtZSgpOyJdLCJuYW1lcyI6WyJET01jb250cm9sbGVyIiwiY3JlYXRlQ2VsbCIsInJvd0luZGV4IiwiY29sdW1uSW5kZXgiLCJjZWxsIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NMaXN0IiwiYWRkIiwic2V0QXR0cmlidXRlIiwiY3JlYXRlUm93Iiwicm93QXJyYXkiLCJyb3ciLCJmb3JFYWNoIiwiXyIsImNvbHVtbiIsImFwcGVuZENoaWxkIiwicmVuZGVyR2FtZUJvYXJkIiwiZ2FtZUJvYXJkIiwiYm9hcmRBcnJheSIsImdldEJvYXJkIiwiYm9hcmQiLCJnZXRVc2VyTW92ZSIsIlByb21pc2UiLCJyZXNvbHZlIiwidXNlckJvYXJkQ29udGFpbmVyIiwicXVlcnlTZWxlY3RvciIsImhhbmRsZUNsaWNrIiwiZXZlbnQiLCJ0YXJnZXQiLCJjbG9zZXN0IiwicGFyc2VJbnQiLCJnZXRBdHRyaWJ1dGUiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiYWRkRXZlbnRMaXN0ZW5lciIsImhhbmRsZUNlbGxVcGRhdGUiLCJjb29yZHMiLCJtaXNzZWRTaG90cyIsInBsYXllciIsImdldE5hbWUiLCJpc0hpdCIsImNoZWNrRm9yV2lubmVyIiwidXNlckJvYXJkIiwiY29tcHV0ZXJCb2FyZCIsImlzQWxsU2hpcHNTdW5rIiwiY29uc29sZSIsImxvZyIsIkdhbWVCb2FyZCIsIlBsYXllciIsIlNoaXAiLCJnYW1lIiwidXNlciIsImNvbXB1dGVyIiwiZG9tQ29udHJvbGxlciIsIm5ld1NoaXAiLCJwbGFjZVNoaXAiLCJuZXdTaGlwMiIsImNvbXB1dGVyQm9hcmRDb250YWluZXIiLCJwbGF5VHVybiIsInVzZXJDZWxsQ29vcmRzIiwidXNlckF0dGFja1N1Y2Nlc3MiLCJhdHRhY2siLCJnZXRNaXNzZWRTaG90cyIsImNvbXB1dGVyQ2VsbENvb3JkcyIsInJhbmRvbUF0dGFjayIsImdhbWVMb29wIiwic2l6ZSIsImFyZ3VtZW50cyIsImxlbmd0aCIsInVuZGVmaW5lZCIsInNoaXBzIiwiaSIsInB1c2giLCJqIiwiaXNQb3NpdGlvbk91dE9mQm91bmRzIiwiaXNTaGlwRW5kT3V0T2ZCb3VuZHMiLCJzaGlwIiwiaXNWZXJ0aWNhbCIsImdldExlbmd0aCIsImlzUG9zaXRpb25UYWtlbiIsImlzTmVpZ2hib3JUYWtlbiIsImlzVmFsaWRQb3NpdGlvbiIsInJlY2lldmVBdHRhY2siLCJoaXQiLCJldmVyeSIsImlzU3VuayIsIm5hbWUiLCJoaXRSZWNvcmQiLCJTZXQiLCJoYXNBbHJlYXlIaXQiLCJoYXMiLCJpc0ludmFsaWRQb3NpdGlvbiIsImdldFJhbmRvbVBvc2l0aW9uIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwicmFuZG9tUm93IiwicmFuZG9tQ29sIiwiaGl0cyIsImdldEhpdHMiXSwic291cmNlUm9vdCI6IiJ9