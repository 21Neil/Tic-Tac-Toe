function GameBoard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  let marker = value => ({ makeMarker: playerMarker => (value = playerMarker) });
  const getValue = value => ({ value: () => value });

  const Cell = () => {
    let value = 0;

    return Object.assign({}, marker(value), getValue(value));
  };

  console.log(Cell())

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const printGameBoard = () => {
    console.log(board);
  };

  return {
    printGameBoard,
  };
}

function Player() {

  const makePlayer = (name, token) => {
    return {name, token}
  }

  const players = [
    makePlayer('player1', 'O'),
    makePlayer('player2', 'X')
  ]

  console.log(players)
  
}

GameBoard().printGameBoard();
Player()