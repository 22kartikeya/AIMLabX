import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { BACKEND_URL } from '../config';

const MarcusResolver = () => {
    const [premises, setPremises] = useState(["all x (man(x) -> mortal(x))", "man(marcus)"]);
    const [goal, setGoal] = useState("mortal(marcus)");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState("");

    const handlePremiseChange = (value, index) => {
        const updated = [...premises];
        updated[index] = value;
        setPremises(updated);
    };

    const addPremise = () => setPremises([...premises, ""]);

    const handleResolve = async () => {
        setLoading(true);
        setSuccess(null);
        setError("");

        try {
            const response = await axios.post(`${BACKEND_URL}/api/marcus`, { premises, goal });
            setSuccess(response.data.success);
            setError(response.data.error || "");
        } catch (err) {
            setSuccess(false);
            console.log(err);
            setError("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 space-y-4">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-2xl font-bold mb-4"
            >
                Marcus Logic Resolver
            </motion.h1>

            <div className="w-full max-w-2xl space-y-4">
                <h2 className="text-lg font-semibold">Premises</h2>
                {premises.map((p, idx) => (
                    <input
                        key={idx}
                        type="text"
                        value={p}
                        onChange={(e) => handlePremiseChange(e.target.value, idx)}
                        className="w-full p-2 border rounded-lg shadow"
                        placeholder={`Premise ${idx + 1}`}
                    />
                ))}
                <button onClick={addPremise} className="text-sm text-indigo-700 underline">
                    + Add Premise
                </button>

                <h2 className="text-lg font-semibold">Goal</h2>
                <input
                    type="text"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full p-2 border rounded-lg shadow"
                    placeholder="Goal (e.g. mortal(marcus))"
                />

                <button
                    onClick={handleResolve}
                    className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                    Resolve Logic
                </button>

                <div className="mt-6">
                    <AnimatePresence>
                        {loading && (
                            <motion.p
                                className="text-gray-600 text-lg animate-pulse"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                Preparing solution...
                            </motion.p>
                        )}

                        {success === true && !loading && (
                            <motion.div
                                className="text-green-700 font-semibold mt-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                ✔ The logic is valid (proved).
                            </motion.div>
                        )}

                        {success === false && !loading && (
                            <motion.div
                                className="text-red-600 font-semibold mt-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                ✘ Could not prove the logic.
                                {error && <p className="text-sm text-gray-500 mt-1">{error}</p>}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default MarcusResolver;