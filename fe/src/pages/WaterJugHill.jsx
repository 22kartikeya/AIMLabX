import { useState, useEffect } from "react";
import axios from "axios";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { BACKEND_URL } from "../config";

export default function WaterJugHill() {
    const [start, setStart] = useState([ ]);
    const [goal, setGoal] = useState([ ]);
    const [capacities, setCapacities] = useState([ ]);
    const [result, setResult] = useState(null);

    const [animatedPath, setAnimatedPath] = useState([]);
    const [animationRunning, setAnimationRunning] = useState(false);

    const handleSolve = async () => {
        try {
            const res = await axios.post(`${BACKEND_URL}/api/water-jug-hill`, {
                start,
                goal,
                capacities,
            });
            setResult(res.data);
        } catch (err) {
            console.error(err);
            setResult({ error: "Something went wrong." });
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
                    if (Array.isArray(state) && state.length === 2) {
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
    }, [result]);

    const inputBox = (label, value, onChange) => (
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

    return (
        <div className="flex flex-col items-center justify-center min-h-screen relative isolate px-2 pt-0 lg:px-8">
            <div
                aria-hidden="true"
                className="absolute inset-0 -z-10 overflow-hidden blur-3xl"
            >
                <div
                    className="absolute top-0 left-0 h-full w-full bg-gradient-to-br from-[#ff80b5] to-[#8c84f1] opacity-50"
                />
            </div>
            <div className="relative max-w-xl mx-auto px-6 lg:px-8 z-10">
                <h1 className="text-2xl font-bold mb-6 text-center">
                    Water Jug problem using Hill Climbing
                </h1>

                <div className="grid grid-cols-1 gap-4 mb-4 [&>div>div>input]:rounded-lg">
                    {inputBox("Start State", start, setStart)}
                    {inputBox("Goal State", goal, setGoal)}
                    {inputBox("Jug Capacities", capacities, setCapacities)}
                </div>

                <button
                    onClick={handleSolve}
                    className="bg-indigo-600 text-white px-4 py-2 mb-4 rounded-lg hover:bg-indigo-700 w-full"
                    disabled={animationRunning}
                >
                    Solve
                </button>

                <div className="mt-6 min-h-[180px]">
                {result && (
                        result.error ? (
                            <p className="text-red-500">{result.error}</p>
                        ) : (
                            <>
                                <p className="font-semibold mb-4 text-lg">Path:</p>
                                <div className="flex gap-2 flex-wrap justify-center">
                                    <AnimatePresence mode="wait">
                                        <div className="flex flex-wrap gap-2 justify-center items-center">
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
                                        </div>
                                    </AnimatePresence>
                                </div>
                                <p
                                    className={`mt-4 mb-36 text-center font-medium ${result.success
                                        ? "text-green-700"
                                        : "text-red-600"
                                        }`}
                                >
                                    {result.success
                                        ? "Goal reached!"
                                        : "Could not reach goal"}
                                </p>
                            </>
                        )
                    )}
                </div>
            </div>
        </div>
    );
    
}