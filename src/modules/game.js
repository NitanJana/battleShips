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

  const playTurn = async () => {
    const userCellCoords = await domController.getUserMove();
    const userAttackSuccess = user.attack(
      userCellCoords[0],
      userCellCoords[1],
      userBoard,
    );

    if (userAttackSuccess) {
      domController.handleCellUpdate(
        userCellCoords,
        userBoard.getMissedShots(),
        user,
      );
    }

    const computerCellCoords = computer.randomAttack(computerBoard);

    domController.handleCellUpdate(
      computerCellCoords,
      computerBoard.getMissedShots(),
      computer,
    );

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

export default game;
