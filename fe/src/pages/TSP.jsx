import React, { useState } from 'react';
import axios from 'axios';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { BACKEND_URL } from '../config';

export default function TSP() {
    const cities = ['A', 'B', 'C', 'D'];
    const [method, setMethod] = useState('dfs');
    const [start, setStart] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [resolving, setResolving] = useState(false);
    const [matrix, setMatrix] = useState(() =>
        cities.reduce((acc, from) => {
            acc[from] = {};
            cities.forEach(to => {
                if (from !== to) acc[from][to] = '';
            });
            return acc;
        }, {})
    );

    const handleInputChange = (from, to, value) => {
        setMatrix(prev => ({
            ...prev,
            [from]: {
                ...prev[from],
                [to]: value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setResult(null);
        setError('');
        setResolving(true);

        if (!cities.includes(start)) {
            setResolving(false);
            setError(`Start node must be one of: ${cities.join(', ')}`);
            return;
        }

        for (let from of cities) {
            for (let to of cities) {
                if (from !== to && matrix[from][to] === '') {
                    setResolving(false);
                    setError(`Please fill all distance fields between ${from} and ${to}.`);
                    return;
                }
            }
        }

        try {
            const graph = {};
            for (let from of cities) {
                graph[from] = {};
                for (let to in matrix[from]) {
                    graph[from][to] = parseInt(matrix[from][to], 10);
                }
            }

            const response = await axios.post(`${BACKEND_URL}/api/tsp`, { graph, start, method });
            setTimeout(() => {
                setResult(response.data);
                setResolving(false);
            }, 1000);
        } catch (err) {
            setError(err.response?.data?.error || 'Something went wrong. Check your inputs.');
            setResolving(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative isolate px-6 pt-2 lg:px-8">
            <div
                aria-hidden="true"
                className="absolute inset-0 z-0 rotate-[0deg] bg-gradient-to-br from-[#ff80b5] to-[#8c84f1] opacity-60 blur-3xl"
            />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9 }}
                className="w-full max-w-5xl rounded-2xl border border-white/20 bg-white/30 backdrop-blur-xl shadow-xl p-6 z-10"
            >
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Travelling Salesman Problem (DFS / BFS)</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block font-semibold text-gray-700 mb-1">Choose Algorithm</label>
                        <select
                            value={method}
                            onChange={(e) => setMethod(e.target.value)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-2 py-1"
                        >
                            <option value="dfs">DFS</option>
                            <option value="bfs">BFS</option>
                        </select>
                    </div>

                    <div>
                        <label className="block font-semibold text-gray-700 mb-2">Graph Adjacency Matrix</label>
                        <div className="overflow-auto rounded-md border border-gray-300 bg-white/80 backdrop-blur-sm">
                            <table className="table-auto border-collapse w-full">
                                <thead>
                                    <tr>
                                        <th></th>
                                        {cities.map(to => (
                                            <th key={to} className="border px-3 py-2">{to}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {cities.map(from => (
                                        <tr key={from}>
                                            <th className="border px-3 py-2">{from}</th>
                                            {cities.map(to => (
                                                <td key={to} className="border px-2 py-1">
                                                    {from === to ? (
                                                        "-"
                                                    ) : (
                                                        <input
                                                            type="number"
                                                            value={matrix[from][to] || ''}
                                                            onChange={(e) => handleInputChange(from, to, e.target.value)}
                                                            className="w-full border rounded px-2 py-1 text-sm text-center"
                                                        />
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div>
                        <label className="block font-semibold text-gray-700">Start Node</label>
                        <input
                            type="text"
                            value={start}
                            onChange={(e) => setStart(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 px-2 py-1"
                            placeholder="A"
                            required
                        />
                    </div>

                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="w-48 bg-indigo-600 text-white py-2 rounded-md font-semibold hover:bg-indigo-700 transition"
                        >
                            Solve
                        </button>
                    </div>
                </form>
                {resolving && (
                    <motion.p
                        className="mt-4 text-gray-700 font-medium animate-pulse text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        Resolving...
                    </motion.p>
                )}

                {error && <p className="mt-4 text-red-800 text-center font-medium">{error}</p>}

                {result && (
                    <motion.div
                        className="mt-6 rounded-lg p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="font-bold text-lg text-gray-800">Result:</h2>
                        <p><strong>Path:</strong> {result.path.join(' → ')}</p>
                        <p><strong>Total Cost:</strong> {result.cost}</p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}