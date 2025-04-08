import React, { useState } from 'react';
import axios from 'axios';
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from 'framer-motion';
import { BACKEND_URL } from "../config";

const EmptyBoard = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
];

const EightPuzzleSolver = () => {
    const [start, setStart] = useState(EmptyBoard);
    const [goal, setGoal] = useState(EmptyBoard);
    const [solution, setSolution] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (boardType, row, col, value) => {
        const originalBoard = boardType === 'start' ? start : goal;
        const newBoard = originalBoard.map(row => [...row]);
        newBoard[row][col] = value === '' ? '' : parseInt(value);
        boardType === 'start' ? setStart(newBoard) : setGoal(newBoard);
    };

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            setError('');
            setSolution([]);
            const payload = { start, goal };
            const response = await axios.post(`${BACKEND_URL}/api/eight-puzzle-gbfs`, payload);
            const { success, path } = response.data;

            if (!success || !path || path.length === 0) {
                setError('Solution not possible');
                setSolution([]);
            } else {
                setSolution(path);
            }
        } catch (err) {
            console.error(err);
            setError('Invalid input or no solution found');
            setSolution([]);
        } finally {
            setIsLoading(false);
        }
    };

    const renderBoard = (board) => (
        <div className="grid grid-cols-3 gap-1">
            {board.map((row, i) =>
                row.map((cell, j) => (
                    <div
                        key={`${i}-${j}`}
                        className="w-16 h-12 flex items-center justify-center bg-white/50 border border-gray-100 text-lg font-semibold rounded-lg backdrop-blur-md shadow"
                    >
                        {cell !== 0 ? cell : ''}
                    </div>
                ))
            )}
        </div>
    );

    const renderInputGrid = (boardType) => (
        <div className="grid grid-cols-3 gap-1">
            {(boardType === 'start' ? start : goal).map((row, i) =>
                row.map((cell, j) => (
                    <input
                        key={`${i}-${j}-${boardType}`}
                        type="text"
                        className="w-24 h-12 text-center border border-gray-100 rounded-lg bg-white/40 backdrop-blur-md shadow"
                        min={0}
                        max={8}
                        value={cell}
                        onChange={(e) => handleChange(boardType, i, j, e.target.value)}
                    />
                ))
            )}
        </div>
    );

    return (
        <div className="relative min-h-screen">
            <div
                aria-hidden="true"
                className="absolute inset-x-0 -top-500 overflow-hidden blur-3xl -z-10"
            >
                <div className="relative left-0 top-0 h-[700px] rotate-[0deg] bg-gradient-to-br from-[#ff80b5] to-[#8c84f1] opacity-60 blur-2xl" />
            </div>
            <div className="p-8 max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6 text-center z-10">8 Puzzle Solver (Greedy Best First Search)</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="p-4 border rounded-lg shadow bg-white/70 backdrop-blur-sm">
                        <h2 className="text-lg font-semibold mb-2">Start State</h2>
                        {renderInputGrid('start')}
                    </div>
                    <div className="p-4 border rounded-lg shadow bg-white/70 backdrop-blur-sm">
                        <h2 className="text-lg font-semibold mb-2">Goal State</h2>
                        {renderInputGrid('goal')}
                    </div>
                </div>

                <button
                    onClick={handleSubmit}
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition duration-200 mb-6"
                    disabled={isLoading}
                >
                    {isLoading ? 'Solving...' : 'Solve Puzzle'}
                </button>

                {error && <p className="text-red-600 font-semibold">{error}</p>}

                {isLoading && (
                    <p className="text-center font-medium text-gray-600 animate-pulse mb-6">
                        Preparing solution...
                    </p>
                )}

                {!isLoading && solution.length > 0 && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Solution ({solution.length} steps):</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <AnimatePresence>
                                {solution.map((state, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 1, delay: index * 0.1 }}
                                        className="p-4 border rounded-lg shadow bg-white/70 backdrop-blur-sm"
                                    >
                                        <h3 className="text-sm font-medium mb-2">Step {index + 1}</h3>
                                        {renderBoard(state)}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EightPuzzleSolver;