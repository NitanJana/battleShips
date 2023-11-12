import DOMcontroller from "./DOMcontroller";
import GameBoard from "./gameBoard";
import Player from "./player";

const game = () => {
  const user = Player("user");
  const computer = Player("computer");
  const userBoard = GameBoard();
  const computerBoard = GameBoard();
  const domController = DOMcontroller();

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
