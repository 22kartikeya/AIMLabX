import React, { useState } from 'react';
import axios from 'axios';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { BACKEND_URL } from '../config';

const MarcusResolver = () => {
    const [premises, setPremises] = useState('');
    const [goal, setGoal] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleSubmit = async () => {
        setLoading(true);
        setResult(null);

        try {
            const response = await axios.post(`${BACKEND_URL}/api/custom-logic`, {
                premises: premises.split('\n').filter(Boolean),
                goal: goal
            });

            setTimeout(() => {
                setResult(response.data);
                setLoading(false);
            }, 1200);

        } catch (err) {
            console.error("Error:", err);
            setLoading(false);
        }
    };

    const handleSampleInput = () => {
        setPremises(`all x (man(x) -> mortal(x))\nall x (greek(x) -> man(x))\ngreek(marcus)`);
        setGoal("mortal(marcus)");
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative isolate px-6 pt-2 lg:px-8">
            <div
                aria-hidden="true"
                className="absolute inset-x-0 -top-500 overflow-hidden blur-3xl -z-10"
            >
                <div className="relative left-0 top-0 h-[700px] rotate-[0deg] bg-gradient-to-br from-[#ff80b5] to-[#8c84f1] opacity-60 blur-2xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9 }}
                className="w-full max-w-2xl rounded-2xl border border-white/20 bg-white/30 backdrop-blur-xl shadow-xl p-6"
            >
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-2xl font-bold mb-6 text-center text-gray-800"
                >
                    Marcus Logic Resolver
                </motion.h1>

                <textarea
                    value={premises}
                    onChange={(e) => setPremises(e.target.value)}
                    placeholder="Enter premises (one per line)"
                    className="w-full p-3 border border-gray-300 rounded-lg mb-4 bg-white/80 backdrop-blur-sm"
                    rows={4}
                />
                <input
                    type="text"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="Enter goal statement"
                    className="w-full p-3 border border-gray-300 rounded-lg mb-4 bg-white/80 backdrop-blur-sm"
                />

                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <button
                        onClick={handleSampleInput}
                        className="w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition font-medium"
                    >
                        Use Sample Input
                    </button>

                    <button
                        onClick={handleSubmit}
                        className="w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition font-medium"
                    >
                        Resolve Logic
                    </button>
                </div>

                {loading && (
                    <motion.p
                        className="mt-4 text-gray-700 font-medium animate-pulse text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        Resolving...
                    </motion.p>
                )}

                {result && (
                    <motion.div
                        className="mt-6 bg-white/70 backdrop-blur-md shadow-md rounded-lg p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2
                            className={`text-xl font-semibold mb-2 ${result.success ? 'text-green-600' : 'text-red-600'
                                }`}
                        >
                            {result.success ? "✔ Logic Proven!" : "✘ Could Not Prove"}
                        </h2>

                        <h3 className="text-lg font-bold mt-4 mb-2 text-gray-800">
                            🧩 Explanation Breakdown:
                        </h3>

                        <ul className="list-inside text-gray-900">
                            {result.explanation.map((step, index) => (
                                <li key={index} className="mb-1">{step}</li>
                            ))}
                        </ul>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
};

export default MarcusResolver;