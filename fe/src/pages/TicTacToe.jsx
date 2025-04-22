import { useState, useEffect } from "react";
import axios from "axios";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
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
    const [winningCells, setWinningCells] = useState([]);
    const [lastPlaced, setLastPlaced] = useState(null);

    useEffect(() => {
        if (winner && winner !== 'Draw') {
            confetti({
                particleCount: 200,
                spread: 80,
                origin: { y: 0.6 },
                scalar: 1.6,
            });
        }
    }, [winner]);

    // Check for winning combination
    const checkWinningCells = (board, player) => {
        // Check rows
        for (let i = 0; i < 3; i++) {
            if (board[i][0] === player && board[i][1] === player && board[i][2] === player) {
                return [[i, 0], [i, 1], [i, 2]];
            }
        }

        // Check columns
        for (let i = 0; i < 3; i++) {
            if (board[0][i] === player && board[1][i] === player && board[2][i] === player) {
                return [[0, i], [1, i], [2, i]];
            }
        }

        // Check diagonals
        if (board[0][0] === player && board[1][1] === player && board[2][2] === player) {
            return [[0, 0], [1, 1], [2, 2]];
        }

        if (board[0][2] === player && board[1][1] === player && board[2][0] === player) {
            return [[0, 2], [1, 1], [2, 0]];
        }

        return [];
    };

    const handleClick = async (row, col) => {
        if (board[row][col] !== '' || winner) return;

        setLastPlaced({ row, col });

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

                if (win) {
                    const winCells = checkWinningCells(newBoard, win);
                    setWinningCells(winCells);
                    setWinner(win);
                } else if (is_draw) {
                    setWinner('Draw');
                } else {
                    setCurrentPlayer(next_player);
                }
            } else {
                const response = await axios.post(`${BACKEND_URL}/api/tictactoe/vs-computer`, {
                    board,
                    x: row,
                    y: col,
                });

                const { board: newBoard, winner: win, is_draw } = response.data;
                setBoard(newBoard);

                if (win) {
                    const winCells = checkWinningCells(newBoard, win);
                    setWinningCells(winCells);
                    setWinner(win);
                } else if (is_draw) {
                    setWinner('Draw');
                } else {
                    // Find the computer's move (the cell that changed from empty to 'O')
                    for (let i = 0; i < 3; i++) {
                        for (let j = 0; j < 3; j++) {
                            if (board[i][j] === '' && newBoard[i][j] === 'O') {
                                setLastPlaced({ row: i, col: j });
                            }
                        }
                    }
                    setCurrentPlayer('X');
                }
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
        setWinningCells([]);
        setLastPlaced(null);
    };

    const handleModeChange = (newMode) => {
        setMode(newMode);
        resetGame();
    };

    const isWinningCell = (row, col) => {
        return winningCells.some(cell => cell[0] === row && cell[1] === col);
    };

    const isLastPlaced = (row, col) => {
        return lastPlaced && lastPlaced.row === row && lastPlaced.col === col;
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 relative isolate px-2 pt-0 lg:px-8 z-0">
            <div
                aria-hidden="true"
                className="absolute inset-x-0 -top-500 overflow-hidden blur-3xl"
            >
                <motion.div
                    className="relative left-0 top-0 h-[700px] bg-gradient-to-br from-[#ff80b5] to-[#8c84f1] opacity-60 blur-2xl"
                    animate={{
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.05, 0.95, 1]
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                />
            </div>
            <motion.h1
                className="text-3xl font-bold mb-6 relative z-10"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                }}
            >
                Tic Tac Toe
            </motion.h1>

            <div className="relative z-10 flex space-x-4 mb-6">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded ${mode === 'PVP' ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 border border-indigo-600'}`}
                    onClick={() => handleModeChange('PVP')}
                >
                    2 Players
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded ${mode === 'PVC' ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 border border-indigo-600'}`}
                    onClick={() => handleModeChange('PVC')}
                >
                    Vs Computer
                </motion.button>
            </div>

            <AnimatePresence mode="wait">
                {!winner && (
                    <motion.div
                        key="turn-indicator"
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className="mb-4 text-xl font-semibold relative z-10 bg-white px-6 py-3 rounded-lg shadow-md"
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{
                                scale: 1,
                                transition: { type: "spring", stiffness: 300, damping: 10 }
                            }}
                            key={currentPlayer} // This makes it re-animate when player changes
                        >
                            <span className={currentPlayer === 'X' ? 'text-blue-600' : 'text-red-600'}>
                                Current Turn: <span className="font-bold">{currentPlayer}</span>
                                {mode === 'PVC' && currentPlayer === 'O' ? ' (Computer)' : ''}
                            </span>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-3 gap-2 relative z-10">
                {board.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                        <motion.button
                            key={`${rowIndex}-${colIndex}`}
                            onClick={() => handleClick(rowIndex, colIndex)}
                            className={`w-24 h-24 text-4xl font-bold bg-white shadow-lg rounded-lg
                                ${cell === 'X' ? 'text-blue-600' : cell === 'O' ? 'text-red-600' : ''}
                                ${isWinningCell(rowIndex, colIndex) ? 'ring-4 ring-green-500' : ''}
                            `}
                            disabled={winner || (mode === 'PVC' && currentPlayer === 'O')}
                            whileHover={cell === '' && !winner ? { scale: 1.05, backgroundColor: "#f9fafb" } : {}}
                            whileTap={cell === '' && !winner ? { scale: 0.95 } : {}}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                rotate: isWinningCell(rowIndex, colIndex) ? [0, 5, -5, 0] : 0,
                                backgroundColor: isWinningCell(rowIndex, colIndex) ? ["#ffffff", "#ecfdf5", "#ffffff"] : "#ffffff"
                            }}
                            transition={{
                                duration: isWinningCell(rowIndex, colIndex) ? 0.8 : 0.3,
                                repeat: isWinningCell(rowIndex, colIndex) ? Infinity : 0,
                                repeatType: "reverse"
                            }}
                        >
                            {cell && (
                                <motion.span
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{
                                        scale: 1,
                                        rotate: 0,
                                        transition: {
                                            type: "spring",
                                            stiffness: 260,
                                            damping: 20,
                                            delay: isLastPlaced(rowIndex, colIndex) ? 0 : 0.2
                                        }
                                    }}
                                >
                                    {cell}
                                </motion.span>
                            )}
                        </motion.button>
                    ))
                )}
            </div>

            <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "#4f46e5" }}
                whileTap={{ scale: 0.95 }}
                onClick={resetGame}
                className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 relative z-10 shadow-md font-medium"
            >
                Restart Game
            </motion.button>

            <AnimatePresence>
                {winner && (
                    <motion.div
                        className="mt-4 py-3 px-8 text-2xl font-bold relative z-10 bg-white rounded-xl shadow-lg"
                        initial={{ opacity: 0, scale: 0.5, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30, delay: 0.5 }}
                    >
                        <span className={winner === 'X' ? 'text-blue-600' : winner === 'O' ? 'text-red-600' : 'text-gray-800'}>
                            {winner === 'Draw' ? "It's a Draw!" : `🎉 Winner: ${winner} 🎉`}
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}