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
  const renderGameBoard = gameBoard => {
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
    cells.forEach(cell => {
      cell.addEventListener("click", () => {
        if (user.attack(cell.getAttribute("row"), cell.getAttribute("column"), userBoard)) {
          cell.classList.add("missed");
          const computerCellCoords = computer.randomAttack(computerBoard);
          const computerCell = document.querySelector(`.board .row:nth-child(${computerCellCoords[0] + 1}) .cell:nth-child(${computerCellCoords[1] + 1})`);
          computerCell.classList.add("missed");
        }
      });
    });
  };
  return {
    renderGameBoard,
    addCellEvents
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



const game = () => {
  const user = (0,_player__WEBPACK_IMPORTED_MODULE_2__["default"])("user");
  const computer = (0,_player__WEBPACK_IMPORTED_MODULE_2__["default"])("computer");
  const userBoard = (0,_gameBoard__WEBPACK_IMPORTED_MODULE_1__["default"])();
  const computerBoard = (0,_gameBoard__WEBPACK_IMPORTED_MODULE_1__["default"])();
  const domController = (0,_DOMcontroller__WEBPACK_IMPORTED_MODULE_0__["default"])();
  const computerBoardContainer = document.querySelector(".computerBoardContainer");
  const userBoardContainer = document.querySelector(".userBoardContainer");
  computerBoardContainer.appendChild(domController.renderGameBoard(computerBoard));
  userBoardContainer.appendChild(domController.renderGameBoard(userBoard));
  domController.addCellEvents(user, computer, userBoard, computerBoard);
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

.missed{
  background-color: red;
}`, "",{"version":3,"sources":["webpack://./src/styles/styles.css"],"names":[],"mappings":"AAAA;;;EAGE,SAAS;EACT,UAAU;EACV,sBAAsB;AACxB;;AAEA;;EAEE,YAAY;EACZ,WAAW;AACb;;AAEA;EACE,aAAa;EACb,6BAA6B;AAC/B;;AAEA;EACE,kBAAkB;AACpB;;AAEA;EACE,aAAa;EACb,mBAAmB;AACrB;;AAEA;EACE,WAAW;EACX,eAAe;EACf,sBAAsB;EACtB,kBAAkB;AACpB;;AAEA;EACE,qBAAqB;AACvB","sourcesContent":["*,\n*::before,\n*::after {\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n}\n\nhtml,\nbody {\n  height: 100%;\n  width: 100%;\n}\n\n.boards {\n  display: flex;\n  justify-content: space-around;\n}\n\n.board {\n  width: max-content;\n}\n\n.row {\n  display: flex;\n  flex-direction: row;\n}\n\n.cell {\n  width: 2rem;\n  aspect-ratio: 1;\n  border: 1px solid blue;\n  text-align: center;\n}\n\n.missed{\n  background-color: red;\n}"],"sourceRoot":""}]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7QUM1RGE7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7OztVQ2JBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxpQ0FBaUMsV0FBVztXQUM1QztXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztXQ05BOzs7Ozs7Ozs7Ozs7O0FDQTZCO0FBQ0s7QUFFbENDLHlEQUFJLENBQUMsQ0FBQyxDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vYmF0dGxlc2hpcHMvLi9zcmMvbW9kdWxlcy9ET01jb250cm9sbGVyLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXBzLy4vc3JjL21vZHVsZXMvZ2FtZS5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy8uL3NyYy9tb2R1bGVzL2dhbWVCb2FyZC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy8uL3NyYy9tb2R1bGVzL3BsYXllci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy8uL3NyYy9zdHlsZXMvc3R5bGVzLmNzcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcHMvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy8uL3NyYy9zdHlsZXMvc3R5bGVzLmNzcz9lNDViIiwid2VicGFjazovL2JhdHRsZXNoaXBzLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXBzLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qcyIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzIiwid2VicGFjazovL2JhdHRsZXNoaXBzLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcHMvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcHMvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcHMvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2JhdHRsZXNoaXBzL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcHMvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iYXR0bGVzaGlwcy93ZWJwYWNrL3J1bnRpbWUvbm9uY2UiLCJ3ZWJwYWNrOi8vYmF0dGxlc2hpcHMvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgRE9NY29udHJvbGxlciA9ICgpID0+IHtcbiAgLy8gRnVuY3Rpb24gdG8gY3JlYXRlIGEgc2luZ2xlIGNlbGxcbiAgY29uc3QgY3JlYXRlQ2VsbCA9IChyb3dJbmRleCwgY29sdW1uSW5kZXgpID0+IHtcbiAgICBjb25zdCBjZWxsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBjZWxsLmNsYXNzTGlzdC5hZGQoXCJjZWxsXCIpO1xuICAgIGNlbGwuc2V0QXR0cmlidXRlKFwicm93XCIsIHJvd0luZGV4KTtcbiAgICBjZWxsLnNldEF0dHJpYnV0ZShcImNvbHVtblwiLCBjb2x1bW5JbmRleCk7XG4gICAgcmV0dXJuIGNlbGw7XG4gIH07XG5cbiAgLy8gRnVuY3Rpb24gdG8gY3JlYXRlIGEgc2luZ2xlIHJvd1xuICBjb25zdCBjcmVhdGVSb3cgPSAocm93SW5kZXgsIHJvd0FycmF5KSA9PiB7XG4gICAgY29uc3Qgcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICByb3cuY2xhc3NMaXN0LmFkZChcInJvd1wiKTtcblxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgcm93QXJyYXkubGVuZ3RoOyBqICs9IDEpIHtcbiAgICAgIGNvbnN0IGNlbGwgPSBjcmVhdGVDZWxsKHJvd0luZGV4LCBqKTtcbiAgICAgIHJvdy5hcHBlbmRDaGlsZChjZWxsKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcm93O1xuICB9O1xuXG4gIC8vIEZ1bmN0aW9uIHRvIHJlbmRlciB0aGUgZ2FtZSBib2FyZFxuICBjb25zdCByZW5kZXJHYW1lQm9hcmQgPSAoZ2FtZUJvYXJkKSA9PiB7XG4gICAgY29uc3QgYm9hcmRBcnJheSA9IGdhbWVCb2FyZC5nZXRCb2FyZCgpO1xuICAgIGNvbnN0IGJvYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBib2FyZC5jbGFzc0xpc3QuYWRkKFwiYm9hcmRcIik7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJvYXJkQXJyYXkubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgIGNvbnN0IHJvdyA9IGNyZWF0ZVJvdyhpLCBib2FyZEFycmF5W2ldKTtcbiAgICAgIGJvYXJkLmFwcGVuZENoaWxkKHJvdyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGJvYXJkO1xuICB9O1xuXG4gIGNvbnN0IGFkZENlbGxFdmVudHMgPSAodXNlciwgY29tcHV0ZXIsIHVzZXJCb2FyZCwgY29tcHV0ZXJCb2FyZCkgPT4ge1xuICAgIGNvbnN0IGNlbGxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi51c2VyQm9hcmRDb250YWluZXIgLmNlbGxcIik7XG4gICAgY2VsbHMuZm9yRWFjaCgoY2VsbCkgPT4ge1xuICAgICAgY2VsbC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT4ge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgdXNlci5hdHRhY2soXG4gICAgICAgICAgICBjZWxsLmdldEF0dHJpYnV0ZShcInJvd1wiKSxcbiAgICAgICAgICAgIGNlbGwuZ2V0QXR0cmlidXRlKFwiY29sdW1uXCIpLFxuICAgICAgICAgICAgdXNlckJvYXJkLFxuICAgICAgICAgIClcbiAgICAgICAgKSB7XG4gICAgICAgICAgY2VsbC5jbGFzc0xpc3QuYWRkKFwibWlzc2VkXCIpO1xuICAgICAgICAgIGNvbnN0IGNvbXB1dGVyQ2VsbENvb3JkcyA9IGNvbXB1dGVyLnJhbmRvbUF0dGFjayhjb21wdXRlckJvYXJkKTtcbiAgICAgICAgICBjb25zdCBjb21wdXRlckNlbGwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgICAgICAgICAgYC5ib2FyZCAucm93Om50aC1jaGlsZCgke1xuICAgICAgICAgICAgICBjb21wdXRlckNlbGxDb29yZHNbMF0gKyAxXG4gICAgICAgICAgICB9KSAuY2VsbDpudGgtY2hpbGQoJHtjb21wdXRlckNlbGxDb29yZHNbMV0gKyAxfSlgLFxuICAgICAgICAgICk7XG4gICAgICAgICAgY29tcHV0ZXJDZWxsLmNsYXNzTGlzdC5hZGQoXCJtaXNzZWRcIik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiB7XG4gICAgcmVuZGVyR2FtZUJvYXJkLFxuICAgIGFkZENlbGxFdmVudHMsXG4gIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBET01jb250cm9sbGVyO1xuIiwiaW1wb3J0IERPTWNvbnRyb2xsZXIgZnJvbSBcIi4vRE9NY29udHJvbGxlclwiO1xuaW1wb3J0IEdhbWVCb2FyZCBmcm9tIFwiLi9nYW1lQm9hcmRcIjtcbmltcG9ydCBQbGF5ZXIgZnJvbSBcIi4vcGxheWVyXCI7XG5cbmNvbnN0IGdhbWUgPSAoKSA9PiB7XG4gIGNvbnN0IHVzZXIgPSBQbGF5ZXIoXCJ1c2VyXCIpO1xuICBjb25zdCBjb21wdXRlciA9IFBsYXllcihcImNvbXB1dGVyXCIpO1xuICBjb25zdCB1c2VyQm9hcmQgPSBHYW1lQm9hcmQoKTtcbiAgY29uc3QgY29tcHV0ZXJCb2FyZCA9IEdhbWVCb2FyZCgpO1xuICBjb25zdCBkb21Db250cm9sbGVyID0gRE9NY29udHJvbGxlcigpO1xuXG4gIGNvbnN0IGNvbXB1dGVyQm9hcmRDb250YWluZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFxuICAgIFwiLmNvbXB1dGVyQm9hcmRDb250YWluZXJcIixcbiAgKTtcbiAgY29uc3QgdXNlckJvYXJkQ29udGFpbmVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi51c2VyQm9hcmRDb250YWluZXJcIik7XG4gIGNvbXB1dGVyQm9hcmRDb250YWluZXIuYXBwZW5kQ2hpbGQoXG4gICAgZG9tQ29udHJvbGxlci5yZW5kZXJHYW1lQm9hcmQoY29tcHV0ZXJCb2FyZCksXG4gICk7XG4gIHVzZXJCb2FyZENvbnRhaW5lci5hcHBlbmRDaGlsZChkb21Db250cm9sbGVyLnJlbmRlckdhbWVCb2FyZCh1c2VyQm9hcmQpKTtcbiAgZG9tQ29udHJvbGxlci5hZGRDZWxsRXZlbnRzKHVzZXIsIGNvbXB1dGVyLCB1c2VyQm9hcmQsIGNvbXB1dGVyQm9hcmQpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZ2FtZTtcbiIsImNvbnN0IEdhbWVCb2FyZCA9IChzaXplID0gMTApID0+IHtcbiAgY29uc3QgYm9hcmQgPSBbXTtcbiAgY29uc3QgbWlzc2VkU2hvdHMgPSBbXTtcbiAgY29uc3Qgc2hpcHMgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaXplOyBpICs9IDEpIHtcbiAgICBib2FyZC5wdXNoKFtdKTtcbiAgICBtaXNzZWRTaG90cy5wdXNoKFtdKTtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IHNpemU7IGogKz0gMSkge1xuICAgICAgYm9hcmRbaV0ucHVzaChudWxsKTtcbiAgICAgIG1pc3NlZFNob3RzW2ldLnB1c2goZmFsc2UpO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGdldEJvYXJkID0gKCkgPT4gYm9hcmQ7XG4gIGNvbnN0IGdldE1pc3NlZFNob3RzID0gKCkgPT4gbWlzc2VkU2hvdHM7XG5cbiAgY29uc3QgaXNQb3NpdGlvbk91dE9mQm91bmRzID0gKHJvdywgY29sdW1uKSA9PlxuICAgIHJvdyA8IDAgfHwgY29sdW1uIDwgMCB8fCByb3cgPj0gc2l6ZSB8fCBjb2x1bW4gPj0gc2l6ZTtcblxuICBjb25zdCBpc1NoaXBFbmRPdXRPZkJvdW5kcyA9IChyb3csIGNvbHVtbiwgc2hpcCwgaXNWZXJ0aWNhbCkgPT4ge1xuICAgIGlmIChpc1ZlcnRpY2FsKSByZXR1cm4gcm93ICsgc2hpcC5nZXRMZW5ndGgoKSA+PSBzaXplO1xuICAgIHJldHVybiBjb2x1bW4gKyBzaGlwLmdldExlbmd0aCgpID49IHNpemU7XG4gIH07XG5cbiAgY29uc3QgaXNQb3NpdGlvblRha2VuID0gKHJvdywgY29sdW1uLCBzaGlwLCBpc1ZlcnRpY2FsKSA9PiB7XG4gICAgaWYgKGlzVmVydGljYWwpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5nZXRMZW5ndGgoKTsgaSArPSAxKSB7XG4gICAgICAgIGlmIChib2FyZFtyb3cgKyBpXVtjb2x1bW5dICE9PSBudWxsKSByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGlwLmdldExlbmd0aCgpOyBpICs9IDEpIHtcbiAgICAgICAgaWYgKGJvYXJkW3Jvd11bY29sdW1uICsgaV0gIT09IG51bGwpIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgY29uc3QgaXNOZWlnaGJvclRha2VuID0gKHJvdywgY29sdW1uLCBzaGlwLCBpc1ZlcnRpY2FsKSA9PiB7XG4gICAgaWYgKGlzVmVydGljYWwpIHtcbiAgICAgIGZvciAobGV0IGkgPSByb3cgLSAxOyBpIDw9IHJvdyArIHNoaXAuZ2V0TGVuZ3RoKCk7IGkgKz0gMSkge1xuICAgICAgICBmb3IgKGxldCBqID0gY29sdW1uIC0gMTsgaiA8PSBjb2x1bW4gKyAxOyBqICs9IDEpIHtcbiAgICAgICAgICBpZiAoIWlzUG9zaXRpb25PdXRPZkJvdW5kcyhpLCBqKSAmJiBib2FyZFtpXVtqXSkgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChsZXQgaSA9IHJvdyAtIDE7IGkgPD0gcm93ICsgMTsgaSArPSAxKSB7XG4gICAgICAgIGZvciAobGV0IGogPSBjb2x1bW4gLSAxOyBqIDw9IGNvbHVtbiArIHNoaXAuZ2V0TGVuZ3RoKCk7IGogKz0gMSkge1xuICAgICAgICAgIGlmICghaXNQb3NpdGlvbk91dE9mQm91bmRzKGksIGopICYmIGJvYXJkW2ldW2pdKSByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgY29uc3QgaXNWYWxpZFBvc2l0aW9uID0gKHJvdywgY29sdW1uLCBzaGlwLCBpc1ZlcnRpY2FsKSA9PiB7XG4gICAgaWYgKGlzUG9zaXRpb25PdXRPZkJvdW5kcyhyb3csIGNvbHVtbikpIHJldHVybiBmYWxzZTtcbiAgICBpZiAoaXNTaGlwRW5kT3V0T2ZCb3VuZHMocm93LCBjb2x1bW4sIHNoaXAsIGlzVmVydGljYWwpKSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKGlzUG9zaXRpb25UYWtlbihyb3csIGNvbHVtbiwgc2hpcCwgaXNWZXJ0aWNhbCkpIHJldHVybiBmYWxzZTtcbiAgICBpZiAoaXNOZWlnaGJvclRha2VuKHJvdywgY29sdW1uLCBzaGlwLCBpc1ZlcnRpY2FsKSkgcmV0dXJuIGZhbHNlO1xuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIGNvbnN0IHBsYWNlU2hpcCA9IChyb3csIGNvbHVtbiwgc2hpcCwgaXNWZXJ0aWNhbCA9IGZhbHNlKSA9PiB7XG4gICAgaWYgKCFpc1ZhbGlkUG9zaXRpb24ocm93LCBjb2x1bW4sIHNoaXAsIGlzVmVydGljYWwpKSByZXR1cm4gZmFsc2U7XG4gICAgaWYgKGlzVmVydGljYWwpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hpcC5nZXRMZW5ndGgoKTsgaSArPSAxKSB7XG4gICAgICAgIGJvYXJkW3JvdyArIGldW2NvbHVtbl0gPSBzaGlwO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoaXAuZ2V0TGVuZ3RoKCk7IGkgKz0gMSkge1xuICAgICAgICBib2FyZFtyb3ddW2NvbHVtbiArIGldID0gc2hpcDtcbiAgICAgIH1cbiAgICB9XG4gICAgc2hpcHMucHVzaChzaGlwKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfTtcblxuICBjb25zdCByZWNpZXZlQXR0YWNrID0gKHJvdywgY29sdW1uKSA9PiB7XG4gICAgaWYgKGlzUG9zaXRpb25PdXRPZkJvdW5kcyhyb3csIGNvbHVtbikpIHJldHVybiBmYWxzZTtcbiAgICBpZiAoYm9hcmRbcm93XVtjb2x1bW5dKSB7XG4gICAgICBib2FyZFtyb3ddW2NvbHVtbl0uaGl0KCk7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgbWlzc2VkU2hvdHNbcm93XVtjb2x1bW5dID0gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgY29uc3QgaXNBbGxTaGlwc1N1bmsgPSAoKSA9PiBzaGlwcy5ldmVyeSgoc2hpcCkgPT4gc2hpcC5pc1N1bmsoKSA9PT0gdHJ1ZSk7XG5cbiAgcmV0dXJuIHtcbiAgICBnZXRCb2FyZCxcbiAgICBwbGFjZVNoaXAsXG4gICAgcmVjaWV2ZUF0dGFjayxcbiAgICBnZXRNaXNzZWRTaG90cyxcbiAgICBpc0FsbFNoaXBzU3VuayxcbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IEdhbWVCb2FyZDtcbiIsImNvbnN0IFBsYXllciA9IChuYW1lKSA9PiB7XG4gIGNvbnN0IGhpdFJlY29yZCA9IG5ldyBTZXQoKTtcblxuICBjb25zdCBoYXNBbHJlYXlIaXQgPSAocm93LCBjb2x1bW4pID0+IGhpdFJlY29yZC5oYXMoYCR7cm93fS0ke2NvbHVtbn1gKTtcblxuICBjb25zdCBpc0ludmFsaWRQb3NpdGlvbiA9IChyb3csIGNvbHVtbiwgc2l6ZSkgPT5cbiAgICByb3cgPCAwIHx8IGNvbHVtbiA8IDAgfHwgcm93ID49IHNpemUgfHwgY29sdW1uID49IHNpemU7XG5cbiAgY29uc3QgZ2V0UmFuZG9tUG9zaXRpb24gPSAoZ2FtZUJvYXJkKSA9PlxuICAgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGdhbWVCb2FyZC5nZXRCb2FyZCgpLmxlbmd0aCk7XG5cbiAgY29uc3QgZ2V0TmFtZSA9ICgpID0+IG5hbWU7XG5cbiAgY29uc3QgYXR0YWNrID0gKHJvdywgY29sdW1uLCBnYW1lQm9hcmQpID0+IHtcbiAgICBpZiAoaGFzQWxyZWF5SGl0KHJvdywgY29sdW1uKSkgcmV0dXJuIGZhbHNlO1xuICAgIGlmICghaXNJbnZhbGlkUG9zaXRpb24ocm93LCBjb2x1bW4sIGdhbWVCb2FyZC5nZXRCb2FyZCgpLmxlbmd0aCkpIHtcbiAgICAgIGdhbWVCb2FyZC5yZWNpZXZlQXR0YWNrKHJvdywgY29sdW1uKTtcbiAgICAgIGhpdFJlY29yZC5hZGQoYCR7cm93fS0ke2NvbHVtbn1gKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH07XG5cbiAgY29uc3QgcmFuZG9tQXR0YWNrID0gKGdhbWVCb2FyZCkgPT4ge1xuICAgIGlmIChoaXRSZWNvcmQuc2l6ZSA9PT0gMTAwKSByZXR1cm4gZmFsc2U7XG4gICAgbGV0IHJhbmRvbVJvdyA9IGdldFJhbmRvbVBvc2l0aW9uKGdhbWVCb2FyZCk7XG4gICAgbGV0IHJhbmRvbUNvbCA9IGdldFJhbmRvbVBvc2l0aW9uKGdhbWVCb2FyZCk7XG5cbiAgICB3aGlsZSAoaGFzQWxyZWF5SGl0KHJhbmRvbVJvdywgcmFuZG9tQ29sKSkge1xuICAgICAgcmFuZG9tUm93ID0gZ2V0UmFuZG9tUG9zaXRpb24oZ2FtZUJvYXJkKTtcbiAgICAgIHJhbmRvbUNvbCA9IGdldFJhbmRvbVBvc2l0aW9uKGdhbWVCb2FyZCk7XG4gICAgfVxuICAgIGdhbWVCb2FyZC5yZWNpZXZlQXR0YWNrKHJhbmRvbVJvdywgcmFuZG9tQ29sKTtcbiAgICBoaXRSZWNvcmQuYWRkKGAke3JhbmRvbVJvd30tJHtyYW5kb21Db2x9YCk7XG4gICAgcmV0dXJuIFtyYW5kb21Sb3csIHJhbmRvbUNvbF07XG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBnZXROYW1lLFxuICAgIGF0dGFjayxcbiAgICByYW5kb21BdHRhY2ssXG4gIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBQbGF5ZXI7XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBgKixcbio6OmJlZm9yZSxcbio6OmFmdGVyIHtcbiAgbWFyZ2luOiAwO1xuICBwYWRkaW5nOiAwO1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xufVxuXG5odG1sLFxuYm9keSB7XG4gIGhlaWdodDogMTAwJTtcbiAgd2lkdGg6IDEwMCU7XG59XG5cbi5ib2FyZHMge1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWFyb3VuZDtcbn1cblxuLmJvYXJkIHtcbiAgd2lkdGg6IG1heC1jb250ZW50O1xufVxuXG4ucm93IHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcbn1cblxuLmNlbGwge1xuICB3aWR0aDogMnJlbTtcbiAgYXNwZWN0LXJhdGlvOiAxO1xuICBib3JkZXI6IDFweCBzb2xpZCBibHVlO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG59XG5cbi5taXNzZWR7XG4gIGJhY2tncm91bmQtY29sb3I6IHJlZDtcbn1gLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9zdHlsZXMvc3R5bGVzLmNzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTs7O0VBR0UsU0FBUztFQUNULFVBQVU7RUFDVixzQkFBc0I7QUFDeEI7O0FBRUE7O0VBRUUsWUFBWTtFQUNaLFdBQVc7QUFDYjs7QUFFQTtFQUNFLGFBQWE7RUFDYiw2QkFBNkI7QUFDL0I7O0FBRUE7RUFDRSxrQkFBa0I7QUFDcEI7O0FBRUE7RUFDRSxhQUFhO0VBQ2IsbUJBQW1CO0FBQ3JCOztBQUVBO0VBQ0UsV0FBVztFQUNYLGVBQWU7RUFDZixzQkFBc0I7RUFDdEIsa0JBQWtCO0FBQ3BCOztBQUVBO0VBQ0UscUJBQXFCO0FBQ3ZCXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIiosXFxuKjo6YmVmb3JlLFxcbio6OmFmdGVyIHtcXG4gIG1hcmdpbjogMDtcXG4gIHBhZGRpbmc6IDA7XFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbn1cXG5cXG5odG1sLFxcbmJvZHkge1xcbiAgaGVpZ2h0OiAxMDAlO1xcbiAgd2lkdGg6IDEwMCU7XFxufVxcblxcbi5ib2FyZHMge1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYXJvdW5kO1xcbn1cXG5cXG4uYm9hcmQge1xcbiAgd2lkdGg6IG1heC1jb250ZW50O1xcbn1cXG5cXG4ucm93IHtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LWRpcmVjdGlvbjogcm93O1xcbn1cXG5cXG4uY2VsbCB7XFxuICB3aWR0aDogMnJlbTtcXG4gIGFzcGVjdC1yYXRpbzogMTtcXG4gIGJvcmRlcjogMXB4IHNvbGlkIGJsdWU7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxufVxcblxcbi5taXNzZWR7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZWQ7XFxufVwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLypcbiAgTUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcpIHtcbiAgdmFyIGxpc3QgPSBbXTtcblxuICAvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcbiAgICAgIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2YgaXRlbVs1XSAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGNvbnRlbnQgKz0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtKTtcbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSkuam9pbihcIlwiKTtcbiAgfTtcblxuICAvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuICBsaXN0LmkgPSBmdW5jdGlvbiBpKG1vZHVsZXMsIG1lZGlhLCBkZWR1cGUsIHN1cHBvcnRzLCBsYXllcikge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgbW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgdW5kZWZpbmVkXV07XG4gICAgfVxuICAgIHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG4gICAgaWYgKGRlZHVwZSkge1xuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0aGlzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIHZhciBpZCA9IHRoaXNba11bMF07XG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIF9rID0gMDsgX2sgPCBtb2R1bGVzLmxlbmd0aDsgX2srKykge1xuICAgICAgdmFyIGl0ZW0gPSBbXS5jb25jYXQobW9kdWxlc1tfa10pO1xuICAgICAgaWYgKGRlZHVwZSAmJiBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBsYXllciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW1bNV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChtZWRpYSkge1xuICAgICAgICBpZiAoIWl0ZW1bMl0pIHtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc3VwcG9ydHMpIHtcbiAgICAgICAgaWYgKCFpdGVtWzRdKSB7XG4gICAgICAgICAgaXRlbVs0XSA9IFwiXCIuY29uY2F0KHN1cHBvcnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNF0gPSBzdXBwb3J0cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIGxpc3Q7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHZhciBjb250ZW50ID0gaXRlbVsxXTtcbiAgdmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuICBpZiAoIWNzc01hcHBpbmcpIHtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuICBpZiAodHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjc3NNYXBwaW5nKSkpKTtcbiAgICB2YXIgZGF0YSA9IFwic291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsXCIuY29uY2F0KGJhc2U2NCk7XG4gICAgdmFyIHNvdXJjZU1hcHBpbmcgPSBcIi8qIyBcIi5jb25jYXQoZGF0YSwgXCIgKi9cIik7XG4gICAgcmV0dXJuIFtjb250ZW50XS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKFwiXFxuXCIpO1xuICB9XG4gIHJldHVybiBbY29udGVudF0uam9pbihcIlxcblwiKTtcbn07IiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlcy5jc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlcy5jc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHN0eWxlc0luRE9NID0gW107XG5mdW5jdGlvbiBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKSB7XG4gIHZhciByZXN1bHQgPSAtMTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXNJbkRPTS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdHlsZXNJbkRPTVtpXS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XG4gICAgICByZXN1bHQgPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5mdW5jdGlvbiBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucykge1xuICB2YXIgaWRDb3VudE1hcCA9IHt9O1xuICB2YXIgaWRlbnRpZmllcnMgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldO1xuICAgIHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuICAgIHZhciBjb3VudCA9IGlkQ291bnRNYXBbaWRdIHx8IDA7XG4gICAgdmFyIGlkZW50aWZpZXIgPSBcIlwiLmNvbmNhdChpZCwgXCIgXCIpLmNvbmNhdChjb3VudCk7XG4gICAgaWRDb3VudE1hcFtpZF0gPSBjb3VudCArIDE7XG4gICAgdmFyIGluZGV4QnlJZGVudGlmaWVyID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgIGNzczogaXRlbVsxXSxcbiAgICAgIG1lZGlhOiBpdGVtWzJdLFxuICAgICAgc291cmNlTWFwOiBpdGVtWzNdLFxuICAgICAgc3VwcG9ydHM6IGl0ZW1bNF0sXG4gICAgICBsYXllcjogaXRlbVs1XVxuICAgIH07XG4gICAgaWYgKGluZGV4QnlJZGVudGlmaWVyICE9PSAtMSkge1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnJlZmVyZW5jZXMrKztcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS51cGRhdGVyKG9iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB1cGRhdGVyID0gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucyk7XG4gICAgICBvcHRpb25zLmJ5SW5kZXggPSBpO1xuICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKGksIDAsIHtcbiAgICAgICAgaWRlbnRpZmllcjogaWRlbnRpZmllcixcbiAgICAgICAgdXBkYXRlcjogdXBkYXRlcixcbiAgICAgICAgcmVmZXJlbmNlczogMVxuICAgICAgfSk7XG4gICAgfVxuICAgIGlkZW50aWZpZXJzLnB1c2goaWRlbnRpZmllcik7XG4gIH1cbiAgcmV0dXJuIGlkZW50aWZpZXJzO1xufVxuZnVuY3Rpb24gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucykge1xuICB2YXIgYXBpID0gb3B0aW9ucy5kb21BUEkob3B0aW9ucyk7XG4gIGFwaS51cGRhdGUob2JqKTtcbiAgdmFyIHVwZGF0ZXIgPSBmdW5jdGlvbiB1cGRhdGVyKG5ld09iaikge1xuICAgIGlmIChuZXdPYmopIHtcbiAgICAgIGlmIChuZXdPYmouY3NzID09PSBvYmouY3NzICYmIG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmIG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXAgJiYgbmV3T2JqLnN1cHBvcnRzID09PSBvYmouc3VwcG9ydHMgJiYgbmV3T2JqLmxheWVyID09PSBvYmoubGF5ZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgYXBpLnVwZGF0ZShvYmogPSBuZXdPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcGkucmVtb3ZlKCk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gdXBkYXRlcjtcbn1cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGxpc3QsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGxpc3QgPSBsaXN0IHx8IFtdO1xuICB2YXIgbGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpO1xuICByZXR1cm4gZnVuY3Rpb24gdXBkYXRlKG5ld0xpc3QpIHtcbiAgICBuZXdMaXN0ID0gbmV3TGlzdCB8fCBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGlkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbaV07XG4gICAgICB2YXIgaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4XS5yZWZlcmVuY2VzLS07XG4gICAgfVxuICAgIHZhciBuZXdMYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obmV3TGlzdCwgb3B0aW9ucyk7XG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciBfaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tfaV07XG4gICAgICB2YXIgX2luZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoX2lkZW50aWZpZXIpO1xuICAgICAgaWYgKHN0eWxlc0luRE9NW19pbmRleF0ucmVmZXJlbmNlcyA9PT0gMCkge1xuICAgICAgICBzdHlsZXNJbkRPTVtfaW5kZXhdLnVwZGF0ZXIoKTtcbiAgICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKF9pbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuICAgIGxhc3RJZGVudGlmaWVycyA9IG5ld0xhc3RJZGVudGlmaWVycztcbiAgfTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBtZW1vID0ge307XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZ2V0VGFyZ2V0KHRhcmdldCkge1xuICBpZiAodHlwZW9mIG1lbW9bdGFyZ2V0XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHZhciBzdHlsZVRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTtcblxuICAgIC8vIFNwZWNpYWwgY2FzZSB0byByZXR1cm4gaGVhZCBvZiBpZnJhbWUgaW5zdGVhZCBvZiBpZnJhbWUgaXRzZWxmXG4gICAgaWYgKHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCAmJiBzdHlsZVRhcmdldCBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gVGhpcyB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBhY2Nlc3MgdG8gaWZyYW1lIGlzIGJsb2NrZWRcbiAgICAgICAgLy8gZHVlIHRvIGNyb3NzLW9yaWdpbiByZXN0cmljdGlvbnNcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBzdHlsZVRhcmdldC5jb250ZW50RG9jdW1lbnQuaGVhZDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHRcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cbiAgICBtZW1vW3RhcmdldF0gPSBzdHlsZVRhcmdldDtcbiAgfVxuICByZXR1cm4gbWVtb1t0YXJnZXRdO1xufVxuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydEJ5U2VsZWN0b3IoaW5zZXJ0LCBzdHlsZSkge1xuICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KGluc2VydCk7XG4gIGlmICghdGFyZ2V0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnQnIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcbiAgfVxuICB0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xufVxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRCeVNlbGVjdG9yOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKSB7XG4gIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICBvcHRpb25zLnNldEF0dHJpYnV0ZXMoZWxlbWVudCwgb3B0aW9ucy5hdHRyaWJ1dGVzKTtcbiAgb3B0aW9ucy5pbnNlcnQoZWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydFN0eWxlRWxlbWVudDsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMoc3R5bGVFbGVtZW50KSB7XG4gIHZhciBub25jZSA9IHR5cGVvZiBfX3dlYnBhY2tfbm9uY2VfXyAhPT0gXCJ1bmRlZmluZWRcIiA/IF9fd2VicGFja19ub25jZV9fIDogbnVsbDtcbiAgaWYgKG5vbmNlKSB7XG4gICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm5vbmNlXCIsIG5vbmNlKTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXM7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopIHtcbiAgdmFyIGNzcyA9IFwiXCI7XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChvYmouc3VwcG9ydHMsIFwiKSB7XCIpO1xuICB9XG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJAbWVkaWEgXCIuY29uY2F0KG9iai5tZWRpYSwgXCIge1wiKTtcbiAgfVxuICB2YXIgbmVlZExheWVyID0gdHlwZW9mIG9iai5sYXllciAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIkBsYXllclwiLmNvbmNhdChvYmoubGF5ZXIubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChvYmoubGF5ZXIpIDogXCJcIiwgXCIge1wiKTtcbiAgfVxuICBjc3MgKz0gb2JqLmNzcztcbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cbiAgdmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG4gIGlmIChzb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiLmNvbmNhdChidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpLCBcIiAqL1wiKTtcbiAgfVxuXG4gIC8vIEZvciBvbGQgSUVcbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuICBvcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xufVxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xuICAvLyBpc3RhbmJ1bCBpZ25vcmUgaWZcbiAgaWYgKHN0eWxlRWxlbWVudC5wYXJlbnROb2RlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XG59XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gZG9tQVBJKG9wdGlvbnMpIHtcbiAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHJldHVybiB7XG4gICAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZSgpIHt9LFxuICAgICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7fVxuICAgIH07XG4gIH1cbiAgdmFyIHN0eWxlRWxlbWVudCA9IG9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuICByZXR1cm4ge1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKG9iaikge1xuICAgICAgYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcbiAgICB9XG4gIH07XG59XG5tb2R1bGUuZXhwb3J0cyA9IGRvbUFQSTsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCkge1xuICBpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHdoaWxlIChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xuICAgICAgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcbiAgICB9XG4gICAgc3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHN0eWxlVGFnVHJhbnNmb3JtOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0aWQ6IG1vZHVsZUlkLFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5jID0gdW5kZWZpbmVkOyIsImltcG9ydCBcIi4vc3R5bGVzL3N0eWxlcy5jc3NcIjtcbmltcG9ydCBnYW1lIGZyb20gXCIuL21vZHVsZXMvZ2FtZVwiO1xuXG5nYW1lKCk7Il0sIm5hbWVzIjpbIkRPTWNvbnRyb2xsZXIiLCJjcmVhdGVDZWxsIiwicm93SW5kZXgiLCJjb2x1bW5JbmRleCIsImNlbGwiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc0xpc3QiLCJhZGQiLCJzZXRBdHRyaWJ1dGUiLCJjcmVhdGVSb3ciLCJyb3dBcnJheSIsInJvdyIsImoiLCJsZW5ndGgiLCJhcHBlbmRDaGlsZCIsInJlbmRlckdhbWVCb2FyZCIsImdhbWVCb2FyZCIsImJvYXJkQXJyYXkiLCJnZXRCb2FyZCIsImJvYXJkIiwiaSIsImFkZENlbGxFdmVudHMiLCJ1c2VyIiwiY29tcHV0ZXIiLCJ1c2VyQm9hcmQiLCJjb21wdXRlckJvYXJkIiwiY2VsbHMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiZm9yRWFjaCIsImFkZEV2ZW50TGlzdGVuZXIiLCJhdHRhY2siLCJnZXRBdHRyaWJ1dGUiLCJjb21wdXRlckNlbGxDb29yZHMiLCJyYW5kb21BdHRhY2siLCJjb21wdXRlckNlbGwiLCJxdWVyeVNlbGVjdG9yIiwiR2FtZUJvYXJkIiwiUGxheWVyIiwiZ2FtZSIsImRvbUNvbnRyb2xsZXIiLCJjb21wdXRlckJvYXJkQ29udGFpbmVyIiwidXNlckJvYXJkQ29udGFpbmVyIiwic2l6ZSIsImFyZ3VtZW50cyIsInVuZGVmaW5lZCIsIm1pc3NlZFNob3RzIiwic2hpcHMiLCJwdXNoIiwiZ2V0TWlzc2VkU2hvdHMiLCJpc1Bvc2l0aW9uT3V0T2ZCb3VuZHMiLCJjb2x1bW4iLCJpc1NoaXBFbmRPdXRPZkJvdW5kcyIsInNoaXAiLCJpc1ZlcnRpY2FsIiwiZ2V0TGVuZ3RoIiwiaXNQb3NpdGlvblRha2VuIiwiaXNOZWlnaGJvclRha2VuIiwiaXNWYWxpZFBvc2l0aW9uIiwicGxhY2VTaGlwIiwicmVjaWV2ZUF0dGFjayIsImhpdCIsImlzQWxsU2hpcHNTdW5rIiwiZXZlcnkiLCJpc1N1bmsiLCJuYW1lIiwiaGl0UmVjb3JkIiwiU2V0IiwiaGFzQWxyZWF5SGl0IiwiaGFzIiwiaXNJbnZhbGlkUG9zaXRpb24iLCJnZXRSYW5kb21Qb3NpdGlvbiIsIk1hdGgiLCJmbG9vciIsInJhbmRvbSIsImdldE5hbWUiLCJyYW5kb21Sb3ciLCJyYW5kb21Db2wiXSwic291cmNlUm9vdCI6IiJ9