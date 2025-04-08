import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { BACKEND_URL } from "../config";

const EmptyBoard = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
];

export default function AstarEightPuzzle() {
    const [isPuzzle, setIsPuzzle] = useState(true);
    const [start, setStart] = useState(EmptyBoard);
    const [goal, setGoal] = useState(EmptyBoard);
    const [jugStart, setJugStart] = useState([0, 0]);
    const [jugGoal, setJugGoal] = useState([0, 0]);
    const [jugCapacity, setJugCapacity] = useState([0, 0]);
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
            setError("Invalid input or no solution found");
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
                    setAnimatedPath((prev) => [...prev, state]);
                    i++;
                } else {
                    clearInterval(interval);
                    setAnimationRunning(false);
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [result]);

    const renderInputGrid = (boardType) => (
        <div className="grid grid-cols-3 gap-2">
            {(boardType === "start" ? start : goal).map((row, i) =>
                row.map((cell, j) => (
                    <input
                        key={`${i}-${j}-${boardType}`}
                        type="text"
                        className="w-16 h-12 text-center border border-gray-300 rounded-lg bg-white/70"
                        value={cell}
                        onChange={(e) => handleChange(boardType, i, j, e.target.value)}
                    />
                ))
            )}
        </div>
    );

    const renderJugInputRow = (label, values, setValues) => (
        <div>
            <label className="block font-semibold mb-1">{label}</label>
            <div className="flex gap-4">
                <input
                    type="number"
                    className="w-full border rounded-lg px-4 py-2"
                    value={values[0]}
                    onChange={(e) => setValues([parseInt(e.target.value) || 0, values[1]])}
                    placeholder="Jug 1"
                />
                <input
                    type="number"
                    className="w-full border rounded-lg px-4 py-2"
                    value={values[1]}
                    onChange={(e) => setValues([values[0], parseInt(e.target.value) || 0])}
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
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    className="p-4 bg-white rounded-lg shadow"
                >
                    <h3 className="text-sm font-medium mb-2">Step {index + 1}</h3>
                    <div className="grid grid-cols-3 gap-2">
                        {state.map((row, i) =>
                            row.map((cell, j) => (
                                <div
                                    key={`${i}-${j}`}
                                    className="w-12 h-10 flex items-center justify-center bg-white/60 border rounded-lg"
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
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    className="p-4 bg-white rounded-lg shadow"
                >
                    <h3 className="text-sm font-medium mb-2">Step {index + 1}</h3>
                    <div className="flex justify-between text-center text-lg">
                        <div className="flex-1">Jug 1: {state[0]}</div>
                        <div className="flex-1">Jug 2: {state[1]}</div>
                    </div>
                </motion.div>
            );
        }
    };

    return (
        <div className="min-h-screen p-6 bg-gradient-to-br from-pink-200 to-indigo-200">
            <motion.h1
                className="text-3xl font-bold mb-6 text-center"
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                A* Algorithm Visualizer
            </motion.h1>

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
                className="bg-white p-6 rounded-xl shadow-md max-w-xl mx-auto space-y-4"
            >
                {isPuzzle ? (
                    <>
                        <div>
                            <label className="block font-semibold mb-1">Start State</label>
                            {renderInputGrid("start")}
                        </div>
                        <div>
                            <label className="block font-semibold mb-1">Goal State</label>
                            {renderInputGrid("goal")}
                        </div>
                    </>
                ) : (
                    <>
                        {renderJugInputRow("Start State (Jug 1 & Jug 2)", jugStart, setJugStart)}
                        {renderJugInputRow("Goal State (Jug 1 & Jug 2)", jugGoal, setJugGoal)}
                        {renderJugInputRow("Jug Capacities (Jug 1 & Jug 2)", jugCapacity, setJugCapacity)}
                    </>
                )}

                <motion.button
                    type="submit"
                    className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow"
                    whileTap={{ scale: 0.95 }}
                >
                    Solve
                </motion.button>
            </form>

            {error && <p className="text-red-600 font-semibold text-center mt-4">{error}</p>}

            {animatedPath.length > 0 && (
                <div className="mt-8 max-w-4xl mx-auto">
                    <h2 className="text-xl font-semibold mb-4 text-center">
                        Animated Solution ({animatedPath.length} steps)
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        <AnimatePresence>
                            {animatedPath.map((state, index) => renderStep(state, index))}
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </div>
    );
}
