function GameBoard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  const Cell = () => {
    let value = 0;
    const marker = playerMarker => (value = playerMarker);
    const getValue = () => value;

    return { marker, getValue };
  };

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board
  const printGameBoard = () => board.map(row => row.map( cell => cell.getValue()));


  return {
    getBoard,
    printGameBoard,
  };
}

function GameController() {
  const board = GameBoard();
  const makePlayer = (name, marker) => {
    return { name, marker };
  };

  const players = [makePlayer('player1', 'O'), makePlayer('player2', 'X')];

  console.table(board.printGameBoard());
}

GameController()