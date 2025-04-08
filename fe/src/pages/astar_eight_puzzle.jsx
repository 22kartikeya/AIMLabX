import React, { useState, useEffect } from "react";
import axios from "axios";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { BACKEND_URL } from "../config";

const EmptyBoard = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
];

export default function AstarEightPuzzle() {
    const [isPuzzle, setIsPuzzle] = useState(true);
    const [start, setStart] = useState(EmptyBoard);
    const [goal, setGoal] = useState(EmptyBoard);
    const [jugStart, setJugStart] = useState([ ]);
    const [jugGoal, setJugGoal] = useState([ ]);
    const [jugCapacity, setJugCapacity] = useState([ ]);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [animatedPath, setAnimatedPath] = useState([]);
    const [animationRunning, setAnimationRunning] = useState(false);

    const handleChange = (boardType, row, col, value) => {
        const originalBoard = boardType === "start" ? start : goal;
        const newBoard = originalBoard.map((r) => [...r]);
        newBoard[row][col] = value === "" ? "" : parseInt(value);
        boardType === "start" ? setStart(newBoard) : setGoal(newBoard);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setResult(null);
        setError("");

        try {
            const res = await axios.post(
                `${BACKEND_URL}/api/${isPuzzle ? "eight-puzzle-astar" : "water-jug-astar"}`,
                isPuzzle
                    ? { start, goal }
                    : {
                        start: jugStart,
                        goal: jugGoal,
                        capacity: jugCapacity,
                    }
            );
            setResult(res.data);
        } catch (err) {
            setResult(null);
            console.error(err);
            setError({error: "Invalid input or no solution found"});
        }
    };

    useEffect(() => {
        if (result?.path && Array.isArray(result.path)) {
            let i = 0;
            setAnimatedPath([]);
            setAnimationRunning(true);

            const interval = setInterval(() => {
                if (i < result.path.length) {
                    const state = result.path[i];
                    // Push any valid state (either 2D array or 2-element array)
                    if (
                        (isPuzzle && Array.isArray(state) && Array.isArray(state[0])) || // 8 Puzzle step
                        (!isPuzzle && Array.isArray(state) && state.length === 2)       // Water Jug step
                    ) {
                        setAnimatedPath((prev) => [...prev, state]);
                    }
                    i++;
                } else {
                    clearInterval(interval);
                    setAnimationRunning(false);
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [result, isPuzzle]);


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

    const renderJugInputRow = (label, value, onChange) => (
        <div>
            <label className="block mb-1 font-medium">{label}</label>
            <div className="flex gap-2">
                <input
                    type="number"
                    value={value[0]}
                    onChange={(e) => onChange([parseInt(e.target.value) || 0, value[1]])}
                    className="border p-2 w-full"
                    placeholder="Jug 1"
                />
                <input
                    type="number"
                    value={value[1]}
                    onChange={(e) => onChange([value[0], parseInt(e.target.value) || 0])}
                    className="border p-2 w-full"
                    placeholder="Jug 2"
                />
            </div>
        </div>
    );

    const renderStep = (state, index) => {
        if (isPuzzle) {
            return (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="p-4 border rounded-lg shadow bg-white/70 backdrop-blur-sm"
                >
                    <h3 className="text-sm font-medium mb-2">Step {index + 1}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {state.map((row, i) =>
                            row.map((cell, j) => (
                                <div
                                    key={`${i}-${j}`}
                                    className="w-16 h-12 flex items-center justify-center bg-white/50 border border-gray-100 text-lg font-semibold rounded-lg backdrop-blur-md shadow"
                                >
                                    {cell !== 0 ? cell : ""}
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>
            );
        } else {
            return (
                <motion.div
                    key={index}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex items-center space-x-2"
                >
                    <span className="px-3 py-2 border rounded-lg bg-slate-50 font-mono text-sm font-semibold">
                        ({state[0]}, {state[1]})
                    </span>
                    {index !== animatedPath.length - 1 && (
                        <span className="text-lg font-bold text-gray-600">
                            →
                        </span>
                    )}
                </motion.div>
            );
        }
    };

    return (
        <div className="relative min-h-screen">
            <div
                aria-hidden="true"
                className="fixed inset-0 -z-10"
            >
                <div
                    className="absolute inset-0 left-0 top-0 h-screen w-30 rotate-[0deg] bg-gradient-to-br from-[#ff80b5] to-[#8c84f1] opacity-40 blur-3xl"
                />
            </div>
            <div className="p-8 max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6 text-center z-10">A* Algorithm Visualiser</h1>

                <div className="flex justify-center">
                    <motion.button
                        onClick={() => {
                            setIsPuzzle((prev) => !prev);
                            setResult(null);
                            setError("");
                            setAnimatedPath([]);
                        }}
                        className="mb-6 px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700"
                        whileTap={{ scale: 0.95 }}
                    >
                        Switch to {isPuzzle ? "Water Jug" : "8 Puzzle"}
                    </motion.button>
                </div>

                <form
                    onSubmit={handleSubmit}
                >
                    {isPuzzle ? (
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
                    ) : (
                        <div className="grid grid-cols-1 gap-4 mb-4 [&>div>div>input]:rounded-lg">
                            {renderJugInputRow("Start State", jugStart, setJugStart)}
                            {renderJugInputRow("Goal State", jugGoal, setJugGoal)}
                            {renderJugInputRow("Jug Capacities", jugCapacity, setJugCapacity)}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition duration-200 mb-6"
                    >
                        Solve
                    </button>
                </form>

                {error && <p className="text-red-600 font-semibold text-center mt-4">{error}</p>}

                {animatedPath.length > 0 && (
                    isPuzzle ? (
                        <div>
                            <h2 className="text-xl font-semibold mb-4">
                                Solution ({animatedPath.length} steps):
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                <AnimatePresence>
                                    {animatedPath.map((state, index) => renderStep(state, index))}
                                </AnimatePresence>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h2 className="text-xl font-semibold mb-4">
                                Solution ({animatedPath.length} steps):
                            </h2>
                            <div className="flex flex-wrap gap-3 items-center">
                                <AnimatePresence>
                                    {animatedPath.map((state, idx) =>
                                        Array.isArray(state) && state.length === 2 ? (
                                            <motion.div
                                                key={idx}
                                                initial={{ scale: 0.5, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0.5, opacity: 0 }}
                                                transition={{ duration: 0.4 }}
                                                className="flex items-center space-x-2"
                                            >
                                                <span className="px-3 py-2 border rounded-lg bg-slate-50 font-mono text-sm font-semibold">
                                                    ({state[0]}, {state[1]})
                                                </span>
                                                {idx !== animatedPath.length - 1 && (
                                                    <span className="text-lg font-bold text-gray-600">
                                                        →
                                                    </span>
                                                )}
                                            </motion.div>
                                        ) : null
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

