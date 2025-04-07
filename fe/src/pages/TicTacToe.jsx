import { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from '../config';

export default function TicTacToe() {
    const [board, setBoard] = useState([
        ['', '', ''],
        ['', '', ''],
        ['', '', ''],
    ]);
    const [currentPlayer, setCurrentPlayer] = useState('X');
    const [winner, setWinner] = useState(null);
    const [mode, setMode] = useState('PVP'); // 'PVP' or 'PVC'

    const handleClick = async (row, col) => {
        if (board[row][col] !== '' || winner) return;

        try {
            if (mode === 'PVP') {
                const response = await axios.post(`${BACKEND_URL}/api/tictactoe/move`, {
                    board,
                    x: row,
                    y: col,
                    player: currentPlayer,
                });

                const { board: newBoard, winner: win, is_draw, next_player } = response.data;
                setBoard(newBoard);
                setWinner(win || (is_draw ? 'Draw' : null));
                if (!win && !is_draw) setCurrentPlayer(next_player);
            } else {
                const response = await axios.post(`${BACKEND_URL}/api/tictactoe/vs-computer`, {
                    board,
                    x: row,
                    y: col,
                });

                const { board: newBoard, winner: win, is_draw } = response.data;
                setBoard(newBoard);
                setWinner(win || (is_draw ? 'Draw' : null));
                if (!win && !is_draw) setCurrentPlayer('X'); // Always X for player
            }
        } catch (err) {
            console.error("Move error:", err.response?.data || err.message);
        }
    };

    const resetGame = () => {
        setBoard([
            ['', '', ''],
            ['', '', ''],
            ['', '', ''],
        ]);
        setCurrentPlayer('X');
        setWinner(null);
    };

    const handleModeChange = (newMode) => {
        setMode(newMode);
        resetGame();
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 relative isolate px-2 pt-0 lg:px-8 z-0">
            <div
                aria-hidden="true"
                className="absolute inset-x-0 -top-500 overflow-hidden blur-3xl"
            >
                <div
                    className="relative left-0 top-0 h-screen w-30 rotate-[0deg] bg-gradient-to-br from-[#ff80b5] to-[#8c84f1] opacity-60 blur-3xl"
                />
            </div>
            <h1 className="text-3xl font-bold mb-6 relative z-10">Tic Tac Toe</h1>

            <div className="relative z-10 flex space-x-4 mb-6">
                <button
                    className={`px-4 py-2 rounded ${mode === 'PVP' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-blue-600'}`}
                    onClick={() => handleModeChange('PVP')}
                >
                    2 Players
                </button>
                <button
                    className={`px-4 py-2 rounded ${mode === 'PVC' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-blue-600'}`}
                    onClick={() => handleModeChange('PVC')}
                >
                    Vs Computer
                </button>
            </div>

            <div className="grid grid-cols-3 gap-2 relative z-10">
                {board.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                        <button
                            key={`${rowIndex}-${colIndex}`}
                            onClick={() => handleClick(rowIndex, colIndex)}
                            className="w-24 h-24 text-2xl font-bold bg-white shadow rounded hover:bg-gray-200"
                        >
                            {cell}
                        </button>
                    ))
                )}
            </div>

            <button
                onClick={resetGame}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 relative z-10"
            >
                Restart
            </button>
            <div className="h-8 mt-2 text-xl font-semibold relative z-10 flex items-center justify-center">
                {winner && (
                    <span>
                        {winner === 'Draw' ? "It's a Draw!" : `Winner: ${winner}`}
                    </span>
                )}
            </div>
        </div>
    );
}