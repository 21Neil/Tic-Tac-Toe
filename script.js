function GameBoard() {
  const board = [];

  const cellFunction = value => ({
    marker: playerMarker => (value = playerMarker),
    getValue: () => value,
  });

  const cell = () => {
    let value = 0;

    return Object.assign({}, cellFunction(value));
  };
  
  const initBoard = () => {
    const rows = 3;
    const columns = 3;
    board.length = 0;

    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
        board[i].push(cell());
      }
    }
  };

  initBoard();

  const getBoard = () => board;
  const printBoard = () => board.map(row => row.map(cell => cell.getValue()));
  

  return {
    initBoard,
    getBoard,
    printBoard,
  };
}

function Game(playerOneName = 'player1', playerTwoName = 'player2') {
  const board = GameBoard();
  const makePlayer = (name, marker) => ({ name, marker });
  const players = [makePlayer(playerOneName, 'O'), makePlayer(playerTwoName, 'X')];
  let activePlayer = players[0];
  let endGame = '';

  console.log('game start!');

  board.initBoard();

  const getActivePlayer = () => activePlayer;

  const switchPlayer = () => (activePlayer = activePlayer === players[0] ? players[1] : players[0]);

  const getEndGame = () => endGame;

  const printNewRound = () => {
    console.table(board.printBoard());
    console.log(activePlayer.name + ' round');
  };

  const isValidMove = (row, col) => board.getBoard()[row][col].getValue() !== 0;

  const makeMove = (row, col) => board.getBoard()[row][col].marker(activePlayer.marker);

  const checkWin = (row, col) => {
    const getBoard = board.getBoard();
    const marker = activePlayer.marker;

    const checkLine = cells => cells.every(cell => cell.getValue() === marker);

    if (
      checkLine(getBoard[row]) ||
      checkLine(getBoard.map(row => row[col])) ||
      (row === col && checkLine(getBoard.map((row, i) => row[i]))) ||
      (+row + +col === 2 && checkLine(getBoard.map((row, i) => row[2 - i])))
    )
      return activePlayer.name;
    return false;
  };

  const checkTie = () => {
    if (board.printBoard().every(row => row.every(cell => cell))) return 'tie';
    return false;
  };

  const isGameOver = (row, col) => {
    return checkWin(row, col) || checkTie();
  };

  const playRound = (row, col) => {
    if (isGameOver(row, col)) {
      return;
    }
    if (isValidMove(row, col)) {
      console.log("You can't replace it!");
      return;
    }
    makeMove(row, col);
    console.log(isGameOver(row, col));
    if (isGameOver(row, col)) {
      endGame = isGameOver(row, col);
      console.log(endGame === 'tie' ? 'Tie!' : endGame + ' win!');
      return endGame === 'tie' ? 'Tie!' : endGame + ' win!';
    }
    switchPlayer();
    printNewRound();
    return;
  };

  printNewRound();

  return {
    playRound,
    getActivePlayer,
    getBoard: board.printBoard,
    getEndGame,
  };
}

function ScreenController() {
  const startBtn = document.querySelector('.startBtn');
  const playerTurnDiv = document.querySelector('.turn');
  const boardDiv = document.querySelector('.board');

  function startBtnOnClick() {
    const restartBtn = document.querySelector('.restartBtn');
    const playerOne = document.querySelector('#player1Name');
    const playerTwo = document.querySelector('#player2Name');
    const players = document.querySelector('.players');

    players.classList.add('display-none');
    startBtn.classList.add('display-none');
    restartBtn.classList.remove('display-none');
    restartBtn.addEventListener('click', restartBtnOnClick);

    const game = Game(playerOne.value, playerTwo.value);

    const printBoard = game => {
      game.getBoard().forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          const cellButton = document.createElement('button');
          cellButton.dataset.row = rowIndex;
          cellButton.dataset.col = colIndex;
          boardDiv.append(cellButton);
          cellButton.addEventListener('click', cellOnClick);
        });
      });
      playerTurnDiv.textContent = game.getActivePlayer().name + ' turn';
      return;
    };

    const endGame = () => {
      const result = game.getEndGame();
      const allCells = document.querySelectorAll('.board button');

      playerTurnDiv.textContent = result === 'tie' ? 'Tie!' : result + ' win!';
      allCells.forEach(cell => cell.removeEventListener('click', cellOnClick));
      return;
    };

    function cellOnClick(e) {
      const targetRow = e.target.dataset.row;
      const targetCol = e.target.dataset.col;
      const result = game.playRound(targetRow, targetCol);
      e.target.classList.add(game.getBoard()[targetRow][targetCol] === 'O' ? 'circle' : 'cross');
      if (game.getEndGame()) {
        endGame();
        return;
      }
      playerTurnDiv.textContent = game.getActivePlayer().name + ' turn';
      return;
    }

    function restartBtnOnClick() {
      restartBtn.classList.add('display-none');
      startBtn.classList.remove('display-none');
      playerOne.classList.remove('display-none');
      playerTwo.classList.remove('display-none');
      startBtn.addEventListener('click', startBtnOnClick);

      restartBtn.removeEventListener('click', restartBtnOnClick);
    }

    printBoard(game);

    startBtn.removeEventListener('click', startBtnOnClick);
  }

  startBtn.addEventListener('click', startBtnOnClick);
}

ScreenController();
