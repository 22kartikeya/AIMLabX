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
    const [jugCapacity, setJugCapacity] = useState([3, 5]);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");
    const [animatedPath, setAnimatedPath] = useState([]);
    const [animationRunning, setAnimationRunning] = useState(false);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

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
        setAnimatedPath([]);
        setCurrentStepIndex(0);

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

            if (res.data?.path && res.data.path.length > 0) {
                setResult(res.data);
            } else {
                setError("Answer not possible");
                setResult(null);
            }
        } catch (err) {
            console.error(err);
            setResult(null);
            setError("Invalid input or no solution found");
        }
    };

    useEffect(() => {
        if (result?.path && Array.isArray(result.path)) {
            setAnimatedPath([]);
            setAnimationRunning(true);
            setCurrentStepIndex(0);

            const interval = setInterval(() => {
                setCurrentStepIndex(prevIndex => {
                    if (prevIndex < result.path.length - 1) {
                        return prevIndex + 1;
                    } else {
                        clearInterval(interval);
                        setAnimationRunning(false);
                        return prevIndex;
                    }
                });

                setAnimatedPath(prev => {
                    const currentPath = [...prev];
                    if (currentPath.length < result.path.length) {
                        return [...currentPath, result.path[currentPath.length]];
                    }
                    return currentPath;
                });
            }, 1500);

            return () => clearInterval(interval);
        }
    }, [result, isPuzzle]);

    const renderInputGrid = (boardType) => (
        <div className="grid grid-cols-3 gap-1">
            {(boardType === "start" ? start : goal).map((row, i) =>
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
                    className="border p-2 w-full rounded-lg"
                    placeholder="Jug 1"
                />
                <input
                    type="number"
                    value={value[1]}
                    onChange={(e) => onChange([value[0], parseInt(e.target.value) || 0])}
                    className="border p-2 w-full rounded-lg"
                    placeholder="Jug 2"
                />
            </div>
        </div>
    );

    const renderJug = (capacity, currentAmount, jugNum) => {
        const fillPercentage = (currentAmount / capacity) * 100;

        return (
            <div className="flex flex-col items-center">
                <p className="text-sm font-semibold mb-1">Jug {jugNum}</p>
                <div className="relative h-40 w-24 flex flex-col-reverse">
                    {/* Jug container */}
                    <div className="absolute inset-0 border-2 border-blue-700 rounded-md bg-white/60 overflow-hidden">
                        {/* Jug handle */}
                        <div className="absolute right-0 h-20 w-4 border-2 border-blue-700 translate-x-1/2 top-8 rounded-r-md"></div>

                        {/* Water fill animation */}
                        <motion.div
                            className="absolute bottom-0 w-full bg-blue-500/70"
                            initial={{ height: '0%' }}
                            animate={{ height: `${fillPercentage}%` }}
                            transition={{ duration: 1, ease: "easeInOut" }}
                        >
                            {/* Water ripple effect */}
                            <div className="absolute top-0 left-0 right-0 h-2 bg-blue-400/50"></div>
                        </motion.div>

                        {/* Capacity markings */}
                        {Array.from({ length: capacity + 1 }).map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-3 h-0.5 bg-gray-600 left-0"
                                style={{ bottom: `${(i / capacity) * 100}%` }}
                            />
                        ))}
                    </div>
                </div>
                <div className="bg-white/80 px-3 py-1 mt-2 rounded-full text-sm font-mono">
                    {currentAmount}/{capacity}L
                </div>
            </div>
        );
    };

    const getActionText = (prevState, currState) => {
        if (!prevState) return "Initial state";

        const [prevJug1, prevJug2] = prevState;
        const [currJug1, currJug2] = currState;

        if (prevJug1 > currJug1 && prevJug2 < currJug2) {
            return "Pour from Jug 1 to Jug 2";
        } else if (prevJug1 < currJug1 && prevJug2 > currJug2) {
            return "Pour from Jug 2 to Jug 1";
        } else if (prevJug1 < currJug1 && prevJug2 === currJug2) {
            return "Fill Jug 1";
        } else if (prevJug1 === currJug1 && prevJug2 < currJug2) {
            return "Fill Jug 2";
        } else if (prevJug1 > currJug1 && prevJug2 === currJug2) {
            return "Empty Jug 1";
        } else if (prevJug1 === currJug1 && prevJug2 > currJug2) {
            return "Empty Jug 2";
        }
        return "Move";
    };

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
                    <div className="grid grid-cols-3 gap-4">
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
            const previousState = index > 0 ? animatedPath[index - 1] : null;
            const actionText = getActionText(previousState, state);
            const isCurrentStep = index === currentStepIndex;

            return (
                <motion.div
                    key={index}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{
                        scale: 1,
                        opacity: 1,
                        boxShadow: isCurrentStep ? "0 0 15px rgba(79, 70, 229, 0.6)" : "none"
                    }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className={`p-6 border rounded-xl shadow-lg bg-white/80 backdrop-blur-md ${isCurrentStep ? "border-indigo-500 ring-2 ring-indigo-300" : "border-gray-200"
                        }`}
                >
                    <div className="text-center mb-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${isCurrentStep ? "bg-indigo-100 text-indigo-800" : "bg-gray-100 text-gray-600"
                            }`}>
                            Step {index + 1}
                        </span>
                    </div>

                    <div className="flex justify-center gap-12 mb-4">
                        {renderJug(jugCapacity[0], state[0], 1)}
                        {renderJug(jugCapacity[1], state[1], 2)}
                    </div>

                    <motion.div
                        className={`text-center font-medium px-3 py-2 rounded-lg ${isCurrentStep ? "bg-indigo-50 text-indigo-700" : "bg-gray-50 text-gray-600"
                            }`}
                        animate={{ y: isCurrentStep ? [0, -5, 0] : 0 }}
                        transition={{ repeat: isCurrentStep ? Infinity : 0, duration: 1.5 }}
                    >
                        {actionText}
                    </motion.div>
                </motion.div>
            );
        }
    };

    const renderJugSolution = () => {
        if (!animatedPath.length) return null;

        return (
            <div>
                <h2 className="text-xl font-semibold mb-6 text-center">
                    Solution Path ({animatedPath.length} steps)
                </h2>

                {/* Current step display */}
                <div className="mb-8">
                    <AnimatePresence mode="wait">
                        {animatedPath[currentStepIndex] && (
                            <motion.div
                                key={`current-${currentStepIndex}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex justify-center"
                            >
                                {renderStep(animatedPath[currentStepIndex], currentStepIndex)}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Steps timeline */}
                <div className="relative mb-8">
                    <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-200 -translate-y-1/2"></div>
                    <div className="flex justify-between relative">
                        {animatedPath.map((_, idx) => (
                            <motion.button
                                key={idx}
                                className={`w-6 h-6 rounded-full z-10 flex items-center justify-center text-xs ${idx <= currentStepIndex
                                        ? "bg-indigo-600 text-white"
                                        : "bg-white border border-gray-300 text-gray-500"
                                    }`}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => {
                                    setCurrentStepIndex(idx);
                                    setAnimatedPath(result.path.slice(0, idx + 1));
                                }}
                            >
                                {idx + 1}
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Controls */}
                <div className="flex justify-center gap-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:bg-gray-300"
                        disabled={currentStepIndex === 0}
                        onClick={() => {
                            if (currentStepIndex > 0) {
                                setCurrentStepIndex(prev => prev - 1);
                            }
                        }}
                    >
                        Previous
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg disabled:bg-gray-300"
                        disabled={animationRunning || currentStepIndex === result?.path.length - 1}
                        onClick={() => {
                            if (currentStepIndex < result?.path.length - 1) {
                                setCurrentStepIndex(prev => prev + 1);
                                setAnimatedPath(prev => [...prev, result.path[currentStepIndex + 1]]);
                            }
                        }}
                    >
                        Next
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg"
                        onClick={() => {
                            setCurrentStepIndex(0);
                            setAnimatedPath([result.path[0]]);
                        }}
                    >
                        Reset
                    </motion.button>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen relative isolate px-2 pt-0 lg:px-8">
                <div
                    aria-hidden="true"
                    className="absolute inset-x-0 -top-500 overflow-hidden blur-3xl -z-10"
                >
                    <div className="relative left-0 top-0 h-[600px] rotate-[0deg] bg-gradient-to-br from-[#ff80b5] to-[#8c84f1] opacity-60 blur-2xl" />
                </div>
            

            <div className="p-8 max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-6 text-center z-10">
                    A* Algorithm Visualizer
                </h1>

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

                <form onSubmit={handleSubmit} className="mb-8">
                    {isPuzzle ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="p-4 border rounded-lg shadow bg-white/70 backdrop-blur-sm">
                                <h2 className="text-lg font-semibold mb-2">Start State</h2>
                                {renderInputGrid("start")}
                            </div>
                            <div className="p-4 border rounded-lg shadow bg-white/70 backdrop-blur-sm">
                                <h2 className="text-lg font-semibold mb-2">Goal State</h2>
                                {renderInputGrid("goal")}
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-white/70 backdrop-blur-sm p-6 rounded-lg shadow">
                            {renderJugInputRow("Start State", jugStart, setJugStart)}
                            {renderJugInputRow("Goal State", jugGoal, setJugGoal)}
                            {renderJugInputRow("Jug Capacities", jugCapacity, setJugCapacity)}
                        </div>
                    )}

                    <div className="flex justify-center">
                        <motion.button
                            type="submit"
                            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-200 font-medium"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Solve with A*
                        </motion.button>
                    </div>
                </form>

                {error && !result && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-red-100 text-red-700 p-4 rounded-lg text-center font-medium mb-6"
                    >
                        {error}
                    </motion.div>
                )}

                {result && animatedPath.length === 0 && (
                    <div className="text-center font-medium text-gray-600 animate-pulse p-4">
                        <svg className="animate-spin h-6 w-6 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Preparing solution...
                    </div>
                )}

                {animatedPath.length > 0 && (
                    <div className="bg-white/50 backdrop-blur-md rounded-lg shadow-lg p-6">
                        {isPuzzle ? (
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
                            renderJugSolution()
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}