import DOMcontroller from "./DOMcontroller";
import GameBoard from "./gameBoard";
import Player from "./player";
import Ship from "./ship";

const game = () => {
  const user = Player("user");
  const computer = Player("computer");
  const userBoard = GameBoard();
  const computerBoard = GameBoard();
  const domController = DOMcontroller();
  const newShip = Ship(3);
  userBoard.placeShip(2, 2, newShip);
  const newShip2 = Ship(3);
  computerBoard.placeShip(4, 2, newShip2);

  const computerBoardContainer = document.querySelector(
    ".computerBoardContainer",
  );
  const userBoardContainer = document.querySelector(".userBoardContainer");
  computerBoardContainer.appendChild(
    domController.renderGameBoard(computerBoard),
  );
  userBoardContainer.appendChild(domController.renderGameBoard(userBoard));
  domController.addCellEvents(user, computer, userBoard, computerBoard);
};

export default game;
