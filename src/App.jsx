import { useState } from "react";
import "./App.css";

const WINNING_PATTERNS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const getWinner = (board) => {
  for (const [a, b, c] of WINNING_PATTERNS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { player: board[a], cells: [a, b, c] };
    }
  }
  return null;
};

function App() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState("X");
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });
  const [winner, setWinner] = useState(null); // "X" | "O" | null
  const [isDraw, setIsDraw] = useState(false);
  const [winningCells, setWinningCells] = useState([]);

  const gameOver = winner !== null || isDraw;

  const handleClick = (index) => {
    if (board[index] || gameOver) return;

    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);

    const result = getWinner(newBoard);
    if (result) {
      setWinner(result.player);
      setWinningCells(result.cells);
      setScores((prev) => ({
        ...prev,
        [result.player]: prev[result.player] + 1,
      }));
      return;
    }

    if (newBoard.every((cell) => cell !== null)) {
      setIsDraw(true);
      setScores((prev) => ({ ...prev, draws: prev.draws + 1 }));
      return;
    }

    setTurn(turn === "X" ? "O" : "X");
  };

  const restartRound = () => {
    setBoard(Array(9).fill(null));
    setTurn("X");
    setWinner(null);
    setIsDraw(false);
    setWinningCells([]);
  };

  const resetAll = () => {
    restartRound();
    setScores({ X: 0, O: 0, draws: 0 });
  };

  let message = `${turn}'s Turn`;
  if (winner) message = `${winner} Wins!`;
  else if (isDraw) message = "It's a Draw!";

  return (
    <div className="app">
      <h1 className="title">Tic-Tac-Toe</h1>

      <div className="scores">
        <div className="score-card">
          <p className="score-text">{`X: ${scores.X}`}</p>
        </div>
        <div className="score-card">
          <p className="score-text">{`Draws: ${scores.draws}`}</p>
        </div>
        <div className="score-card">
          <p className="score-text">{`O: ${scores.O}`}</p>
        </div>
      </div>

      <p className="turn-message">{message}</p>

      <div className="board">
        {board.map((cell, index) => (
          <button
            key={index}
            className={`cell ${cell ? cell.toLowerCase() : ""} ${
              winningCells.includes(index) ? "winning" : ""
            }`}
            onClick={() => handleClick(index)}
          >
            {cell}
          </button>
        ))}
      </div>

      <div className="actions">
        <button className="btn primary" onClick={restartRound}>
          {winner ? "Play Again" : "Restart Round"}
        </button>
        <button className="btn secondary" onClick={resetAll}>
          Reset All
        </button>
      </div>
    </div>
  );
}

export default App;